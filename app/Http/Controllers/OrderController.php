<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\Products;
use App\Models\Variants;
use Darryldecode\Cart\Facades\CartFacade as Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\SubFamilies;

class OrderController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *  
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $orders = Orders::where('user_id', Auth::user()->id)->get();
        return Inertia::render('Order/Index', [
            'orders' => $orders->load('products', 'variants', 'address'),
            // Products where have order with the order 
            'products' => Products::whereHas('orders', function ($query) {
                $query->where('user_id', Auth::user()->id);
            })->with('orders')->get(),
            'cart' => Auth::user() ? Auth::user()->cart->sum('quantity') : 0,
        ]);   
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show(Orders $order)
    {
        //
    }

    /**
     * Show the Confirm Order page.
     *  
     * @return \Illuminate\Http\Response
     */
    public function confirm($id)
    {
        $order = Orders::find($id);
        return Inertia::render('Order/Confirm', [
            'order' => $order->load('products', 'variants'),
        ]);
    }

    /**
     * Add to the cart the products of the order.
     *  
     * @return \Illuminate\Http\Response
     */
    public function addCart($id)
    {
        $variant = Variants::find($id);
        $product = Products::find($variant->products_id);
        return Inertia::render('Products/Show', [
            'product' => $product,
            'variants' => $product->variants,
            'family' => $product->family,
            'subfamily' => SubFamilies::findOrFail($product->subfamily_id),
            'ids' => Products::all()->pluck('id'),
            'cart' => count(auth()->user()->cart),
            'preselected' => $variant,
            'companies' => Auth::user()->companies->load('address'),
        ]);
    }
                
}