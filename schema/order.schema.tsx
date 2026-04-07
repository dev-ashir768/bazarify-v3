import z from "zod";

export const orderSchema = z.object({
  acno: z.string().min(1, "Account number is required"),
  consignee_name: z.string().min(1, "Name is required"),
  consignee_email: z.string().min(1, "Email is required"),
  consignee_contact: z.string().min(1, "Contact is required"),
  destination_city_id: z.number({
    invalid_type_error: "City is required",
  }),
  consignee_address: z.string().min(1, "Address is required"),
  order_ref: z.string().min(1, "Order reference is required"),
  platform_id: z.number({ invalid_type_error: "Platform is required" }),
  payment_method_id: z.number({
    invalid_type_error: "Payment method is required",
  }),
  remarks: z.string().optional(),
  shipping_charges: z.number().min(0),
  line_items: z.array(
    z.object({
      product_id: z.number(),
      variation_id: z.number(),
      location_id: z.number(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    }),
  ),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
