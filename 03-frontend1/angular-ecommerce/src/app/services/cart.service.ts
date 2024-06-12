import { Injectable } from '@angular/core';
import { CartItem } from '../common/cartItem';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];
  // subject is a subclass of observable , I can use it to publish events in our code , the event will be sent to all the subscribers
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  storage:Storage=localStorage;

  constructor(){
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;

      this.computeCartTotals();
    }


  }

  persistCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
  }


  removeFromCart(theCartItem:CartItem){
    if(this.cartItems.length === 0){
      return;
    }
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id === theCartItem.id
    );

    if(itemIndex >-1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }

  }

  addToCart(theCartItem: CartItem) {
    // check if we already have the item in our cart
    let alreadExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      existingCartItem =  this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
    }
    // check if we found it
    alreadExistsInCart = existingCartItem != null;

    if (alreadExistsInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    this.persistCartItems();


  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Content of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(
        `name : ${tempCartItem.name}, quantity:${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice:${subTotalPrice}`
      );
    }

    console.log(`totalPrice:${totalPriceValue.toFixed(2)} , totalQuntity:${totalQuantityValue}`);



  }


}
