<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\SubFamilies;
use App\Models\Variants;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => Products::orderBy('dosier')->orderBy('name')->where('season', 'PV2023')->get(),
            'cart' => auth()->user() ? auth()->user()->cart->sum('quantity') : 0,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Products::findOrFail($id);
        return Inertia::render('Products/Show', [
            'product' => $product,
            'variants' => Variants::where('products_id', $id)->orderBy('dosier')->orderBy('name')->get(),
            'family' => $product->family,
            'subfamily' => SubFamilies::findOrFail($product->subfamily_id),
            'ids' => Products::all()->pluck('id'),
            'cart' => auth()->user()->cart->sum('quantity'),
            'companies' => auth()->user()->companies,
        ]);
    }
}
