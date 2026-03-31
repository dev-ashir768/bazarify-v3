import { apiPost, marketplaceApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { CategoryListResponse } from "@/types";

export const CategoryServices = {
  getList: () => {
    const response = apiPost<CategoryListResponse>(
      marketplaceApi,
      API_ENDPOINTS.CATEGORIES,
      {},
    );
    return response;
  },
};
