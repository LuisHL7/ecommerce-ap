<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SubFamilies;
use App\Models\Families;
use App\Models\Products;
use App\Models\Variants;
use App\Models\Address;
use App\Models\Orders;
use App\Models\Company;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use DateTime;
use Illuminate\Support\Facades\Date;

class UpdateData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'database:update';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fecth data from Holded API and update database';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Deleting old data...');
        Storage::deleteDirectory('public/products');
        $this->info('Deleted all data from database');
        $this->info('Fetching data from Holded API');

        $products = Http::withHeaders([
            'Accept' => 'application/json',
            'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
        ])->get('https://api.holded.com/api/invoicing/v1/products')->json();

        $contacts = Http::withHeaders([
            'Accept' => 'application/json',
            'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
        ])->get('https://api.holded.com/api/invoicing/v1/contacts')->json();

        $documents = Http::withHeaders([
            'Accept' => 'application/json',
            'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
        ])->get('https://api.holded.com/api/invoicing/v1/documents/salesorder')->json();

        $this->info('Data fetched from Holded API');

        $this->info('Updating database...');

        foreach ($contacts as $contact) {
            if($contact['type'] == 'client'){
                if(!Company::where('holded_id', $contact['id'])->exists()) {
                    Company::create([
                        'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                        'email' => strtolower($contact['email']),
                        'phone' => $contact['phone'] !== '' ? $contact['phone'] : ($contact['mobile'] !== '' ? $contact['mobile'] : null),
                        'holded_id' => $contact['id'],
                        'currency' => $contact['defaults']['currency'],
                        'language' => $contact['defaults']['language'],
                        'type' => $contact['type'] == 0 || $contact['type'] == null ? 'other': $contact['type'],
                        'code' => $contact['code'],
                    ]);
                    foreach ($contact['shippingAddresses'] as $address) {
                        Address::create([
                            'company_id' => Company::where('holded_id', $contact['id'])->first()->id,
                            'address' => $address['address'],
                            'city' => $address['city'],
                            'state' => $address['province'],
                            'zip' => $address['postalCode'],
                            'country' => $address['country'],
                            'country_code' => $address['countryCode'],
                            'shippingId' => $address['shippingId'],
                            'type' => 'shipping',
                        ]);
                    }
                    Address::create([
                        'company_id' => Company::where('holded_id', $contact['id'])->first()->id,
                        'address' => $contact['billAddress']['address'],
                        'city' => $contact['billAddress']['city'],
                        'state' => $contact['billAddress']['province'],
                        'zip' => $contact['billAddress']['postalCode'],
                        'country' => $contact['billAddress']['country'],
                        'country_code' => $contact['billAddress']['countryCode'] ?? '',
                        'type' => 'billing',
                    ]);
                    if($contact['email'] == '' || $contact['email'] == null){
                        $this->info('User without email: ' . $contact['name']);
                        continue;
                    }
                    if(User::where('email', strtolower($contact['email']))->doesntExist()) {
                        $user = User::create([
                            'name' => strtolower($contact['clientRecord']['name'] ?? $contact['name']),
                            'email' => strtolower($contact['email']),
                            'password' => bcrypt('access2022'),
                            'locale' => strtolower($contact['billAddress']['countryCode']),
                        ]);
                        $user->companies()->attach(Company::where('holded_id', $contact['id'])->first());
                    } else {
                        User::where('email', strtolower($contact['email']))->update([
                            'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                            'locale' => strtolower($contact['billAddress']['countryCode']),
                        ]);
                        if(!User::where('email', strtolower($contact['email']))->first()->companies->contains(Company::where('holded_id', $contact['id'])->first())) {
                            User::where('email', strtolower($contact['email']))->first()->companies()->attach(Company::where('holded_id', $contact['id'])->first());
                        }
                    }
                } else {
                    Company::where('holded_id', $contact['id'])->update([
                        'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                        'email' => strtolower($contact['email']),
                        'phone' => $contact['phone'] !== '' ? $contact['phone'] : ($contact['mobile'] !== '' ? $contact['mobile'] : null),
                        'currency' => $contact['defaults']['currency'],
                        'language' => $contact['defaults']['language'],
                        'type' => $contact['type'] == 0 || $contact['type'] == null ? 'other': $contact['type'],
                        'code' => $contact['code'],
                    ]);
                    foreach ($contact['shippingAddresses'] as $address) {
                        if(!Address::where('company_id', Company::where('holded_id', $contact['id'])->first()->id)->where('address', $address['address'])->exists()) {
                            Address::create([
                                'company_id' => Company::where('holded_id', $contact['id'])->first()->id,
                                'address' => $address['address'],
                                'city' => $address['city'],
                                'state' => $address['province'],
                                'zip' => $address['postalCode'],
                                'country' => $address['country'],
                                'country_code' => $address['countryCode'] ?? '',
                                'shippingId' => $address['shippingId'],
                                'type' => 'shipping',
                            ]);
                        } else {
                            Address::where('company_id', Company::where('holded_id', $contact['id'])->first()->id)->where('address', $address['address'])->update([
                                'city' => $address['city'],
                                'state' => $address['province'],
                                'zip' => $address['postalCode'],
                                'country' => $address['country'],
                                'country_code' => $address['countryCode'] ?? '',
                                'shippingId' => $address['shippingId'],
                                'type' => 'shipping',
                            ]);
                        }
                    }
                    if(!Address::where('company_id', Company::where('holded_id', $contact['id'])->first()->id)->where('address', $contact['billAddress']['address'])->exists()) {
                        Address::create([
                            'company_id' => Company::where('holded_id', $contact['id'])->first()->id,
                            'address' => $contact['billAddress']['address'],
                            'city' => $contact['billAddress']['city'],
                            'state' => $contact['billAddress']['province'],
                            'zip' => $contact['billAddress']['postalCode'],
                            'country' => $contact['billAddress']['country'],
                            'country_code' => $contact['billAddress']['countryCode'] ?? '',
                            'type' => 'billing',
                        ]);
                    } else {
                        Address::where('company_id', Company::where('holded_id', $contact['id'])->first()->id)->where('address', $contact['billAddress']['address'])->update([
                            'city' => $contact['billAddress']['city'],
                            'state' => $contact['billAddress']['province'],
                            'zip' => $contact['billAddress']['postalCode'],
                            'country' => $contact['billAddress']['country'],
                            'country_code' => $contact['billAddress']['countryCode'] ?? '',
                            'type' => 'billing',
                        ]);
                    }
                    if($contact['email'] == '' || $contact['email'] == null){
                        $this->info('User without email: ' . $contact['name']);
                        continue;
                    }
                    if(User::where('email', strtolower($contact['email']))->doesntExist()) {
                        $user = User::create([
                            'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                            'email' => strtolower($contact['email']),
                            'password' => bcrypt('access2022'),
                            'locale' => strtolower($contact['billAddress']['countryCode']),
                        ]);
                        $user->companies()->attach(Company::where('holded_id', $contact['id'])->first());
                    } else {
                        User::where('email', strtolower($contact['email']))->update([
                            'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                            'locale' => strtolower($contact['billAddress']['countryCode']),
                        ]);
                        if(!User::where('email', strtolower($contact['email']))->first()->companies->contains(Company::where('holded_id', $contact['id'])->first())) {
                            User::where('email', strtolower($contact['email']))->first()->companies()->attach(Company::where('holded_id', $contact['id'])->first());
                        }
                    }
                }
            }
            if($contact['id'] == '626ff2a8e93440dc580453dc') {
                if(!Company::where('holded_id', $contact['id'])->exists()) {
                    Company::create([
                        'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                        'email' => strtolower($contact['email']),
                        'phone' => $contact['phone'] !== '' ? $contact['phone'] : ($contact['mobile'] !== '' ? $contact['mobile'] : null),
                        'holded_id' => $contact['id'],
                        'currency' => $contact['defaults']['currency'],
                        'language' => $contact['defaults']['language'],
                        'type' => $contact['type'] == 0 || $contact['type'] == null ? 'other': $contact['type'],
                        'code' => $contact['code'],
                    ]);
                    foreach ($contact['shippingAddresses'] as $address) {
                        Address::create([
                            'company_id' => Company::where('holded_id', $contact['id'])->first()->id,
                            'address' => $address['address'],
                            'city' => $address['city'],
                            'state' => $address['province'],
                            'zip' => $address['postalCode'],
                            'country' => $address['country'],
                            'country_code' => $address['countryCode'] ?? '',
                            'shippingId' => $address['shippingId'],
                            'type' => 'shipping',
                        ]);
                    }
                    Address::create([
                        'company_id' => Company::where('holded_id', $contact['id'])->first()->id,
                        'address' => $contact['billAddress']['address'],
                        'city' => $contact['billAddress']['city'],
                        'state' => $contact['billAddress']['province'],
                        'zip' => $contact['billAddress']['postalCode'],
                        'country' => $contact['billAddress']['country'],
                        'country_code' => $contact['billAddress']['countryCode'] ?? '',
                        'type' => 'billing',
                    ]);
                    if($contact['email'] == '' || $contact['email'] == null){
                        $this->info('User without email: ' . $contact['clientRecord']['name'] ?? $contact['name']);
                        continue;
                    }
                    if(User::where('email', strtolower($contact['email']))->doesntExist()) {
                        $user = User::create([
                            'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                            'email' => strtolower($contact['email']),
                            'password' => bcrypt('access2022'),
                            'locale' => strtolower($contact['billAddress']['countryCode']),
                        ]);
                        $user->companies()->attach(Company::where('holded_id', $contact['id'])->first());
                    } else {
                        User::where('email', strtolower($contact['email']))->update([
                            'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                            'locale' => strtolower($contact['billAddress']['countryCode']),
                        ]);
                        if(!User::where('email', strtolower($contact['email']))->first()->companies->contains(Company::where('holded_id', $contact['id'])->first())) {
                            User::where('email', strtolower($contact['email']))->first()->companies()->attach(Company::where('holded_id', $contact['id'])->first());
                        }
                    }
                } else {
                    Company::where('holded_id', $contact['id'])->update([
                        'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                        'email' => strtolower($contact['email']),
                        'phone' => $contact['phone'] !== '' ? $contact['phone'] : ($contact['mobile'] !== '' ? $contact['mobile'] : null),
                        'currency' => $contact['defaults']['currency'],
                        'language' => $contact['defaults']['language'],
                        'type' => $contact['type'] == 0 || $contact['type'] == null ? 'other': $contact['type'],
                        'code' => $contact['code'],
                    ]);
                    foreach ($contact['shippingAddresses'] as $address) {
                        if(!Address::where('company_id', Company::where('holded_id', $contact['id'])->first()->id)->where('address', $address['address'])->exists()) {
                            Address::create([
                                'company_id' => Company::where('holded_id', $contact['id'])->first()->id,
                                'address' => $address['address'],
                                'city' => $address['city'],
                                'state' => $address['province'],
                                'zip' => $address['postalCode'],
                                'country' => $address['country'],
                                'country_code' => $address['countryCode'] ?? '',
                                'shippingId' => $address['shippingId'],
                                'type' => 'shipping',
                            ]);
                        } else {
                            Address::where('company_id', Company::where('holded_id', $contact['id'])->first()->id)->where('address', $address['address'])->update([
                                'city' => $address['city'],
                                'state' => $address['province'],
                                'zip' => $address['postalCode'],
                                'country' => $address['country'],
                                'country_code' => $address['countryCode'] ?? '',
                                'shippingId' => $address['shippingId'],
                            ]);
                        }
                    }
                    if(!Address::where('company_id', Company::where('holded_id', $contact['id'])->first()->id)->where('address', $contact['billAddress']['address'])->exists()) {
                        Address::create([
                            'company_id' => Company::where('holded_id', $contact['id'])->first()->id,
                            'address' => $contact['billAddress']['address'],
                            'city' => $contact['billAddress']['city'],
                            'state' => $contact['billAddress']['province'],
                            'zip' => $contact['billAddress']['postalCode'],
                            'country' => $contact['billAddress']['country'],
                            'country_code' => $contact['billAddress']['countryCode'] ?? '',
                            'type' => 'billing',
                        ]);
                    } else {
                        Address::where('company_id', Company::where('holded_id', $contact['id'])->first()->id)->where('address', $contact['billAddress']['address'])->update([
                            'city' => $contact['billAddress']['city'],
                            'state' => $contact['billAddress']['province'],
                            'zip' => $contact['billAddress']['postalCode'],
                            'country' => $contact['billAddress']['country'],
                            'country_code' => $contact['billAddress']['countryCode'] ?? '',
                        ]);
                    }
                    if($contact['email'] == '' || $contact['email'] == null){
                        $this->info('User without email: ' . $contact['clientRecord']['name'] ?? $contact['name']);
                        continue;
                    }
                    if(User::where('email', strtolower($contact['email']))->doesntExist()) {
                        $user = User::create([
                            'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                            'email' => strtolower($contact['email']),
                            'password' => bcrypt('access2022'),
                            'locale' => strtolower($contact['billAddress']['countryCode']),
                        ]);
                        $user->companies()->attach(Company::where('holded_id', $contact['id'])->first());
                    } else {
                        User::where('email', strtolower($contact['email']))->update([
                            'name' => $contact['clientRecord']['name'] ?? $contact['name'],
                            'locale' => strtolower($contact['billAddress']['countryCode']),
                        ]);
                        if(!User::where('email', strtolower($contact['email']))->first()->companies->contains(Company::where('holded_id', $contact['id'])->first())) {
                            User::where('email', strtolower($contact['email']))->first()->companies()->attach(Company::where('holded_id', $contact['id'])->first());
                        }
                    }
                }
            }
        }

        $this->info('Companies updated');

        $this->info('Updating products');
        foreach ($products as $p) {
            if(!array_key_exists('variants', $p)) {
                $this->info('Product without variants: ' . $p['name']);
                continue;
            }
            if(!Products::where('holded_id', $p['id'])->exists()) {
            $product = new Products();
            $product->name = $p['name'];
            $product->holded_id = $p['id'];
            $product->price_spain = $p['price'];
            $product->stock = $p['stock'];
            foreach($p['attributes'] as $atribute) {
                if($atribute['name'] === 'FAMILIA / FAMILY') {
                    if(!Families::where('name', $atribute['value'])->exists()) {
                        Families::create([
                            'name' => $atribute['value'],
                        ]);
                    }
                    $product->family_id = Families::where('name', $atribute['value'])->first()->id;
                }
            }
            foreach($p['attributes'] as $atribute) {
                if($atribute['name'] === 'SUBFAMILIA / SUBFAMILY') {
                    if(!SubFamilies::where('name', $atribute['value'])->exists()) {
                        SubFamilies::create([
                            'name' => $atribute['value'],
                            'family_id' => $product->family_id,
                        ]);
                    }
                    $product->subfamily_id = SubFamilies::where('name', $atribute['value'])->first()->id;
                }
            }
            foreach($p['attributes'] as $atribute) {
                if($atribute['name'] === 'COLECCIÓN / COLLECTION') {
                    $product->season = $atribute['value'];
                }
            }

            $ImagesList = Http::withHeaders([
                'Accept' => 'application/json',
                'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
            ])->get('https://api.holded.com/api/invoicing/v1/products/'.$p['id'].'/imagesList')->json();

           
            if(Storage::exists('public/media/'.$p['name'].'_A.jpg')) {
                $product->main_HD = Storage::url('public/media/'.$p['name'].'_A.jpg');
            } else if(Storage::exists('public/media/'.$p['name']. '1.jpg')) {
                $product->main_HD = Storage::url('public/media/'.$p['name'].'1.jpg');
            } else {
                foreach($ImagesList['extraimages'] as $imageName) {
                    $image = Http::withHeaders([
                        'Accept' => 'application/json',
                        'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
                    ])->get('https://api.holded.com/api/invoicing/v1/products/'.$p['id'].'/image/'.$imageName)->body();
    
                    if(isset($ImagesList['extraimages'][0]) && $ImagesList['extraimages'][0] === $imageName) {
                        Storage::put('public/products/'.$imageName, $image);
                        $product->main_image = Storage::url('public/products/'.$imageName);
                    }

                }
    
            }

            if(Storage::exists('public/media/'.$p['name'].'_B.jpg')) {
                $product->second_HD = Storage::url('public/media/'.$p['name'].'_B.jpg');
            } else if(Storage::exists('public/media/'.$p['name'].'2.jpg')) {
                $product->second_HD = Storage::url('public/media/'.$p['name'].'2.jpg');
            }  else {
                foreach($ImagesList['extraimages'] as $imageName) {
                    $image = Http::withHeaders([
                        'Accept' => 'application/json',
                        'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
                    ])->get('https://api.holded.com/api/invoicing/v1/products/'.$p['id'].'/image/'.$imageName)->body();
    
                    if(isset($ImagesList['extraimages'][1]) && $ImagesList['extraimages'][1] === $imageName) {
                        Storage::put('public/products/'.$imageName, $image);
                        $product->second_image = Storage::url('public/products/'.$imageName);
                    }
                }
    
            }

            if(Storage::exists('public/media/'.$p['name'].'_C.jpg')) {
                $product->third_HD = Storage::url('public/media/'.$p['name'].'_C.jpg');
            } else if(Storage::exists('public/media/'.$p['name'].'3.jpg')) {
                $product->third_HD = Storage::url('public/media/'.$p['name'].'3.jpg');
            } else {
                foreach($ImagesList['extraimages'] as $imageName) {
                    $image = Http::withHeaders([
                        'Accept' => 'application/json',
                        'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
                    ])->get('https://api.holded.com/api/invoicing/v1/products/'.$p['id'].'/image/'.$imageName)->body();
    
                    if(isset($ImagesList['extraimages'][2]) && $ImagesList['extraimages'][2] === $imageName) {
                        Storage::put('public/products/'.$imageName, $image);
                        $product->third_image = Storage::url('public/products/'.$imageName);
                    }
                }
    
            }
            $product->save();
            
            foreach($p['variants'] as $v) {
                $variant = new Variants();
                $variant->sku = $v['sku'];                
                $variant->holded_id = $v['id'];
                $variant->stock = $v['stock'];
                $variant->barcode = $v['barcode'];
                $variant->products_id = $product->id;
                foreach($v['categoryFields'] as $categoryField) {
                    if($categoryField['name'] === 'TALLAS / SIZES') {
                        $variant->size = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'COLOR / COLOR') {
                        $variant->color = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'DESCRIPT / FABRIC') {
                        $variant->description = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'VERSION / VERSION') {
                        $variant->name = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'PVPR ES') {
                        $variant->pvp_spain = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'Dosier') {
                        $variant->dosier = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'SUBT FAI') {
                        $variant->price_fai = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'SUBT ES') {
                        $variant->price_spain = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'SUBT GB') {
                        $variant->price_gb = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'PVPR FAI') {
                        $variant->pvp_fai = $categoryField['field'];
                    }

                    if($categoryField['name'] === 'PVPR GB') {
                        $variant->pvp_gb = $categoryField['field'];
                    }
                }
                $variant->save();
            }
            $product->dosier = Variants::where('products_id', $product->id)->first()->dosier;
            $product->save();
            } else {
                Products::where('holded_id', $p['id'])->update([
                    'name' => $p['name'],
                    'price_spain' => $p['price'],
                    'stock' => $p['stock'],
                ]);
                foreach($p['attributes'] as $atribute) {
                    if($atribute['name'] === 'FAMILIA / FAMILY') {
                        if(!Families::where('name', $atribute['value'])->exists()) {
                            Families::create([
                                'name' => $atribute['value'],
                            ]);
                        }
                        Products::where('holded_id', $p['id'])->update([
                            'family_id' => Families::where('name', $atribute['value'])->first()->id,
                        ]);
                    }
                }
                foreach($p['attributes'] as $atribute) {
                    if($atribute['name'] === 'SUBFAMILIA / SUBFAMILY') {
                        if(!SubFamilies::where('name', $atribute['value'])->exists()) {
                            SubFamilies::create([
                                'name' => $atribute['value'],
                                'family_id' => Products::where('holded_id', $p['id'])->first()->family_id,
                            ]);
                        }
                        Products::where('holded_id', $p['id'])->update([
                            'subfamily_id' => SubFamilies::where('name', $atribute['value'])->first()->id,
                        ]);
                    }
                }
                foreach($p['attributes'] as $atribute) {
                    if($atribute['name'] === 'COLECCIÓN / COLLECTION') {
                        Products::where('holded_id', $p['id'])->update([
                            'season' => $atribute['value'],
                        ]);
                    }
                }

                $ImagesList = Http::withHeaders([
                    'Accept' => 'application/json',
                    'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
                ])->get('https://api.holded.com/api/invoicing/v1/products/'.$p['id'].'/imagesList')->json();

               

                if(Storage::exists('public/media/'.$p['name'].'_A.jpg')) {
                    Products::where('holded_id', $p['id'])->update([
                        'main_HD' => Storage::url('public/media/'.$p['name'].'_A.jpg'),
                    ]);
                } else   if(Storage::exists('public/media/'.$p['name'].'1.jpg')) {
                    Products::where('holded_id', $p['id'])->update([
                        'main_HD' => Storage::url('public/media/'.$p['name'].'1.jpg'),
                    ]);
                } else {
                    foreach($ImagesList['extraimages'] as $imageName) {
                        $image = Http::withHeaders([
                            'Accept' => 'application/json',
                            'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
                        ])->get('https://api.holded.com/api/invoicing/v1/products/'.$p['id'].'/image/'.$imageName)->body();
    
                        if(isset($ImagesList['extraimages'][0])  && $ImagesList['extraimages'][0] === $imageName) {
                            Storage::put('public/products/'.$imageName, $image);
                            Products::where('holded_id', $p['id'])->update([
                                'main_image' => Storage::url('public/products/'.$imageName),
                            ]);
                        }
                    }
                }

                if(Storage::exists('public/media/'.$p['name'].'_B.jpg')) {
                    Products::where('holded_id', $p['id'])->update([
                        'second_HD' => Storage::url('public/media/'.$p['name'].'_B.jpg'),
                    ]);
                } else if(Storage::exists('public/media/'.$p['name'].'2.jpg')) {
                    Products::where('holded_id', $p['id'])->update([
                        'second_HD' => Storage::url('public/media/'.$p['name'].'2.jpg'),
                    ]);
                } else  {
                    foreach($ImagesList['extraimages'] as $imageName) {
                        $image = Http::withHeaders([
                            'Accept' => 'application/json',
                            'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
                        ])->get('https://api.holded.com/api/invoicing/v1/products/'.$p['id'].'/image/'.$imageName)->body();
    
                        if(isset($ImagesList['extraimages'][1]) && $ImagesList['extraimages'][1] === $imageName) {
                            Storage::put('public/products/'.$imageName, $image);
                            Products::where('holded_id', $p['id'])->update([
                                'second_image' => Storage::url('public/products/'.$imageName),
                            ]);
                        }
                    }
                }

                if(Storage::exists('public/media/'.$p['name'].'_C.jpg')) {
                    Products::where('holded_id', $p['id'])->update([
                        'third_HD' => Storage::url('public/media/'.$p['name'].'_C.jpg'),
                    ]);
                } else if(Storage::exists('public/media/'.$p['name'].'3.jpg')) {
                    Products::where('holded_id', $p['id'])->update([
                        'third_HD' => Storage::url('public/media/'.$p['name'].'3.jpg'),
                    ]);
                } else {
                    foreach($ImagesList['extraimages'] as $imageName) {
                        $image = Http::withHeaders([
                            'Accept' => 'application/json',
                            'key' => 'fdb8848be4b3000cc665f1ee9a5681a7',
                        ])->get('https://api.holded.com/api/invoicing/v1/products/'.$p['id'].'/image/'.$imageName)->body();
    
                        if(isset($ImagesList['extraimages'][2]) && $ImagesList['extraimages'][2] === $imageName) {
                            Storage::put('public/products/'.$imageName, $image);
                            Products::where('holded_id', $p['id'])->update([
                                'third_image' => Storage::url('public/products/'.$imageName),
                            ]);
                        }
                    }
                }

                foreach($p['variants'] as $v) {
                    if(Variants::where('holded_id', $v['id'])->exists()) {
                        Variants::where('holded_id', $v['id'])->update([
                            'sku' => $v['sku'],
                            'stock' => $v['stock'],
                            'barcode' => $v['barcode'],
                        ]);
                        foreach($v['categoryFields'] as $categoryField) {
                            if($categoryField['name'] === 'TALLAS / SIZES') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'size' => $categoryField['field'],
                                ]);
                            }

                            if($categoryField['name'] === 'COLOR / COLOR') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'color' => $categoryField['field'],
                                ]);
                            }

                            if($categoryField['name'] === 'DESCRIPT / FABRIC') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'description' => $categoryField['field'],
                                ]);
                            }

                            if($categoryField['name'] === 'VERSION / VERSION') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'name' => $categoryField['field'],
                                ]);
                            }

                            if($categoryField['name'] === 'PVPR ES') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'pvp_spain' => $categoryField['field'],
                                ]);
                            }

                            if($categoryField['name'] === 'Dosier') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'dosier' => $categoryField['field'],
                                ]);
                            }
        
                            if($categoryField['name'] === 'SUBT FAI') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'price_fai' => $categoryField['field'],
                                ]);
                            }
        
                            if($categoryField['name'] === 'SUBT GB') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'price_gb' => $categoryField['field'],
                                ]);
                            }

                            if($categoryField['name'] === 'SUBT ES') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'price_spain' => $categoryField['field'],
                                ]);
                            }
        
                            if($categoryField['name'] === 'PVPR FAI') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'pvp_fai' => $categoryField['field'],
                                ]);
                            }
        
                            if($categoryField['name'] === 'PVPR GB') {
                                Variants::where('holded_id', $v['id'])->update([
                                    'pvp_gb' => $categoryField['field'],
                                ]);
                            }

                        }
                    } else {
                        $variant = new Variants();
                        $variant->sku = $v['sku'];                
                        $variant->holded_id = $v['id'];
                        $variant->stock = $v['stock'];
                        $variant->barcode = $v['barcode'];
                        $variant->products_id = Products::where('holded_id', $p['id'])->first()->id;
                        foreach($v['categoryFields'] as $categoryField) {
                            if($categoryField['name'] === 'TALLAS / SIZES') {
                                $variant->size = $categoryField['field'];
                            }

                            if($categoryField['name'] === 'COLOR / COLOR') {
                                $variant->color = $categoryField['field'];
                            }

                            if($categoryField['name'] === 'DESCRIPT / FABRIC') {
                                $variant->description = $categoryField['field'];
                            }

                            if($categoryField['name'] === 'VERSION / VERSION') {
                                $variant->name = $categoryField['field'];
                            }

                            if($categoryField['name'] === 'PVPR ES') {
                                $variant->pvp_spain = $categoryField['field'];
                            }

                            if($categoryField['name'] === 'Dosier') {
                                $variant->dosier = $categoryField['field'];
                            }
        
                            if($categoryField['name'] === 'SUBT FAI') {
                                $variant->price_fai = $categoryField['field'];
                            }
        
                            if($categoryField['name'] === 'SUBT GB') {
                                $variant->price_gb = $categoryField['field'];
                            }

                            if($categoryField['name'] === 'SUBT ES') {
                                $variant->price_spain = $categoryField['field'];
                            }
        
                            if($categoryField['name'] === 'PVPR FAI') {
                                $variant->pvp_fai = $categoryField['field'];
                            }
        
                            if($categoryField['name'] === 'PVPR GB') {
                                $variant->pvp_gb = $categoryField['field'];
                            }
                        }
                        //check if variant have all the fields
                        if($variant->sku && $variant->stock && $variant->barcode && $variant->size && $variant->color && $variant->description && $variant->name && $variant->pvp_spain && $variant->dosier && $variant->price_fai && $variant->price_gb && $variant->price_spain && $variant->pvp_fai && $variant->pvp_gb) {
                            $variant->save();
                        } else {
                            $variant->delete();
                        }
                    }
                }
                Products::where('holded_id', $p['id'])->update([
                    'dosier' => Variants::where('products_id', Products::where('holded_id', $p['id'])->first()->id)->first()->dosier,
                ]);
            }
        }

        $this->info('Products updated successfully');


        $this->info('Updating Orders');
        foreach($documents as $d){
            if(!Company::where('holded_id', $d['contact'])->exists()) {
                continue;
            }
            if(Orders::where('holded_id', $d['id'])->exists()){
                Orders::where('holded_id', $d['id'])->update([
                    'dueDate' => Date::parse($d['dueDate'])->format('Y-m-d'),
                    'notes' => $d['notes'],
                    'total' => array_sum(array_column($d['products'], 'price')),
                    'docNumber' => $d['docNumber'],
                ]);

                foreach($d['products'] as $p) {
                    if($p['name']=='Welcome Pack Gift' || $p['name']=='Tote Bag Alberto Palatchi'){
                        continue;
                    }
                    if(!array_key_exists('variantId', $p)){
                        continue;
                    }
                    $v = Variants::where('holded_id', $p['variantId'])->first();
                    if(!$v){
                        continue;
                    }
                    $order = Orders::where('holded_id', $d['id'])->first();
                    if($order->variants()->where('variants_id', $v->id)->exists()){
                        $order->variants()->updateExistingPivot($v->id, [
                            'quantity' => $p['units'],
                        ]);
                    } else {
                        $order->variants()->attach($v->id, [
                            'quantity' => $p['units'],
                        ]);
                    }    
                }

                foreach($order->variants as $v) {
                    if($order->products()->where('products_id', $v->products_id)->exists()){
                        $order->products()->updateExistingPivot($v->products_id, ['quantity' => $order->variants()->where('products_id', $v->products_id)->sum('quantity')]);
                    } else {
                        $order->products()->attach($v->products_id, ['quantity' => $order->variants()->where('products_id', $v->products_id)->sum('quantity')]);
                    }
                }

                if($order->variants->isEmpty()){
                    $order->delete();
                    continue;
                }

                if(!array_key_exists('shipping', $d)){
                    continue;
                }



                if($d['shipping'] == 'billing'){
                    $company = Company::where('holded_id', $d['contact'])->first();
                    $address = Address::where('company_id', $company->id)->where('type', 'billing')->first();
                    $order = Orders::where('holded_id', $d['id'])->first();
                    $order->address()->associate($address);
                    $order->save();
                } else {
                    $company = Company::where('holded_id', $d['contact'])->first();
                    $address = Address::where('company_id', $company->id)->where('type', 'shipping')->where('shippingId', $d['shipping'])->first();
                    $order = Orders::where('holded_id', $d['id'])->first();
                    $order->address()->associate($address);
                    $order->save();
                }
            } else {
                $order = new Orders();
                $order->holded_id = $d['id'];
                $order->dueDate = Date::parse($d['dueDate'])->format('Y-m-d');
                $order->notes = $d['notes'];
                $order->total = array_sum(array_column($d['products'], 'price'));
                $order->docNumber = $d['docNumber'];
                $company = Company::where('holded_id', $d['contact'])->first();
                if($company) {
                    $order->company_id = $company->id;
                }else{
                    continue;
                }
                if($company->users->isEmpty()){
                    continue;
                }
                $order->user_id = $company->users->first()->id; 
                $order->save();
                foreach($d['products'] as $p) {
                    if(!array_key_exists('variants', $p)) {
                        $this->info('Product without variants: ' . $p['name']);
                        continue;
                    }
                    if(!array_key_exists('variantId', $p)){
                        continue;
                    }
                    $v = Variants::where('holded_id', $p['variantId'])->first();
                    if(!$v){
                        continue;
                    }
                    if($order->variants()->where('variants.id', $v->id)->exists()){
                        $order->variants()->updateExistingPivot($v->id, ['quantity' => $p['units']]);
                    } else {
                        $order->variants()->attach($v->id, ['quantity' => $p['units']]);
                    }
                }

                foreach($order->variants as $v) {
                    if($order->products()->where('products_id', $v->products_id)->exists()){
                        $order->products()->updateExistingPivot($v->products_id, ['quantity' => $order->variants()->where('products_id', $v->products_id)->sum('quantity')]);
                    } else {
                        $order->products()->attach($v->products_id, ['quantity' => $order->variants()->where('products_id', $v->products_id)->sum('quantity')]);
                    }
                }

                if($order->variants->isEmpty()){
                    $order->delete();
                    continue;
                }

                if(!array_key_exists('shipping', $d)){
                    continue;
                }

                if($d['shipping'] == 'billing'){
                    $company = Company::where('holded_id', $d['contact'])->first();
                    $address = Address::where('company_id', $company->id)->where('type', 'billing')->first();
                    $order = Orders::where('holded_id', $d['id'])->first();
                    $order->address()->associate($address);
                    $order->save();
                } else {
                    $company = Company::where('holded_id', $d['contact'])->first();
                    $address = Address::where('company_id', $company->id)->where('type', 'shipping')->where('shippingId', $d['shipping'])->first();
                    $order = Orders::where('holded_id', $d['id'])->first();
                    $order->address()->associate($address);
                    $order->save();
                }
                
            }
        }

        $this->info('Orders updated successfully');

        $this->info('Database updated');

        //Display the total time taken
        $this->info('Total time taken: ' . $this->totalTimeTaken());

        return Command::SUCCESS;
    }

    /**
     * Get the total time taken to run the command.
     *
     * @return string
     */
    protected function totalTimeTaken()
    {
        return round((microtime(true) - LARAVEL_START), 2) . ' seconds';
    }
}




