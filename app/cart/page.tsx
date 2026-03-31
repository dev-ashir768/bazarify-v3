
import CartWrapper from "@/features/cart/cart-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return <CartWrapper />;
}
