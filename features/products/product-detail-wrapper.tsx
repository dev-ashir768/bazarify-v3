"use client";

import { useProductHooks } from "@/hooks/useProductHooks";
import ProductCard from "./product-card";
import ProductDetail from "./product-detail";
import { GetProductsListParams } from "@/types";
import { useCategoryHooks } from "@/hooks/useCategoryHooks";
import { useSearchParams } from "next/navigation";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";

interface ProductDetailWrapperProps {
  productId: number;
  acno: string;
}

const ProductDetailWrapper = ({
  productId,
  acno,
}: ProductDetailWrapperProps) => {
  // ========================= Hooks ========================= \\
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

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
    categoryId: [categoryId!],
    productId
  };

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsIsError,
    refetch: productsRefetch,
  } = useProductHooks.GetList(data);

  // ========================= Render ========================= \\
  const isLoading = categoriesLoading || productsLoading;
  const isError = categoriesIsError || productsIsError;
  const refetch = () => {
    categoriesRefetch();
    productsRefetch();
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

    if (products?.payload?.length === 0) {
      return (
        <div className="col-span-full py-10">
          <ErrorState
            title="No products found"
            message="No products found matching your criteria"
          />
        </div>
      );
    }

    return products?.payload?.map((item) => (
      <ProductCard key={item.id} {...item} />
    ));
  };

  return (
    <>
      <section className="container pb-16 pt-24">
        <ProductDetail productId={productId} acno={acno} />
      </section>
      <section className="container pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
            Related Products
          </h2>
          <p className="text-muted-foreground text-base">
            Explore our handpicked related products and find exactly
            what&apos;ve been looking for.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-8">
          {renderProductCards()}
        </div>
      </section>
    </>
  );
};

export default ProductDetailWrapper;
