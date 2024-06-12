package com.luv2code.ecommerce.service;

import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseRespone;

public interface CheckoutService {
    PurchaseRespone placeOrder(Purchase purchase);



}
