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
    marketplace_category_id: number[];
  }[];
}

export interface GetProductsListParams {
  categoryId?: [number];
  productId?: number;
  maxPrice?: number;
  minPrice?: number;
  limit?: number;
  offset?: number;
  search?: string;
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
    customer_delivery_ratio: string | number;
    default_inventory: {
      id: number;
      location_id: number;
      quantity: number;
      default: number;
      location_name: string;
    }[];
    description: string;
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
  item_ref: string;
  product_name: string;
  price: string;
  max_quantity: number;
}

export interface LineItems {
  product_id: number;
  variation_id: number;
  location_id: number;
  quantity: number;
}

export type SelectedAttributes = Record<string, string>;

// ========================= City List ========================= \\
export type CityListResponse = {
  id: string;
  city_name: string;
  country_id: string;
  province_id: string;
  created_at: string;
  updated_at: string | null;
}[];

export type SelectOptionType = { value: string | number; label: string };

// ========================= Create Order ========================= \\
export type CreateOrderResponse = {
  status: 1 | 0;
  message: string;
  payload: {
    status: string;
    message: string;
    payload: {
      request: {
        consignee_name: string;
        consignee_address: string;
        consignee_email: string;
        consignee_contact: string;
        destination_city_id: number;
        order_ref: string;
        platform_id: number;
        payment_method_id: number;
        remarks: string;
        shipping_charges: number;
        line_items: {
          product_id: number;
          variation_id: number;
          location_id: number;
          quantity: number;
        }[];
        customer_platform_id: number;
        is_marketplace_order: string;
      };
    };
  }[];
};

export interface CreateOrderRequest {
  acno: string;
  orders: {
    consignee_name: string;
    consignee_address: string;
    consignee_email: string;
    consignee_contact: string;
    destination_city_id: number;
    order_ref: string;
    platform_id: number;
    payment_method_id: number;
    remarks: string;
    shipping_charges: number;
    line_items: {
      product_id: number;
      variation_id: number;
      location_id: number;
      quantity: number;
    }[];
  }[];
}
