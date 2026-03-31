"use client";

import { Button } from "@/components/ui/button";
import PriceFilter from "./price-filter";
import { useCategoryHooks } from "@/hooks/useCategoryHooks";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface CategoryFiltersProps {
  minBound: number;
  maxBound: number;
}

const CategoryFilters = ({ minBound, maxBound }: CategoryFiltersProps) => {
  // ========================= Hooks ========================= \\
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeCategory = searchParams.get("category");

  // ========================= Data Fetching ========================= \\
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useCategoryHooks.GetList();

  // ========================= Handler ========================= \\
  const handleFilter = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams);
      const lowerCategory = category.toLowerCase();

      if (activeCategory === lowerCategory) {
        params.delete("category");
      } else {
        params.set("category", lowerCategory);
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, activeCategory, pathname, router],
  );

  // ========================= Render ========================= \\
  if (isLoading) return <LoadingSkeleton.CategorySkeleton />;

  if (isError)
    return (
      <div className="col-span-full py-10">
        <ErrorState
          onRetry={() => refetch()}
          message="We couldn't load the categories. Please try again later."
        />
      </div>
    );

  return (
    <div className="w-full overflow-hidden">
      <div className="container flex items-center justify-start sm:justify-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-2 sm:pb-0 flex-nowrap sm:flex-wrap">
        {categories?.payload?.map((category) => {
          const isSelected = activeCategory === category.name.toLowerCase();

          return (
            <div key={category.id}>
              <Button
                size="pill"
                variant="filter"
                className={cn(
                  "2xl:mb-2",
                  isSelected &&
                    "bg-primary text-primary-foreground hover:bg-primary/80",
                )}
                onClick={() => handleFilter(category.name)}
              >
                {category.name}
              </Button>
            </div>
          );
        })}
        <div>
          <PriceFilter
            key={`${activeCategory}-${searchParams.get("minPrice")}-${searchParams.get("maxPrice")}`}
            minBound={minBound}
            maxBound={maxBound}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;
