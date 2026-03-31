import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { CategoryServices } from "@/services/category.services";

export const useCategoryHooks = {
  GetList: () => {
    return useQuery({
      queryKey: [QUERY_KEYS.CATEGORIES_LISTING],
      queryFn: () => CategoryServices.getList(),
    });
  },
};
