import { PUBLIC_ROUTES } from "@/lib/constants";
import ImageFallback from "@/lib/image-fallback";
import { ProductListResponse } from "@/types";
import Link from "next/link";

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
}: ProductListResponse["payload"][0]) => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Link
          href={PUBLIC_ROUTES.PRODUCTS.replaceAll(":id", id).replaceAll(
            ":acno",
            acno,
          )}
          className="relative w-full aspect-square bg-card rounded-2xl overflow-hidden"
        >
          <ImageFallback
            key={sku_code}
            alt={image}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
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
              "https://placehold.co/251x251/F6F6F6/474747/png?text=Not+Found"
            }
            unoptimized
          />
        </Link>
        <div className="px-2">
          <Link
            href={`/products/${id}`}
            className="text-sm text-muted-foreground mb-1 capitalize line-clamp-2"
          >
            {product_name}
          </Link>
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
