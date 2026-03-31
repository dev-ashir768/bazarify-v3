import {
  ProductInventory,
  ProductVariation,
  SelectedAttributes,
} from "@/types";

export const ProductDetailsHelper = {
  getMaxInventory: (inventory: ProductInventory[]): number => {
    if (!inventory || !Array.isArray(inventory) || inventory.length === 0)
      return 0;
    const quantities = inventory.map((inv) => Number(inv.quantity) || 0);
    return Math.max(0, ...quantities);
  },

  getMaxInventoryItem: (inventory: ProductInventory[]): ProductInventory | null => {
    if (!inventory || !Array.isArray(inventory) || inventory.length === 0)
      return null;
    const quantities = inventory.map((inv) => Number(inv.quantity) || 0);
    return (
      inventory.find(
        (inv) => Number(inv.quantity) === Math.max(0, ...quantities),
      ) ?? null
    );
  },

  findMatchingVariations: (
    selectedAttributes: SelectedAttributes,
    variations: ProductVariation[],
    totalAttributes: number,
  ): ProductVariation | null => {
    const selectedKeys = Object.keys(selectedAttributes);

    if (selectedKeys.length < totalAttributes) {
      return null;
    }
    return (
      variations.find((variation) =>
        selectedKeys.every(
          (key) => variation.combination[key] === selectedAttributes[key],
        ),
      ) ?? null
    );
  },

  generateOrderReference: (prefix: string = "MKT"): string => {
    const date = new Date().getDate();
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();

    return `${prefix}-${date}-${randomStr}`;
  },
};
