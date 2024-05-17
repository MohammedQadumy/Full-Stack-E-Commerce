import { Component } from '@angular/core';
import { CartItem } from 'src/app/common/cartItem';
import { CartService } from 'src/app/services/cart.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent {

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.removeFromCart(theCartItem);
  }


incrementQuantity(theCartItem: CartItem) {
  this.cartService.addToCart(theCartItem);
}

  cartItems:CartItem[] = [];
  totalPrice:number=0;
  totalQuantity:number=0;

  constructor(private cartService:CartService){

  }

  ngOnInit():void {
    this.listCartDetails();
  }

  listCartDetails() {
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;
    console.log(this.cartItems);
    // subscribe to the cart totalPrice

    this.cartService.totalPrice.subscribe(
      data=>this.totalPrice = data
    );

    // subscrive to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity =data
    );
    // compute cart total price and quantity

    this.cartService.computeCartTotals();
  }

}
