<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Models\Products;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::resource('products', ProductController::class)->middleware(['auth', 'verified']);

Route::resource('cart', CartController::class)->middleware(['auth', 'verified']);

// Route cart.checkout
Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout')->middleware(['auth', 'verified']);

// Route orders.confirm
Route::get('/orders/{id}/confirm', [OrderController::class, 'confirm'])->name('orders.confirm')->middleware(['auth', 'verified']);

// Route orders.index
Route::get('/', [OrderController::class, 'index'])->name('orders.index')->middleware(['auth', 'verified']);

// Route user.profile
Route::get('/user/profile', function () {
    return Inertia::render('User/Profile', [
        'companies' => Auth::user()->companies->load('address'),
        'cart' => Auth::user() ? Auth::user()->cart->sum('quantity') : 0,
    ]);
})->name('user.profile')->middleware(['auth', 'verified']);

// Route database update
Route::post('/database/update', function () {
    Artisan::call('database:update');
    return redirect()->route('products.index');
})->name('database.update')->middleware(['auth', 'verified']);

// Route orders.adToCart
Route::get('/orders/{id}/addToCart', [OrderController::class, 'addCart'])->name('orders.addToCart')->middleware(['auth', 'verified']);
require __DIR__.'/auth.php';
