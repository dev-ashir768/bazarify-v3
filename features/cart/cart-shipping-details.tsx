"use client";

import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";

const cityOptions = [
  { value: "karachi", label: "karachi" },
  { value: "lahore", label: "lahore" },
  { value: "islamabad", label: "islamabad" },
];

const CartShippingDetails = () => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold">Shipping Details</h2>
      <div className="flex flex-col gap-6 mt-6">
        <FloatingInput label="First Name" inputSize="lg" />
        <FloatingInput label="Last Name" inputSize="lg" />
        <FloatingInput label="Email" type="email" inputSize="lg" />
        <FloatingInput label="Mobile Number" type="tel" inputSize="lg" />

        <FloatingSelect
          label="City"
          options={cityOptions}
          isSearchable
          isClearable
        />

        <FloatingInput label="Address" />
      </div>
    </div>
  );
};

export default CartShippingDetails;
