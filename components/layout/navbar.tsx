"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="container absolute top-0 left-0 right-0 w-full z-50 flex items-center justify-between py-4">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={150}
            height={90}
            loading="eager"
            priority
          />
        </Link>
        <div>
          <Button
            variant="ghost"
            size="lg"
            className="hover:bg-transparent text-base! gap-2 [&_svg:not([class*='size-'])]:size-5"
            asChild
          >
            <Link href="/cart">
              <span className="relative">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.94692 4.20032H22.2324C24.0698 4.20032 25.3965 5.89368 24.8924 7.59771L22.6871 15.0645C22.3471 16.2112 21.2617 17.0005 20.0271 17.0005H7.8163C6.58029 17.0005 5.49362 16.2099 5.15495 15.0645L1.94692 4.20032ZM1.94692 4.20032L1.00024 1.00026M19.0004 25.0007C19.5308 25.0007 20.0395 24.7899 20.4146 24.4149C20.7897 24.0398 21.0004 23.5311 21.0004 23.0006C21.0004 22.4702 20.7897 21.9615 20.4146 21.5864C20.0395 21.2113 19.5308 21.0006 19.0004 21.0006C18.47 21.0006 17.9612 21.2113 17.5862 21.5864C17.2111 21.9615 17.0004 22.4702 17.0004 23.0006C17.0004 23.5311 17.2111 24.0398 17.5862 24.4149C17.9612 24.7899 18.47 25.0007 19.0004 25.0007ZM8.33364 25.0007C8.86408 25.0007 9.37279 24.7899 9.74787 24.4149C10.1229 24.0398 10.3337 23.5311 10.3337 23.0006C10.3337 22.4702 10.1229 21.9615 9.74787 21.5864C9.37279 21.2113 8.86408 21.0006 8.33364 21.0006C7.8032 21.0006 7.29449 21.2113 6.91941 21.5864C6.54434 21.9615 6.33362 22.4702 6.33362 23.0006C6.33362 23.5311 6.54434 24.0398 6.91941 24.4149C7.29449 24.7899 7.8032 25.0007 8.33364 25.0007Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {mounted && (
                  <span className="absolute -top-1.5 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-background">
                    {totalItems}
                  </span>
                )}
              </span>
              My Cart
            </Link>
          </Button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

