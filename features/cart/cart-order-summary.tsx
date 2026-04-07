"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CartItem from "./cart-item";
import { useCartStore } from "@/store/useCartStore";
import { UseFormReset } from "react-hook-form";
import { OrderFormValues } from "@/schema/order.schema";
import { orderRefGenerate } from "@/lib/order-ref-generate";

const CartOrderSummary = ({
  reset,
  isPending,
}: {
  reset: UseFormReset<OrderFormValues>;
  isPending: boolean;
}) => {
  // ========================= Hooks ========================= \\
  const { items } = useCartStore();
  const [orderRef] = useState(() => orderRefGenerate());

  const subTotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return acc + price * item.line_items.quantity;
    }, 0);
  }, [items]);

  // ========================= Calculation ========================= \\
  const shipping = 0;
  const tax = subTotal * 0;
  const total = subTotal + shipping + tax;
  const paymentMethodId = 1;
  const platformId = 5;

  const lineItems = useMemo(() => {
    return items.map((item) => ({
      product_id: item.line_items.product_id,
      variation_id: item.line_items.variation_id,
      location_id: item.line_items.location_id,
      quantity: item.line_items.quantity,
    }));
  }, [items]);

  const acno = items[0]?.acno || "";

  useEffect(() => {
    reset({
      acno: acno,
      order_ref: orderRef,
      shipping_charges: shipping,
      payment_method_id: paymentMethodId,
      platform_id: platformId,
      line_items: lineItems,
    });
  }, [reset, shipping, paymentMethodId, platformId, orderRef, lineItems, acno]);

  return (
    <div className="w-full bg-card rounded-4xl px-5 sm:px-7 py-5 sm:py-6">
      <h2 className="text-xl font-semibold mb-4 sm:mb-6">Your Order</h2>
      <div className="mb-6 sm:mb-8 flex flex-col gap-4">
        {items.map((item) => (
          <CartItem key={item.item_ref} item={item} />
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
            <span>Tax</span>
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

        <Button
          type="submit"
          form="order-form"
          size="xl"
          className="w-full rounded-2xl text-lg"
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Proceed to Checkout"}
        </Button>
      </div>
    </div>
  );
};

export default CartOrderSummary;
