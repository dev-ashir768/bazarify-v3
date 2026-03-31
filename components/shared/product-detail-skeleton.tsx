"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-4 sm:mb-8">
        <Skeleton className="h-4 w-24 bg-card" />
        <Skeleton className="h-4 w-4 bg-card" />
        <Skeleton className="h-4 w-32 bg-card" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Images Section */}
        <div className="lg:col-span-7 xl:col-span-6 xl:max-w-[650px] w-full flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Vertical Thumbnails Skeleton */}
          <div className="order-2 sm:order-1 shrink-0 sm:w-24 flex flex-row sm:flex-col gap-2.5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="aspect-square w-20 sm:w-full rounded-xl bg-card"
              />
            ))}
          </div>

          {/* Main Large Image Skeleton */}
          <div className="order-1 sm:order-2 flex-1 relative rounded-3xl overflow-hidden aspect-square sm:aspect-auto h-[361px] lg:h-[427px]">
            <Skeleton className="w-full h-full bg-card" />
          </div>
        </div>

        {/* Right Side: Content Section */}
        <div className="lg:col-span-5 xl:col-span-6 xl:max-w-[500px] w-full space-y-6">
          <div>
            {/* Title Skeleton */}
            <Skeleton className="h-10 w-3/4 mb-4 bg-card" />
            {/* Price Skeleton */}
            <Skeleton className="h-8 w-1/3 bg-card" />
          </div>

          {/* Store Name Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 bg-card" />
            <Skeleton className="h-5 w-32 bg-card" />
          </div>

          {/* Quantity Selector Skeleton */}
          <div className="flex items-center justify-between max-w-36 py-1 w-full mb-8">
            <Skeleton className="size-10 rounded-full bg-card" />
            <Skeleton className="h-6 w-8 bg-card" />
            <Skeleton className="size-10 rounded-full bg-card" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="space-y-4 sm:max-w-[400px]">
            <Skeleton className="h-[52px] w-full rounded-2xl bg-card" />
            <Skeleton className="h-[52px] w-full rounded-2xl bg-card" />
          </div>

          {/* Availability Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 bg-card" />
            <Skeleton className="h-5 w-20 bg-card" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
