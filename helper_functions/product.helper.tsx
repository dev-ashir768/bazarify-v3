import {
  ProductInventory,
  ProductVariation,
  SelectedAttributes,
} from "@/types";

/**
 * inventory_policy:
 *  "0" → check quantity (enforce stock limit)
 *  "1" → ignore quantity (allow unlimited purchase)
 */
export const INVENTORY_POLICY = {
  CHECK_QUANTITY: "0",
  IGNORE_QUANTITY: "1",
} as const;

export const ProductDetailsHelper = {
  getMaxInventory: (inventory: ProductInventory[]): number => {
    if (!inventory || !Array.isArray(inventory) || inventory.length === 0)
      return 0;
    const quantities = inventory.map((inv) => Number(inv.quantity) || 0);
    return Math.max(0, ...quantities);
  },

  /**
   * Returns the effective max quantity respecting the inventory_policy.
   * - policy "1" → Infinity (no stock restriction)
   * - policy "0" or missing → actual stock quantity
   */
  getEffectiveMaxQuantity: (
    inventory: ProductInventory[],
    inventoryPolicy: string | number | undefined,
  ): number => {
    if (String(inventoryPolicy) === INVENTORY_POLICY.IGNORE_QUANTITY) return Infinity;
    return ProductDetailsHelper.getMaxInventory(inventory);
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

  /**
   * Cleans HTML strings returned by the API:
   * - Removes data-* attributes (data-start, data-end, etc.)
   * - Fixes "Andamp;" → "&amp;" so the browser renders an actual "&"
   */
  sanitizeHtml: (html: string): string => {
    return (
      html
        // 1. Normalise the CMS-specific bad entity before decoding
        .replace(/Andamp;/g, "&amp;")
        // 2. Decode HTML entities so <p> etc. become real tags
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        // 3. Strip noisy data-* attributes from the decoded HTML
        .replace(/\s+data-[\w-]+="[^"]*"/g, "")
    );
  },

  /**
   * Calculates the number of stars (1-5) based on customer_delivery_ratio string (0-100)
   * 1-20   -> 1 star
   * 21-40  -> 2 stars
   * 41-60  -> 3 stars
   * 61-80  -> 4 stars
   * 81-100 -> 5 stars
   * Returns empty array if value is null or invalid
   */
  /**
   * Calculates a star rating (0-5) rounded to nearest 0.5 based on customer_delivery_ratio
   * Returns 0 if value is null or invalid
   */
  getCustomerRating: (ratioVal: string | number | null | undefined): number => {
    if (ratioVal === null || ratioVal === undefined) return 0;
    
    // Convert to string first to avoid ".match is not a function" if API returns a number
    const ratioStr = String(ratioVal);
    const match = ratioStr.match(/\d+/);
    if (!match) return 0;
    
    const ratio = parseFloat(match[0]);
    if (isNaN(ratio) || ratio <= 0) return 0;
    
    // Scale 100 to 5, round to nearest 0.5
    let rating = (ratio / 100) * 5;
    rating = Math.round(rating * 2) / 2;
    
    return Math.min(5, Math.max(0, rating));
  },
};
