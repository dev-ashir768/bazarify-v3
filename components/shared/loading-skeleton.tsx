import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export const LoadingSkeleton = {
  ProductCardSkeleton: () => (
    <div className="flex flex-col gap-3">
      <Skeleton className="relative w-full aspect-square rounded-2xl bg-card" />
      <div className="px-2 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-card" />
        <Skeleton className="h-5 w-1/2 bg-card" />
        <Skeleton className="h-6 w-24 bg-card" />
      </div>
    </div>
  ),

  CategorySkeleton: () => (
    <div className="w-full overflow-hidden">
      <div className="container flex items-center justify-start sm:justify-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-2 sm:pb-0 flex-nowrap sm:flex-wrap">
        {[85, 97, 122, 109, 98, 127].map((width, i) => (
          <Skeleton
            key={i}
            className={cn(`shrink-0 rounded-full h-12 bg-card`)}
            style={{ width: `${width}px` }}
          />
        ))}
      </div>
    </div>
  ),

  NavbarSkeleton: () => (
    <div className="container absolute top-0 left-0 right-0 w-full z-50 flex items-center justify-between py-4 h-[65px]">
      <Skeleton className="w-[130px] h-[37px]" />
      <Skeleton className="w-[113px] h-[32px]" />
    </div>
  ),
};
