"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { ProductServices } from "@/services/product.services";
import { GetProductDetailParams, GetProductsListParams } from "@/types";

export const useProductHooks = {
  GetList: (data: GetProductsListParams) => {
    return useInfiniteQuery({
      queryKey: [
        QUERY_KEYS.PRODUCTS_LISTING,
        ...(data.categoryId ? [data.categoryId] : []),
        ...(data.maxPrice ? [data.maxPrice] : []),
        ...(data.minPrice ? [data.minPrice] : []),
      ],
      queryFn: ({ pageParam = 0 }) =>
        ProductServices.getProductsByCategory({
          ...data,
          offset: pageParam as number,
          limit: 20,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const payload = lastPage?.payload || [];
        if (payload.length < 20) return undefined;
        return allPages.length * 20;
      },
    });
  },
  GetDetail: (data: GetProductDetailParams) => {
    return useQuery({
      queryKey: [QUERY_KEYS.PRODUCT_DETAIL, data.acno, data.product_id],
      queryFn: () => ProductServices.getProductDetail(data),
      enabled: !!data.acno && !!data.product_id,
    });
  },
};
