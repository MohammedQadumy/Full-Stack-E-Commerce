import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup!:FormGroup;
  totalPrice:number=0;
  totalQuantity:number=0;

  creditCardYears:number[] =[];
  creditCardMonths:number[] =[];



  constructor(private formBuilder:FormBuilder ,
    private luv2ShopFormService:Luv2ShopFormService
  ){}

  ngOnInit():void{

    const startMonth:number = new Date().getMonth()+1;
    console.log(`Start Month : ${startMonth}`);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data=>{
        console.log("Retrieved credit card Months" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );


    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data=>{
        console.log("Retrieved credit card Months" + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );


    this.checkoutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email:[''],
      }),
      shippingAddress:this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:[''],
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
        state:[''],
        country:[''],
        zipCode:[''],
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


    handleMonthsAndYears(){
      const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
      const currentYear:number = new Date().getFullYear();
      const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

      let startMonth:number;

      if(currentYear == selectedYear){
        startMonth = new Date().getMonth()+1;
      }
      else{
        startMonth =1;
      }

      this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("Retrieved credit card months: " + JSON.stringify(data));
          this.creditCardMonths = data;
        }
      )
    }
}
