import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent {
    totalPrice:number=0.00;
    totalQuantity:number=0;

    constructor(private cartService:CartService){
      this.updateCartStatus();

    }
  updateCartStatus() {
    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data=>this.totalPrice = data
    )
    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data=>this.totalQuantity =data
    );

  }
}
