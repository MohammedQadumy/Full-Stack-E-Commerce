import { Address } from './address';
import { Customer } from './customer';
import { Order } from './order';
import { OrderItem } from './order-item';

export class Purchase {
  public customer: Customer;
  public shippingAddress: Address;
  public billingAddress: Address;
  public order: Order;
  public orderItems: OrderItem[];

  constructor() {
    // Initialize the properties with default values
    this.customer = new Customer(); // Assuming Customer has a no-arg constructor
    this.shippingAddress = new Address(); // Assuming Address has a no-arg constructor
    this.billingAddress = new Address(); // Assuming Address has a no-arg constructor
    this.order = new Order(); // Assuming Order has a no-arg constructor
    this.orderItems = []; // Initialize with an empty array
  }
}
