// ========================= Category List ========================= \\
export interface CategoryListResponse {
  status: 1 | 0;
  message: string;
  payload: {
    id: number;
    name: string;
  }[];
}

// ========================= Product List ========================= \\
export interface ProductListResponse {
  status: 1 | 0;
  message: string;
  payload: {
    id: string;
    acno: string;
    product_name: string;
    price: string;
    sale_price: string;
    inventory_policy: string;
    image: string;
    on_sale: "N" | "Y";
    product_weight: string;
    sku_code: string;
    type: string;
    business_name: string;
  }[];
}

export interface GetProductsListParams {
  categoryId?: [number];
  maxPrice?: number;
  minPrice?: number;
  limit?: number;
  offset?: number;
}

// ========================= Product Detail ========================= \\
export interface ProductInventory {
  id: number;
  location_id: number;
  quantity: number;
  default: number;
  location_name: string;
}

export interface ProductVariation {
  variation_id: string;
  price: string;
  sale_price: string;
  weight: string;
  sku_code: string;
  variation_image: string;
  inventory_policy: string;
  attribute_values: string;
  inventory: ProductInventory[];
  combination: Record<string, string>;
}
export interface ProductDetailResponse {
  status: 1 | 0;
  message: string;
  payload: {
    id: string;
    acno: string;
    business_name: string;
    product_name: string;
    on_sale: string;
    default_price: string;
    default_sale_price: string;
    default_weight: string;
    default_sku_code: string;
    default_image: string;
    default_inventory_policy: string;
    default_inventory: {
      id: number;
      location_id: number;
      quantity: number;
      default: number;
      location_name: string;
    }[];
    attributes: {
      name: string;
      options: string[];
    }[];
    variations: ProductVariation[];
  };
}

export interface GetProductDetailParams {
  product_id: number;
  acno: string;
}

// ========================= Add to Cart ========================= \\
export interface CartItems {
  acno: string;
  line_items: LineItems & { product_image: string };
  order_ref: string;
  platform_id: number;
  payment_method_id: number;
  product_name: string;
  price: string;
}

export interface LineItems {
  product_id: number;
  variation_id: number;
  location_id: number;
  quantity: number;
}

export type SelectedAttributes = Record<string, string>;
