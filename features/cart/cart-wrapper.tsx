"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PUBLIC_ROUTES } from "@/lib/constants";
import OrderForm from "./order-form";

const CartWrapper = () => {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (totalItems === 0) {
    return (
      <section className="container pb-8 pt-[96px] h-full flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-card p-8 rounded-full mb-6">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground opacity-20"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven&apos;t added anything to your cart yet. Explore
          our marketplace to find amazing products!
        </p>
        <div className="max-w-xs w-full">
          <Button size="xl" className="rounded-2xl text-base w-full" asChild>
            <Link href={PUBLIC_ROUTES.HOME}>Start Shopping</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container pb-8 pt-[96px] overflow-hidden">
      <OrderForm />
    </section>
  );
};

export default CartWrapper;
