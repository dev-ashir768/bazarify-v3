import { CartItems } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartState {
  items: CartItems[];
  addItem: (item: CartItems) => void;
  updateQuantity: (order_ref: string, change: number) => void;
  removeItem: (order_ref: string) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((prev) => {
          const existingItemIndex = prev.items.findIndex(
            (i) => i.order_ref === item.order_ref,
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...prev.items];
            updatedItems[existingItemIndex].line_items.quantity +=
              item.line_items.quantity;
            return { items: updatedItems };
          }

          return { items: [...prev.items, item] };
        });
      },
      updateQuantity: (order_ref, change) => {
        set((prev) => ({
          items: prev.items
            .map((item) => {
              if (item.order_ref === order_ref) {
                const newQuantity = item.line_items.quantity + change;
                if (newQuantity <= 0) return null;
                return {
                  ...item,
                  line_items: { ...item.line_items, quantity: newQuantity },
                };
              }
              return item;
            })
            .filter(Boolean) as CartItems[],
        }));
      },
      removeItem: (order_ref) => {
        set((prev) => ({
          items: prev.items.filter((i) => i.order_ref !== order_ref),
        }));
      },
      clearCart: () =>
        set({
          items: [],
        }),
      totalItems: () =>
        get().items?.reduce((acc, item) => acc + item.line_items.quantity, 0)
    }),
    {
      name: "user-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
