import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { State } from 'src/app/common/state';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkoutService:CheckoutService,
    private router:Router
  ) {}

  ngOnInit(): void {

    this.reviewCartDetails();

    const startMonth: number = new Date().getMonth() + 1;
    console.log(`Start Month : ${startMonth}`);

    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrieved credit card Months' + JSON.stringify(data));
        this.creditCardMonths = data;
      });

    this.luv2ShopFormService.getCreditCardYears().subscribe((data) => {
      console.log('Retrieved credit card Months' + JSON.stringify(data));
      this.creditCardYears = data;
    });

    // populate countries

    this.luv2ShopFormService.getCountries().subscribe((data) => {
      console.log('Retrieved countries : ' + JSON.stringify(data));
      this.countries = data;
    });

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        'firstName': new FormControl('',
        [Validators.required, Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]
        ),
        'lastName': new FormControl('',
        [Validators.required, Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]
        ),
        'email': new FormControl('',
        [Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),Luv2ShopValidators.notOnlyWhiteSpace] // works for anuva@gmail.com
        )
        }),

      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        security: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
    });
  }

  reviewCartDetails() {
    // subscribe to cartService.totalQuantity

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice


    // check here
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  onSubmit() {
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    // get cart items
    const cartItems = this.cartService.cartItems;
    // create orderItems from cartItems
    // -long way
    let orderItems:OrderItem[] =[];
    for(let i =0 ; i<cartItems.length ;i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    // -short way
    let orderItemsShort:OrderItem[]=cartItems.map(tempCartItem=> new OrderItem(tempCartItem));
    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    // populate puchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState:State=JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry:Country=JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    // populate purchase - billing address


    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState:State=JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry:Country=JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;


    // call REST API vie the Checkout Service
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next:response =>{
          alert(`Your order has been recieved.\nOrder tracking number:${response.orderTrackingNumber}`);

          this.resetCart();
        },
        error: err =>{
          alert(`There was an error: ${err.message}`);
        }

      }
    )

  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems =[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    // reset form data
    this.checkoutFormGroup.reset();
    // navigate back to products page
    this.router.navigateByUrl("/products");
  }

  copyShippingAddressToBillingAddress($event: Event) {
    if (($event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup
        .get('billingAddress')!
        .setValue(this.checkoutFormGroup.get('shippingAddress')!.value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.get('billingAddress')!.reset();
      // bug fix for states
      this.billingAddressStates = [];
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

  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe((data) => {
      console.log(data);
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      formGroup?.get('state')?.setValue(data[0]);
    });
  }
}
