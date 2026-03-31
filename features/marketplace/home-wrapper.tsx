"use client";

import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import CategoryFilters from "../category-filter/category-filters";
import ProductCard from "../products/product-card";
import HomeHero from "./home-hero";
import { useProductHooks } from "@/hooks/useProductHooks";
import { ErrorState } from "@/components/shared/error-state";
import { RiLoader4Line } from "@remixicon/react";
import { useSearchParams } from "next/navigation";
import { useCategoryHooks } from "@/hooks/useCategoryHooks";
import { GetProductsListParams } from "@/types";
import { useEffect, useRef } from "react";

const HomeWrapper = () => {
  // ========================= URL Params ========================= \\
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  // ========================= Data Fetching ========================= \\
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesIsError,
    refetch: categoriesRefetch,
  } = useCategoryHooks.GetList();

  const categoryId = categories?.payload?.find(
    (item) => item.name.toLowerCase() === category?.toLowerCase(),
  )?.id;

  const data: GetProductsListParams = {
    categoryId: categoryId ? [categoryId] : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
  };

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsIsError,
    refetch: productsRefetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductHooks.GetList(data);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  const allProducts = products?.pages.flatMap((page) => page.payload) || [];

  // ========================= Price Bounds ========================= \\
  const productPrices =
    allProducts
      ?.map((p) => Number(p.on_sale === "Y" ? p.sale_price : p.price))
      .filter((p) => !isNaN(p)) || [];

  const minBound = productPrices.length > 0 ? Math.min(...productPrices) : 0;
  const maxBound =
    productPrices.length > 0 ? Math.max(...productPrices) : 10000;

  // ========================= Render ========================= \\
  const isLoading = categoriesLoading || productsLoading;
  const isError = categoriesIsError || productsIsError;
  const refetch = () => {
    productsRefetch();
    categoriesRefetch();
  };

  const renderProductCards = () => {
    if (isLoading)
      return Array.from({ length: 10 }).map((_, i) => (
        <LoadingSkeleton.ProductCardSkeleton key={i} />
      ));

    if (isError)
      return (
        <div className="col-span-full py-10">
          <ErrorState onRetry={() => refetch()} />
        </div>
      );

    if (allProducts.length === 0) {
      return (
        <div className="col-span-full py-10">
          <ErrorState
            title="No products found"
            message="No products found matching your criteria"
          />
        </div>
      );
    }

    return allProducts.map((item) => <ProductCard key={item.id} {...item} />);
  };

  return (
    <>
      <section className="pb-8">
        <HomeHero />
        <CategoryFilters minBound={minBound} maxBound={maxBound} />
      </section>
      <section className="container pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-8">
          {renderProductCards()}
          {isFetchingNextPage &&
            Array.from({ length: 5 }).map((_, i) => (
              <LoadingSkeleton.ProductCardSkeleton key={`next-${i}`} />
            ))}
        </div>

        <div ref={observerTarget} className="flex justify-center pt-8 w-full">
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-2">
              <RiLoader4Line className="animate-spin text-primary" size={32} />
              <p className="text-sm text-muted-foreground font-medium">
                Loading more products...
              </p>
            </div>
          )}
        </div>

        {!hasNextPage && allProducts.length > 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No more products to show
          </p>
        )}
      </section>
    </>
  );
};

export default HomeWrapper;
