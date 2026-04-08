import { Button } from "@/components/ui/button";
import { CartItems } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";

const CartItem = ({ item }: { item: CartItems }) => {
  const { removeItem, updateQuantity } = useCartStore();
  return (
    <>
      <div
        className="grid grid-cols-12 bg-background rounded-xl sm:rounded-2xl p-4 sm:p-6 gap-y-2 xs:gap-y-0"
      >
        <div className="col-span-12 xs:col-span-8 flex flex-col xs:flex-row items-start sm:items-center gap-2 xs:gap-4">
          <div className="size-20 bg-card rounded-lg shrink-0 overflow-hidden flex items-center justify-center border border-border">
            {item.line_items.product_image ? (
              <Image
                src={item.line_items.product_image}
                alt={item.product_name}
                width={80}
                height={80}
                className="object-cover size-full"
              />
            ) : (
              <div className="size-full bg-muted flex items-center justify-center text-muted-foreground">
                No Img
              </div>
            )}
          </div>
          <div className="mt-0.5">
            <h3 className="text-base font-medium text-muted-foreground">
              {item.product_name}
            </h3>
            <p className="font-semibold text-lg tracking-wide">{item.price}</p>
          </div>
        </div>

        <div className="col-span-4 xs:col-span-3 flex items-center justify-between max-w-28 xs:px-2 py-1.5 w-full">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => updateQuantity(item.item_ref, -1)}
            className="p-1 rounded-full bg-card hover:bg-card text-foreground hover:text-foreground"
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
          <span className="text-sm font-medium text-center">
            {item.line_items.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => updateQuantity(item.item_ref, 1)}
            disabled={item.max_quantity === item.line_items.quantity}
            className="p-1 rounded-full bg-card hover:bg-card text-foreground hover:text-foreground"
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

        <div className="col-span-2 xs:col-span-1 flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.item_ref)}
            className="p-0 bg-transparent hover:bg-transparent text-red-500 hover:text-red-500 [&_svg:not([class*='size-'])]:size-5.5"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CartItem;
