import { apiPost, externalApi } from "@/lib/axios";
import { API_ENDPOINTS, DEFAULT_PAYLOADS } from "@/lib/constants";
import { CityListResponse } from "@/types";

export const CityServices = {
  getList: () => {
    const response = apiPost<CityListResponse>(
      externalApi,
      API_ENDPOINTS.CITIES,
      DEFAULT_PAYLOADS.CITIES,
    );
    return response;
  },
};
