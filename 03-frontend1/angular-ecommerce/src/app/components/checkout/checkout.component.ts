import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {


  checkoutFormGroup!:FormGroup;
  totalPrice:number=0;
  totalQuantity:number=0;
  
  constructor(private formBuilder:FormBuilder){

  }

  ngOnInit():void{
    this.checkoutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email:[''],
      }),
      shippingAddress:this.formBuilder.group({
        street:[''],
        city:[''],
        //state:[''],
        //country:[''],
        //zipCode:[''],
      }),
      creditCard:this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        security:[''],
        expirationMonth:[''],
        expirationYear:[''],
      }),

      billingAddress:this.formBuilder.group({
        street:[''],
        city:[''],
        //state:[''],
        //country:[''],
        //zipCode:[''],
      })
    });
  }


  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')!.value);

  }

  copyShippingAddressToBillingAddress($event: Event) {
    if (($event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.get('billingAddress')!.setValue(
        this.checkoutFormGroup.get('shippingAddress')!.value
      );
    } else {
      this.checkoutFormGroup.get('billingAddress')!.reset();
    }

    // const billingAddressControl = this.checkoutFormGroup.get('billingAddress');
    // const shippingAddressControl = this.checkoutFormGroup.get('shippingAddress');

    // if (!billingAddressControl || !shippingAddressControl) {
    //   console.error("Form controls not initialized properly");
    //   return;
    // }


    // if (($event.target as HTMLInputElement).checked) {
    //   billingAddressControl.patchValue(shippingAddressControl.value); // Using patchValue to allow partial updates
    // } else {
    //   billingAddressControl.reset();
    // }


    }
}
