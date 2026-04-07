"use client";

import { useCategoryHooks } from "@/hooks/useCategoryHooks";
import { PUBLIC_ROUTES } from "@/lib/constants";
import ImageFallback from "@/lib/image-fallback";
import { ProductListResponse } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const ProductCard = ({
  id,
  acno,
  product_name,
  price,
  sale_price,
  image,
  on_sale,
  sku_code,
  business_name,
  marketplace_category_id,
}: ProductListResponse["payload"][0]) => {
  // ========================= Hooks ========================= \\
  const searchParams = useSearchParams();
  const router = useRouter();

  // ========================= Data Fetching ========================= \\
  const { data: categories } = useCategoryHooks.GetList();

  const categoryNames = marketplace_category_id.map(
    (id) => categories?.payload?.find((item) => item.id === id)?.name,
  );

  // ========================= Handler ========================= \\
  const handleProductClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", categoryNames?.toString().toLowerCase() || "");
    router.push(
      `${PUBLIC_ROUTES.PRODUCTS.replaceAll(":id", id).replaceAll(":acno", acno)}?${params.toString()}`,
    );
  };

  return (
    <>
      <div
        className="flex flex-col gap-3 cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="relative w-full aspect-square bg-card rounded-2xl overflow-hidden">
          <ImageFallback
            key={sku_code}
            alt={image}
            fill
            className="object-contain transition-transform duration-300 ease-in-out hover:scale-105"
            src={
              image?.startsWith("http")
                ? image
                : process.env.NEXT_PUBLIC_API_BASE_URL_GET_ORIO +
                  "/uploads/" +
                  acno +
                  "/" +
                  image
            }
            fallbackSrc={
              "/images/product-placeholder.jpeg"
            }
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="eager"
          />
        </div>
        <div className="px-2">
          <div className="text-sm text-muted-foreground mb-1 capitalize line-clamp-2">
            {product_name}
          </div>
          <p className="text-base text-muted-foreground mb-1 capitalize line-clamp-2">
            {business_name}
          </p>
          {on_sale === "Y" ? (
            <p className="font-bold text-[17px] text-foreground">
              Rs. {sale_price}
            </p>
          ) : (
            <p className="font-bold text-[17px] text-foreground">Rs. {price}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
