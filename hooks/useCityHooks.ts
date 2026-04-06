import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { CityServices } from "@/services/city.services";

export const useCityHooks = {
  GetList: () => {
    return useQuery({
      queryKey: [QUERY_KEYS.CITY_LISTING],
      queryFn: () => CityServices.getList(),
    });
  },
};
