package com.luv2code.ecommerce.controller;


import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseRespone;
import com.luv2code.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseRespone placeOrder(@RequestBody Purchase purchase){
        PurchaseRespone purchaseRespone = checkoutService.placeOrder(purchase);
        return purchaseRespone;
    }

}
