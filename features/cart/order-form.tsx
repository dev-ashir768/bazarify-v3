import CartShippingDetails from "./cart-shipping-details";
import CartOrderSummary from "./cart-order-summary";
import { useForm } from "react-hook-form";
import { OrderFormValues, orderSchema } from "@/schema/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrderHooks } from "@/hooks/useOrderHooks";
import { CreateOrderRequest } from "@/types";

const OrderForm = () => {
  // ========================= Hooks ========================= \\
  const { mutate, isPending } = useOrderHooks.CreateOrder();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      acno: "",
      consignee_name: "",
      consignee_email: "",
      consignee_contact: "",
      destination_city_id: "",
      consignee_address: "",
      order_ref: "",
      payment_method_id: undefined,
      platform_id: undefined,
      remarks: "",
      shipping_charges: undefined,
      line_items: [,],
    },
  });

  // ========================= Handler ========================= \\
  const onSubmit = (data: OrderFormValues) => {
    const payload: CreateOrderRequest = {
      acno: data.acno,
      orders: [
        {
          consignee_name: data.consignee_name,
          consignee_address: data.consignee_address,
          consignee_email: data.consignee_email,
          consignee_contact: data.consignee_contact,
          destination_city_id: Number(data.destination_city_id),
          order_ref: data.order_ref,
          platform_id: data.platform_id,
          payment_method_id: data.payment_method_id,
          remarks: data.remarks || "",
          shipping_charges: data.shipping_charges,
          line_items: data.line_items.map((item) => ({
            product_id: item.product_id,
            variation_id: item.variation_id,
            location_id: item.location_id,
            quantity: item.quantity,
          })),
        },
      ],
    };

    mutate(payload);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} id="order-form">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16">
          <div className="lg:col-span-5 2xl:col-span-6">
            <CartShippingDetails
              control={control}
              register={register}
              errors={errors}
            />
          </div>
          <div className="lg:col-span-7 2xl:col-span-6">
            <CartOrderSummary reset={reset} isPending={isPending} />
          </div>
        </div>
      </form>
    </>
  );
};

export default OrderForm;
