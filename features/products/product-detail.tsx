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
import {
  INVENTORY_POLICY,
  ProductDetailsHelper,
} from "@/helper_functions/product.helper";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionRef = React.useRef<HTMLDivElement>(null);
  const [selectedAttributes, setSelectedAttributes] =
    useState<SelectedAttributes>({});
  const [flyingItems] = useState<FlyingItem[]>([]);
  const { items, buyNow } = useCartStore();
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
    if (activeVariation?.variation_image) {
      const vUrl = activeVariation.variation_image;
      if (vUrl.startsWith("http://") || vUrl.startsWith("https://")) {
        return vUrl;
      }
      return (
        process.env.NEXT_PUBLIC_API_BASE_URL_GET_ORIO +
        "/uploads/" +
        acno +
        "/" +
        vUrl
      );
    }
    const defaultImg = payload?.default_image || "";
    if (defaultImg.startsWith("http://") || defaultImg.startsWith("https://")) {
      return defaultImg;
    }
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL_GET_ORIO +
      "/uploads/" +
      acno +
      "/" +
      defaultImg
    );
  }, [payload, acno, activeVariation]);

  const productImages = useMemo(() => {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL_GET_ORIO + "/uploads/" + acno + "/";
    const imgs: string[] = [];

    if (
      payload?.images &&
      Array.isArray(payload.images) &&
      payload.images.length > 0
    ) {
      payload.images.forEach((img) => {
        const url = typeof img === "string" ? img : img.url;
        if (url) {
          if (url.startsWith("http://") || url.startsWith("https://")) {
            imgs.push(url);
          } else {
            imgs.push(base + url);
          }
        }
      });
    } else if (payload?.default_image) {
      const defUrl = payload.default_image;
      if (defUrl.startsWith("http://") || defUrl.startsWith("https://")) {
        imgs.push(defUrl);
      } else {
        imgs.push(base + defUrl);
      }
    }

    return imgs.length > 0
      ? imgs
      : [resolvedImage || "/images/product-placeholder.jpeg"];
  }, [payload, acno, resolvedImage]);

  const activeInventoryPolicy = useMemo(() => {
    if (activeVariation) {
      return activeVariation.inventory_policy;
    }
    return payload?.default_inventory_policy;
  }, [activeVariation, payload]);

  const maxQuantity = useMemo(() => {
    if (activeVariation) {
      return ProductDetailsHelper.getEffectiveMaxQuantity(
        activeVariation.inventory,
        activeVariation.inventory_policy,
      );
    }
    return ProductDetailsHelper.getEffectiveMaxQuantity(
      payload?.default_inventory ?? [],
      payload?.default_inventory_policy,
    );
  }, [activeVariation, payload]);

  // Policy-aware out-of-stock: never out of stock when policy is IGNORE_QUANTITY
  const isOutOfStock =
    String(activeInventoryPolicy) !== INVENTORY_POLICY.IGNORE_QUANTITY &&
    maxQuantity <= 0;

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

  const customerDeliveryRating = useMemo(() => {
    return ProductDetailsHelper.getCustomerRating(
      payload?.customer_delivery_ratio,
    );
  }, [payload?.customer_delivery_ratio]);

  const productDeliveryRating = useMemo(() => {
    return ProductDetailsHelper.getCustomerRating(
      payload?.product_delivery_ratio,
    );
  }, [payload?.product_delivery_ratio]);

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
      // Infinity means inventory_policy = 1 (ignore quantity), no upper bound
      if (!isFinite(maxQuantity)) return prev + 1;
      return Math.min(maxQuantity, prev + 1);
    });
  }, [maxQuantity]);

  const handleDecrement = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  // const handleAddToCart = useCallback(
  //   (e: React.MouseEvent<HTMLButtonElement>) => {
  //     const data: CartItems = {
  //       acno: acno,
  //       item_ref: itemRef,
  //       line_items: {
  //         product_id: Number(productId),
  //         variation_id: Number(activeVariation?.variation_id ?? 0),
  //         location_id: Number(maxInventoryItem?.location_id ?? 0),
  //         quantity: quantity,
  //         product_image: resolvedImage,
  //       },
  //       product_name: payload?.product_name ?? "",
  //       price: resolvedPrice!,
  //       max_quantity: maxQuantity,
  //     };

  //     if (items.length > 0 && items[0].acno !== acno) {
  //       toast.error("You can only add items from one store at a time.");
  //       return;
  //     }

  //     // Get positions for animation
  //     const buttonRect = e.currentTarget.getBoundingClientRect();
  //     const cartIcon = document.getElementById("cart-icon");
  //     const cartRect = cartIcon?.getBoundingClientRect();

  //     if (cartRect) {
  //       const newItem: FlyingItem = {
  //         id: Date.now(),
  //         x: buttonRect.left + buttonRect.width / 2,
  //         y: buttonRect.top + buttonRect.height / 2,
  //         targetX: cartRect.left + cartRect.width / 2,
  //         targetY: cartRect.top + cartRect.height / 2,
  //         image: resolvedImage,
  //       };

  //       setFlyingItems((prev) => [...prev, newItem]);

  //       // Clean up the animated item after it completes
  //       setTimeout(() => {
  //         setFlyingItems((prev) =>
  //           prev.filter((item) => item.id !== newItem.id),
  //         );
  //         addItem(data);
  //       }, 800);
  //     } else {
  //       addItem(data);
  //     }
  //   },
  //   [
  //     activeVariation,
  //     quantity,
  //     resolvedImage,
  //     resolvedPrice,
  //     payload?.product_name,
  //     itemRef,
  //     addItem,
  //     acno,
  //     maxInventoryItem?.location_id,
  //     productId,
  //     items,
  //     maxQuantity,
  //   ],
  // );

  // const handleBuyNow = useCallback(
  //   (e: React.MouseEvent<HTMLButtonElement>) => {
  //     if (items.length > 0 && items[0].acno !== acno) {
  //       toast.error("You can only add items from one store at a time.");
  //       return;
  //     }

  //     if (items.map((item) => item.item_ref).includes(itemRef)) {
  //       router.push(PUBLIC_ROUTES.CART);
  //       return;
  //     }

  //     handleAddToCart(e);

  //     setTimeout(() => {
  //       router.push(PUBLIC_ROUTES.CART);
  //     }, 800);
  //   },
  //   [handleAddToCart, router, acno, items, itemRef],
  // );
  const handleBuyNow = useCallback(() => {
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
      max_quantity: maxQuantity,
    };

    if (items.map((item) => item.item_ref).includes(itemRef)) {
      router.push(PUBLIC_ROUTES.CART);
      return;
    }

    buyNow(data);
    router.push(PUBLIC_ROUTES.CART);
  }, [
    activeVariation,
    quantity,
    resolvedImage,
    resolvedPrice,
    payload?.product_name,
    itemRef,
    buyNow,
    acno,
    maxInventoryItem?.location_id,
    productId,
    items,
    maxQuantity,
    router,
  ]);

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
                {productImages.map((img, index) => (
                  <CarouselItem
                    key={index}
                    className="pt-0 pl-0 basis-auto shrink-0"
                  >
                    <button
                      onClick={() => onThumbClick(index)}
                      className={cn(
                        "relative aspect-square w-20 sm:w-full rounded-xl overflow-hidden bg-card border-2 transition-all cursor-pointer",
                        activeThumb === index
                          ? "border-primary"
                          : "border-transparent",
                      )}
                    >
                      <ImageFallback
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        fallbackSrc="/images/product-placeholder.jpeg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="eager"
                      />
                    </button>
                  </CarouselItem>
                ))}
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
                {productImages.map((img, index) => (
                  <CarouselItem key={index} className="pl-0 h-full">
                    <div className="relative w-full h-full *:w-full *:h-full">
                      <Lens hovering={hovering} setHovering={setHovering}>
                        <ImageFallback
                          src={img}
                          alt={`Product Image ${index + 1}`}
                          fill
                          className="object-contain"
                          fallbackSrc="/images/product-placeholder.jpeg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="eager"
                        />
                      </Lens>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-6 xl:max-w-125 w-full">
          <div className="sm:mb-10 mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              {payload?.product_name}
            </h1>
            <StarRatingDisplay
              rating={productDeliveryRating}
              ratio={payload?.product_delivery_ratio}
              className="mb-4"
              ratioClassName="text-base ml-2"
              size={23}
            />
            <p className="text-xl sm:text-2xl text-muted-foreground">
              {formattedAmount(resolvedPrice!)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-base mb-4">
            <span className="font-semibold text-foreground">Store Name:</span>
            <span className="text-muted-foreground">
              {productDetail?.payload.business_name}
            </span>
            <StarRatingDisplay
              rating={customerDeliveryRating}
              ratio={payload?.customer_delivery_ratio}
              ratioClassName="text-sm"
              size={15}
            />
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
                (isFinite(maxQuantity) && quantity >= maxQuantity) ||
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
            {/* <Button
              variant="secondary"
              size="xl"
              className="w-full rounded-2xl text-base font-semibold"
              disabled={isOutOfStock || (hasVariations && !activeVariation)}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button> */}
            <Button
              size="xl"
              className="w-full rounded-2xl text-base font-semibold"
              onClick={handleBuyNow}
              disabled={isOutOfStock || (hasVariations && !activeVariation)}
            >
              Buy Now
            </Button>
          </div>

          <div className="flex items-center gap-2 text-base mb-4">
            <span className="font-semibold">Availability:</span>
            <span className="text-foreground">
              {" "}
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
          </div>

          {payload?.description && (
            <div className="flex flex-col" ref={descriptionRef}>
              <span className="font-semibold mb-2">Description:</span>
              <div
                className={cn(
                  "relative transition-all duration-300",
                  !isDescriptionExpanded && "max-h-[180px] overflow-hidden",
                )}
              >
                <div
                  className="text-sm text-muted-foreground leading-relaxed
                  [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                  [&_li]:mb-1 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-semibold
                  [&_h3]:text-sm [&_h3]:font-semibold [&_a]:text-primary [&_a]:underline
                  [&_strong]:font-semibold [&_em]:italic [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl"
                  dangerouslySetInnerHTML={{
                    __html: ProductDetailsHelper.sanitizeHtml(
                      payload.description,
                    ),
                  }}
                />
                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none" />
                )}
              </div>
              <Button
                variant="link"
                onClick={() => {
                  if (isDescriptionExpanded) {
                    setIsDescriptionExpanded(false);
                    // Add a slight delay to allow the collapse animation to start before scrolling
                    setTimeout(() => {
                      descriptionRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }, 50);
                  } else {
                    setIsDescriptionExpanded(true);
                  }
                }}
                className="p-0 h-auto text-primary mt-2 font-medium self-start"
              >
                {isDescriptionExpanded ? "Read Less" : "Read More"}
              </Button>
            </div>
          )}
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

const StarRatingDisplay = ({
  rating,
  ratio,
  label,
  className,
  ratioClassName,
  size = 28,
}: {
  rating: number;
  ratio?: string | number;
  label?: string;
  className?: string;
  ratioClassName?: string;
  size?: number | string;
}) => {
  if (rating <= 0) return null;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <span className="font-semibold text-base">{label}:</span>}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const starIndex = i + 1;
          const svgPath =
            "M10.2997 5.4303C11.9468 2.47677 12.7697 1 14.0007 1C15.2318 1 16.0547 2.47677 17.7017 5.4303L18.1281 6.19468C18.5961 7.03446 18.8301 7.45435 19.1941 7.73124C19.5581 8.00814 20.0131 8.11083 20.9231 8.31623L21.7498 8.50342C24.9478 9.22751 26.5454 9.5889 26.9263 10.8122C27.3059 12.0341 26.2165 13.3094 24.0365 15.8587L23.4723 16.5177C22.8535 17.2418 22.5428 17.6045 22.4037 18.0517C22.2646 18.5002 22.3114 18.9838 22.405 19.9497L22.4908 20.8297C22.8197 24.2318 22.9848 25.9321 21.989 26.6874C20.9933 27.4427 19.4957 26.7537 16.5032 25.3757L15.7271 25.0195C14.8769 24.6269 14.4518 24.4319 14.0007 24.4319C13.5496 24.4319 13.1246 24.6269 12.2744 25.0195L11.4996 25.3757C8.50576 26.7537 7.0082 27.4427 6.01372 26.6887C5.01664 25.9321 5.18174 24.2318 5.51063 20.8297L5.59643 19.951C5.69003 18.9838 5.73683 18.5002 5.59643 18.053C5.45863 17.6045 5.14794 17.2418 4.52916 16.519L3.96497 15.8587C1.78492 13.3107 0.695545 12.0354 1.07514 10.8122C1.45473 9.5889 3.05499 9.22621 6.25291 8.50342L7.07969 8.31623C7.98837 8.11083 8.44206 8.00814 8.80735 7.73124C9.17265 7.45435 9.40534 7.03446 9.87333 6.19468L10.2997 5.4303Z";

          if (rating >= starIndex) {
            // Full Star
            return (
              <svg
                key={i}
                width={size}
                height={size}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={svgPath}
                  fill="#FFC107"
                  stroke="#FFC107"
                  strokeWidth="2"
                />
              </svg>
            );
          } else if (rating >= starIndex - 0.5) {
            // Half Star
            return (
              <div key={i} className="relative">
                <svg
                  width={size}
                  height={size}
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={svgPath} stroke="#9f9d9e" strokeWidth="2" />
                </svg>
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: "50%" }}
                >
                  <svg
                    width={size}
                    height={size}
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d={svgPath}
                      fill="#FFC107"
                      stroke="#FFC107"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            );
          } else {
            // Empty Star
            return (
              <svg
                key={i}
                width={size}
                height={size}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={svgPath} stroke="#9f9d9e" strokeWidth="2" />
              </svg>
            );
          }
        })}
        <span
          className={cn(
            "text-sm font-medium text-muted-foreground ml-1",
            ratioClassName,
          )}
        >
          ({ratio}%)
        </span>
      </div>
    </div>
  );
};
