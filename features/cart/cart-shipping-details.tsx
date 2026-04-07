"use client";

import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { useCityHooks } from "@/hooks/useCityHooks";
import { OrderFormValues } from "@/schema/order.schema";
import { SelectOptionType } from "@/types";
import { useMemo } from "react";
import {
  UseFormRegister,
  Control,
  Controller,
  FormState,
} from "react-hook-form";

const CartShippingDetails = ({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<OrderFormValues>;
  control: Control<OrderFormValues>;
  errors: FormState<OrderFormValues>["errors"];
}) => {
  // ========================= Data Fetching ========================= \\
  const { data: cityList, isLoading } = useCityHooks.GetList();

  // ========================= Mapped Data ========================= \\
  const cityOptions = useMemo(() => {
    return cityList?.map((city) => ({
      value: city.id,
      label: city.city_name,
    }));
  }, [cityList]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold">Shipping Details</h2>
      <div className="flex flex-col gap-6 mt-6">
        <div className="space-y-2">
          <FloatingInput
            label="Name"
            inputSize="lg"
            {...register("consignee_name")}
          />
          {errors.consignee_name?.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.consignee_name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <FloatingInput
            label="Email"
            type="email"
            inputSize="lg"
            {...register("consignee_email")}
          />
          {errors.consignee_email?.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.consignee_email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <FloatingInput
            label="Mobile Number"
            type="tel"
            inputSize="lg"
            {...register("consignee_contact")}
          />
          {errors.consignee_contact?.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.consignee_contact.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Controller
            control={control}
            name="destination_city_id"
            render={({ field }) => (
              <FloatingSelect
                {...field}
                label="City"
                options={cityOptions || []}
                value={cityOptions?.find((val) => Number(val.value) === field.value)}
                onChange={(val) => {
                  const opt = val as SelectOptionType;
                  field.onChange(opt?.value ? Number(opt.value) : null);
                }}
                isLoading={isLoading}
                isSearchable
                isClearable
              />
            )}
          />
          {errors.destination_city_id?.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.destination_city_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <FloatingInput label="Address" {...register("consignee_address")} />
          {errors.consignee_address?.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.consignee_address.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <FloatingInput label="Remarks" {...register("remarks")} />
          {errors.remarks?.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.remarks.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartShippingDetails;
