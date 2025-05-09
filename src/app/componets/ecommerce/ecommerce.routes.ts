import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
 {path:'ecommerce',children:[ 
    {path: 'cart',loadComponent: () =>import('./cart/cart.component').then((m) => m.CartComponent), },
    {path: 'checkout',loadComponent: () =>import('./checkout/checkout.component').then((m) => m.CheckoutComponent), },
    {path: 'productdetails',loadComponent: () =>import('./productdetails/productdetails.component').then((m) => m.ProductdetailsComponent), },
    {path: 'products',loadComponent: () =>import('./products/products.component').then((m) => m.ProductsComponent), },
    {path: 'wishlist',loadComponent: () =>import('./wishlist/wishlist.component').then((m) => m.WishlistComponent), },
]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class EcommerceRoutingModule {
  static routes = admin;
}