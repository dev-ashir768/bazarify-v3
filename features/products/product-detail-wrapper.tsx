import ProductCard from "./product-card";
import ProductDetail from "./product-detail";

interface ProductDetailWrapperProps {
  productId: number;
  acno: string;
}

const products = [
  {
    id: "1",
    acno: "0",
    product_name: "Wireless Noise Cancelling Headphones",
    price: "100",
    sale_price: "0",
    image: "https://placehold.co/600x600/F6F6F6/474747/png?text=Headphones",
    on_sale: "N" as const,
    sku_code: "SKU001",
    business_name: "SoundMax",
    inventory_policy: "deny",
    product_weight: "0.5",
    type: "simple",
  },
  {
    id: "2",
    acno: "0",
    product_name: "Smart Fitness Watch Pro",
    price: "120",
    sale_price: "0",
    image: "https://placehold.co/600x600/F6F6F6/474747/png?text=Watch",
    on_sale: "N" as const,
    sku_code: "SKU002",
    business_name: "FitCore",
    inventory_policy: "deny",
    product_weight: "0.2",
    type: "simple",
  },
  {
    id: "3",
    acno: "0",
    product_name: "Portable Bluetooth Speaker",
    price: "150",
    sale_price: "0",
    image: "https://placehold.co/600x600/F6F6F6/474747/png?text=Speaker",
    on_sale: "N" as const,
    sku_code: "SKU003",
    business_name: "BoomBeat",
    inventory_policy: "deny",
    product_weight: "1.0",
    type: "simple",
  },
  {
    id: "4",
    acno: "0",
    product_name: "Ultra HD 4K Action Camera",
    price: "200",
    sale_price: "0",
    image: "https://placehold.co/600x600/F6F6F6/474747/png?text=Camera",
    on_sale: "N" as const,
    sku_code: "SKU004",
    business_name: "CaptureX",
    inventory_policy: "deny",
    product_weight: "0.3",
    type: "simple",
  },
  {
    id: "5",
    acno: "0",
    product_name: "Ergonomic Office Chair",
    price: "180",
    sale_price: "0",
    image: "https://placehold.co/600x600/F6F6F6/474747/png?text=Chair",
    on_sale: "N" as const,
    sku_code: "SKU005",
    business_name: "ComfortZone",
    inventory_policy: "deny",
    product_weight: "15.0",
    type: "simple",
  },
  {
    id: "6",
    acno: "0",
    product_name: "Gaming Mechanical Keyboard RGB",
    price: "90",
    sale_price: "0",
    image: "https://placehold.co/600x600/F6F6F6/474747/png?text=Keyboard",
    on_sale: "N" as const,
    sku_code: "SKU006",
    business_name: "KeyStrike",
    inventory_policy: "deny",
    product_weight: "1.2",
    type: "simple",
  },
];

const ProductDetailWrapper = ({
  productId,
  acno,
}: ProductDetailWrapperProps) => {
  return (
    <>
      <section className="container pb-16 pt-[96px]">
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
          {products.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </>
  );
};

export default ProductDetailWrapper;
