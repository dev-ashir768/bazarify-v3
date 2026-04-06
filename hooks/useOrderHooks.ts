import { useMutation } from "@tanstack/react-query";
import { OrderServices } from "@/services/order.services";
import { CreateOrderRequest, CreateOrderResponse } from "@/types";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { AxiosError } from "axios";

export const useOrderHooks = {
  CreateOrder: () => {
    const { clearCart } = useCartStore();

    return useMutation<
      CreateOrderResponse,
      AxiosError<CreateOrderResponse>,
      CreateOrderRequest
    >({
      mutationFn: (payload) => OrderServices.createOrder(payload),
      onSuccess: (data) => {
        if (data.status === 1) {
          toast.success("Order placed successfully!");
          clearCart();
        } else {
          toast.error(data.message || "Failed to place order");
        }
      },
      onError: (error) => {
        toast.error(
          (error?.response?.data)?.message || "Something went wrong!",
        );
      },
    });
  },
};
