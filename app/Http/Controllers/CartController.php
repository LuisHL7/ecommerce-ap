<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Variants;
use App\Models\Address;
use Darryldecode\Cart\Facades\CartFacade as Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Http;

class CartController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();
        return Inertia::render('Cart/Index', [
            'cart' => [
                'items' => $user->cart,
                'total' => Cart::session($user->id)->getTotal(),
            ],
            'company' => $user->companies->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'email' => $company->email,
                    'phone' => $company->phone,
                    'holded_id' => $company->holded_id,
                    'currency' => $company->currency,
                    'language' => $company->language,
                    'type' => $company->type,
                    'code' => $company->code,
                    'addresses' => $company->address,
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $product = $request->json()->all();
        $model = Products::find($product['product_id']);
        $variant = Variants::find($product['id']);
        $items = Cart::session($user->id)->getContent();
        if (!$items->has($product['id'])) {
            if(array_key_exists('quantity', $product)) {
                Cart::session($user->id)->add([
                    'id' => $product['id'],
                    'name' => $product['name'],
                    'price' => $product['price'],
                    'quantity' => $product['quantity'],
                    'attributes' => [
                        'model' => $model,
                        'variant' => $variant,
                    ],
                ]);
            } else {
                Cart::session($user->id)->add([
                    'id' => $product['id'],
                    'name' => $product['name'],
                    'price' => $product['price'],
                    'quantity' => 1,
                    'attributes' => [
                        'model' => $model,
                        'variant' => $variant,
                    ],
                ]);
            }
        } else {
            Cart::session($user->id)->update($product['id'], [
                'quantity' => 1,
            ]);
        }
        return back();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $product = $request->product;
        Cart::session($user->id)->update($product['id'], [
            'quantity' => [
                'relative' => false,
                'value' => $product['quantity'],
            ],
        ]);
        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = auth()->user();
        Cart::session($user->id)->remove($id);
        return back();
    }

    /**
     * Create a Order and send to Holded.
     *  
     * @return \Illuminate\Http\Response
     */
    public function checkout(Request $request)
    {
       if($request->address['id'] == null) {
        $order = Orders::create([
            'user_id' => auth()->user()->id,
            'company_id' => $request->company,
            'dueDate' => Date::now()->addDays(90),
            'country' => $request->address['country'],
            'state' => $request->address['state'],
            'city' => $request->address['city'],
            'zip' => $request->address['zip'],
            'address' => $request->address['address'],
            'countryCode' => $request->address['country_code'],
            'paymentMethod' => $request->payment_type,
            'notes' => $request->notes ?? null,
            ]);
        } else {
            $order = Orders::create([
                'user_id' => auth()->user()->id,
                'company_id' => $request->company,
                'dueDate' => Date::now()->addDays(90),
                'paymentMethod' => $request->payment_type,
                'notes' => $request->notes ?? null,
            ]);
            $address = Address::find($request->address['id']);
            $order->address()->associate($address);
        }
        Auth::user()->cart->each(function ($item) use ($order) {
            if($order->products()->where('products_id', $item->attributes->model->id)->exists()) {
                $order->products()->updateExistingPivot($item->attributes->model->id, [
                    'quantity' => $item->quantity + $order->products()->where('products_id', $item->attributes->model->id)->first()->pivot->quantity,
                ]);
            } else {
                $order->products()->attach($item->attributes->model->id, [
                    'quantity' => $item->quantity,
                ]);
            }

            $order->variants()->attach($item->attributes->variant->id, [
                'quantity' => $item->quantity,
            ]);
        });
        $order->save();
        $company = Company::find($request->company);
        $order_holded = Http::withHeaders([
            'Accept' => 'application/json',
            'key' => '54e4792a948a8dbb83a580f3bf338e41',
        ])->post('https://api.holded.com/api/invoicing/v1/documents/salesorder',[
            "date" => $order->created_at,
            "dueDate" => $order->dueDate,
            "contactCode" => $company->code ?? null,
            "contactName" => $company->name,
            "contactEmail" => $company->email,
            "contactAddress" => $company->address,
            "contactCity" => $company->city,
            "contactProvince" => $company->state,
            "contactCountry" => $company->country,
            "contactCp" => $company->zip,
            "contactCountryCode" => $company->countryCode,
            "notes" => $order->notes ?? null,
            "items" => $order->variants->map(function ($item) use ($order, $company) {
                $model = Products::find($item->products_id);
                return [
                    "desc" => $item->barcode . ', ' . $item->name . ', ' . $item->description . ', ' . $item->color . ', ' . $item->size,
                    "units" => $item->pivot->quantity,
                    "sku" => $item->sku,
                    "subtotal" => $company->currency == 'eur' && $company->language == 'es' ? $item->price_spain : ($company->currency == 'eur' ? $item->price_fai : $item->price_gb),
                    "tax" => 21,
                ];
            }),
            "currency" => $company->currency,
            "shippingAddress" => $order->address->first()->address ? $order->address->first()->address : $order->address,
            "shippingCity" => $order->address->first()->city ? $order->address->first()->city : $order->city,
            "shippingProvince" => $order->address->first()->state ? $order->address->first()->state : $order->state,
            "shippingCountry" => $order->address->first()->country ? $order->address->first()->country : $order->country,
            "shippingPostalCode" => $order->address->first()->zip ? $order->address->first()->zip : $order->zip,
            "customFields" => [
                [
                    "field" => "Payment Method",
                    "value" => $order->paymentMethod,
                ],
            ],
        ]);
        // dd($order_holded->json());
        if($order_holded->json()['id']) {
            
            
        
        $order->holded_id = $order_holded->json()['id'];
        $order->docNumber = $order_holded->json()['invoiceNum'];
        $order->total = $order->variants->map(function ($item) {
            return $item->pivot->quantity * ($item->price_spain);
        })->sum();
        $order->save();
        } else {
            $order->delete();
            Artisan::call('database:update');
        }
        Cart::session(auth()->user()->id)->clear();
        return redirect()->route('orders.confirm', $order->id);
    }
}
