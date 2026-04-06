import { apiPost, marketplaceApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { CreateOrderRequest, CreateOrderResponse } from "@/types";

export const OrderServices = {
  createOrder: (payload: CreateOrderRequest) => {
    const response = apiPost<CreateOrderResponse, CreateOrderRequest>(
      marketplaceApi,
      API_ENDPOINTS.CREATE_ORDER,
      payload,
    );
    return response;
  },
};
