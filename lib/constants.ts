export const REGEX = {
  FORBIDDEN_CODE:
    /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i,
  PHONE:
    /^(?:(?:\+|00)44|0)7(?:[45789]\d{2}|624)\d{6}$|^(?:\+1|1)?\s?\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$|^(\+92|92|0|0092)?(3\d{2}|\d{3})?\d{7}$/,
} as const;

export const STORAGE_KEYS = {
  TOKEN: "auth-token",
} as const;

export const PUBLIC_ROUTES = {
  HOME: "/",
  PRODUCTS: "/products/:acno/:id",
  CART: "/cart",
} as const;

export const API_ENDPOINTS = {
  CATEGORIES: "/marketplace/category",
  PRODUCTS: "/marketplace/getproducts",
  PRODUCT_DETAIL: "/marketplace/productdetail",
} as const;

export const QUERY_KEYS = {
  CATEGORIES_LISTING: "categories-listing",
  PRODUCTS_LISTING: "products-listing",
  PRODUCT_DETAIL: "product-detail",
} as const;
