"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CartItem from "./cart-item";
import { useCartStore } from "@/store/useCartStore";

const CartOrderSummary = () => {
  const { items } = useCartStore();

  const subTotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return acc + price * item.line_items.quantity;
    }, 0);
  }, [items]);

  const shipping = 0;
  const tax = subTotal * 0.05;
  const total = subTotal + shipping + tax;

  return (
    <div className="w-full bg-card rounded-4xl px-5 sm:px-7 py-5 sm:py-6">
      <h2 className="text-xl font-semibold mb-4 sm:mb-6">Your Order</h2>
      <div className="mb-6 sm:mb-8 flex flex-col gap-4">
        {items.map((item) => (
          <CartItem key={item.order_ref} item={item} />
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-3">Order Summary</h3>

        <div className="space-y-2 sm:space-y-3 text-base *:text-muted-foreground *:font-normal! *:flex *:justify-between">
          <div>
            <span>Sub Total:</span>
            <span className="font-semibold text-foreground">
              Rs. {subTotal.toLocaleString()}
            </span>
          </div>
          <div>
            <span>Shipping:</span>
            <span className="font-semibold text-foreground">
              {shipping === 0 ? "Free" : `Rs. ${shipping}`}
            </span>
          </div>
          <div>
            <span>Tax (Estimated 5%)</span>
            <span className="font-semibold text-foreground">
              Rs. {tax.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between items-center font-bold text-base text-foreground">
          <span>Total</span>
          <span className="font-semibold text-foreground">
            Rs. {total.toLocaleString()}
          </span>
        </div>


        <div>
          <h3 className="font-semibold text-base text-foreground mb-3">
            Payment Method
          </h3>
          <RadioGroup defaultValue="cod" className="flex flex-col gap-3">
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="cod"
                id="cod"
                className="border-primary text-primary border-2 h-5 w-5"
              />
              <label
                htmlFor="cod"
                className="text-sm font-medium text-muted-foreground cursor-pointer"
              >
                Cash on Delivery
              </label>
            </div>
          </RadioGroup>
        </div>

        <Button size="xl" className="w-full rounded-2xl text-lg">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartOrderSummary;
