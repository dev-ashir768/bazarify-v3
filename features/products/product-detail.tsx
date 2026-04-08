"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import ImageFallback from "@/lib/image-fallback";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PUBLIC_ROUTES } from "@/lib/constants";
import { useProductHooks } from "@/hooks/useProductHooks";
import ProductDetailSkeleton from "@/components/shared/product-detail-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Lens } from "@/components/ui/lens";
import { FloatingSelect } from "@/components/ui/floating-select";
import { CartItems, ProductVariation, SelectedAttributes } from "@/types";
import { formattedAmount } from "@/lib/formated-amount";
import { ProductDetailsHelper } from "@/helper_functions/product.helper";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FlyingItem {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  image: string;
}

interface ProductDetailProps {
  productId: number;
  acno: string;
}

const ProductDetail = ({ productId, acno }: ProductDetailProps) => {
  // ========================= Hooks ========================= \\
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [hovering, setHovering] = useState(false);
  const [selectedAttributes, setSelectedAttributes] =
    useState<SelectedAttributes>({});
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const { addItem, items } = useCartStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!mainApi || !thumbApi) return;
    const onSelect = () => {
      const selected = mainApi.selectedScrollSnap();
      setActiveThumb(selected);

      const inView = thumbApi.slidesInView();
      if (!inView.includes(selected)) {
        thumbApi.scrollTo(selected);
      }
    };

    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);

    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi, thumbApi, setQuantity]);

  // ========================= Data Fetching ========================= \\
  const {
    data: productDetail,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductHooks.GetDetail({
    product_id: productId,
    acno: acno,
  });

  const payload = productDetail?.payload;

  // ========================= Variation Logic ========================= \\
  const hasVariations = !!payload?.variations && payload.variations.length > 0;
  const totalAttributes = payload?.attributes?.length ?? 0;

  const activeVariation = useMemo<ProductVariation | null>(() => {
    if (!hasVariations || !payload?.variations) return null;

    return ProductDetailsHelper.findMatchingVariations(
      selectedAttributes,
      payload.variations,
      totalAttributes,
    );
  }, [selectedAttributes, hasVariations, payload?.variations, totalAttributes]);

  const resolvedPrice = useMemo(() => {
    if (activeVariation) {
      return payload?.on_sale === "Y"
        ? activeVariation.sale_price
        : activeVariation.price;
    }
    return payload?.on_sale === "Y"
      ? payload.default_sale_price
      : payload?.default_price;
  }, [activeVariation, payload]);

  const resolvedImage = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL_GET_ORIO +
      "/uploads/" +
      acno +
      "/" +
      payload?.default_image
    );
  }, [payload, acno]);

  const maxQuantity = useMemo(() => {
    if (activeVariation) {
      return ProductDetailsHelper.getMaxInventory(activeVariation.inventory);
    }
    return ProductDetailsHelper.getMaxInventory(
      payload?.default_inventory ?? [],
    );
  }, [activeVariation, payload]);

  const maxInventoryItem = useMemo(() => {
    if (activeVariation) {
      return ProductDetailsHelper.getMaxInventoryItem(
        activeVariation.inventory,
      );
    }
    return ProductDetailsHelper.getMaxInventoryItem(
      payload?.default_inventory ?? [],
    );
  }, [activeVariation, payload]);

  const isOutOfStock = maxQuantity <= 0;

  const itemRef = useMemo(() => {
    return `${productId}-${activeVariation?.variation_id ?? "default"}`;
  }, [productId, activeVariation]);

  useEffect(() => {
    setQuantity(1);
  }, [activeVariation]);

  // ========================= Handlers ========================= \\
  const onThumbClick = (index: number) => {
    if (!mainApi || !thumbApi) return;
    mainApi.scrollTo(index);
  };

  const handleAttributeChange = useCallback(
    (attributeName: string, value: string | null) => {
      setSelectedAttributes((prev) => {
        if (!value) {
          const updated = { ...prev };
          delete updated[attributeName];
          return updated;
        }
        return { ...prev, [attributeName]: value };
      });
    },
    [],
  );

  const handleIncrement = useCallback(() => {
    setQuantity((prev) => {
      if (maxQuantity === Infinity) return prev + 1;
      return Math.min(maxQuantity, prev + 1);
    });
  }, [maxQuantity]);

  const handleDecrement = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const data: CartItems = {
        acno: acno,
        item_ref: itemRef,
        line_items: {
          product_id: Number(productId),
          variation_id: Number(activeVariation?.variation_id ?? 0),
          location_id: Number(maxInventoryItem?.location_id ?? 0),
          quantity: quantity,
          product_image: resolvedImage,
        },
        product_name: payload?.product_name ?? "",
        price: resolvedPrice!,
      };

      if (items.length > 0 && items[0].acno !== acno) {
        toast.error("You can only add items from one store at a time.");
        return;
      }

      // Get positions for animation
      const buttonRect = e.currentTarget.getBoundingClientRect();
      const cartIcon = document.getElementById("cart-icon");
      const cartRect = cartIcon?.getBoundingClientRect();

      if (cartRect) {
        const newItem: FlyingItem = {
          id: Date.now(),
          x: buttonRect.left + buttonRect.width / 2,
          y: buttonRect.top + buttonRect.height / 2,
          targetX: cartRect.left + cartRect.width / 2,
          targetY: cartRect.top + cartRect.height / 2,
          image: resolvedImage,
        };

        setFlyingItems((prev) => [...prev, newItem]);

        // Clean up the animated item after it completes
        setTimeout(() => {
          setFlyingItems((prev) =>
            prev.filter((item) => item.id !== newItem.id),
          );
          addItem(data);
        }, 800);
      } else {
        addItem(data);
      }
    },
    [
      activeVariation,
      quantity,
      resolvedImage,
      resolvedPrice,
      payload?.product_name,
      itemRef,
      addItem,
      acno,
      maxInventoryItem?.location_id,
      productId,
      items,
    ],
  );

  const handleBuyNow = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (items.length > 0 && items[0].acno !== acno) {
        toast.error("You can only add items from one store at a time.");
        return;
      }

      if (items.map((item) => item.item_ref).includes(itemRef)) {
        router.push(PUBLIC_ROUTES.CART);
        return;
      }

      handleAddToCart(e);

      setTimeout(() => {
        router.push(PUBLIC_ROUTES.CART);
      }, 800);
    },
    [handleAddToCart, router, acno, items, itemRef],
  );

  // ========================= Render ========================= \\
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} message={error?.message} />;
  }

  return (
    <>
      <Breadcrumb className="mb-4 sm:mb-8">
        <BreadcrumbList className="text-sm! font-normal">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={PUBLIC_ROUTES.HOME}>Marketplace</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium truncate md:max-w-full max-w-50">
              {productDetail?.payload.product_name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 xl:col-span-6 xl:max-w-162.5 w-full flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="order-2 sm:order-1 shrink-0 sm:w-24">
            <Carousel
              setApi={setThumbApi}
              orientation="vertical"
              className="w-full"
              opts={{
                align: "start",
                containScroll: "keepSnaps",
                dragFree: true,
              }}
            >
              <CarouselContent
                viewportClassName="max-h-[361px] lg:max-h-[427px]"
                className="flex-row sm:flex-col gap-2.5 ml-0 mt-0"
              >
                <CarouselItem className="pt-0 pl-0 basis-auto shrink-0">
                  <button
                    onClick={() => onThumbClick(0)}
                    className={cn(
                      "relative aspect-square w-20 sm:w-full rounded-xl overflow-hidden bg-card border-2 transition-all cursor-pointer",
                      activeThumb === 0
                        ? "border-primary"
                        : "border-transparent",
                    )}
                  >
                    <ImageFallback
                      src={resolvedImage}
                      alt={resolvedImage}
                      fill
                      className="object-cover"
                      fallbackSrc="/images/product-placeholder.jpeg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="eager"
                    />
                  </button>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>

          <div
            className="order-1 sm:order-2 flex-1 relative bg-card rounded-3xl overflow-hidden aspect-square sm:aspect-auto 
            h-90.25 lg:h-106.75"
          >
            <Carousel
              setApi={setMainApi}
              className="w-full h-full [&>.overflow-hidden]:w-full [&>.overflow-hidden]:h-full cursor-zoom-in"
            >
              <CarouselContent className="w-full h-full ml-0">
                <CarouselItem className="pl-0 h-full">
                  <div className="relative w-full h-full *:w-full *:h-full">
                    <Lens hovering={hovering} setHovering={setHovering}>
                      <ImageFallback
                        src={resolvedImage}
                        alt={resolvedImage}
                        fill
                        className="object-contain"
                        fallbackSrc="/images/product-placeholder.jpeg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="eager"
                      />
                    </Lens>
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-6 xl:max-w-125 w-full">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              {payload?.product_name}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground">
              {formattedAmount(resolvedPrice!)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-base mb-4">
            <span className="font-semibold text-foreground">Store Name:</span>
            <span className="text-muted-foreground">
              {productDetail?.payload.business_name}
            </span>
          </div>

          <div className="flex items-center justify-between max-w-36 xs:px-2 py-1 w-full mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="p-4 size-10 rounded-full bg-card hover:bg-card text-foreground hover:text-foreground [&_svg:not([class*='size-'])]:size-5"
              onClick={handleDecrement}
              disabled={quantity <= 1 || (hasVariations && !activeVariation)}
              aria-label="Decrease quantity"
            >
              <svg
                width="15"
                height="2"
                viewBox="0 0 15 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1H13.439"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
            <span className="text-base font-medium text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="p-4 size-10 rounded-full bg-card hover:bg-card text-foreground hover:text-foreground [&_svg:not([class*='size-'])]:size-5"
              onClick={handleIncrement}
              disabled={
                isOutOfStock ||
                quantity >= maxQuantity ||
                (hasVariations && !activeVariation)
              }
              aria-label="Increase quantity"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.56104 8.78052H15.0001"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8.78052 15.0001V2.56104"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </div>

          {hasVariations &&
            payload?.attributes &&
            payload.attributes.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {payload.attributes.map((attr) => (
                  <FloatingSelect
                    key={attr.name}
                    label={attr.name}
                    options={attr.options.map((opt) => ({
                      value: opt,
                      label: opt,
                    }))}
                    value={
                      selectedAttributes[attr.name]
                        ? {
                            value: selectedAttributes[attr.name],
                            label: selectedAttributes[attr.name],
                          }
                        : null
                    }
                    onChange={(val) => {
                      const selected = val as {
                        value: string;
                        label: string;
                      } | null;
                      handleAttributeChange(attr.name, selected?.value ?? null);
                    }}
                    isSearchable
                    isClearable
                  />
                ))}
              </div>
            )}

          <div className="space-y-4 sm:max-w-100 mb-4">
            <Button
              variant="secondary"
              size="xl"
              className="w-full rounded-2xl text-base font-semibold"
              disabled={isOutOfStock || (hasVariations && !activeVariation)}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              size="xl"
              className="w-full rounded-2xl text-base font-semibold"
              onClick={handleBuyNow}
              disabled={isOutOfStock || (hasVariations && !activeVariation)}
            >
              Buy Now
            </Button>
          </div>

          <div className="flex items-center gap-2 text-base">
            <span className="font-semibold">Availability:</span>
            <span className="text-foreground">
              {" "}
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              position: "fixed",
              top: item.y,
              left: item.x,
              width: 50,
              height: 50,
              opacity: 1,
              zIndex: 9999,
              borderRadius: "100%",
              overflow: "hidden",
            }}
            animate={{
              top: item.targetY,
              left: item.targetX,
              scale: [1, 1.2, 0.2],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="pointer-events-none"
          >
            <div className="relative w-full h-full bg-primary flex items-center justify-center p-1">
              <Image
                src={item.image}
                alt="flying-item"
                fill
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};

export default ProductDetail;
