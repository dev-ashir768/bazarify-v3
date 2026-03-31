"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface PriceFilterProps {
  minBound: number;
  maxBound: number;
}

const PriceFilter = ({ minBound, maxBound }: PriceFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const [values, setValues] = useState(() => {
    const minParam = searchParams.get("minPrice");
    const maxParam = searchParams.get("maxPrice");
    return [
      minParam !== null ? Number(minParam) : minBound,
      maxParam !== null ? Number(maxParam) : maxBound,
    ];
  });
  const router = useRouter();
  const pathname = usePathname();

  const handleSliderChange = (newValues: number[]) => {
    setValues(newValues);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setValues([val, values[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setValues([values[0], val]);
  };

  const handleReset = () => {
    setValues([minBound, maxBound]);
    const params = new URLSearchParams(searchParams);
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleDone = () => {
    setIsOpen(false);
    const params = new URLSearchParams(searchParams);
    params.set("minPrice", values[0].toString());
    params.set("maxPrice", values[1].toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="pill" variant="filter" className="2xl:mb-2">
          Price
          <svg
            className={cn(
              "ml-2 w-4 h-4 transition-transform duration-200",
              isOpen ? "rotate-180" : "",
            )}
            fill="none"
            stroke="var(--muted-foreground)"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[340px] bg-background p-5 rounded-3xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)]! ring-0"
        align="end"
      >
        <div className="flex flex-col">
          {/* Slider */}
          <div className="pt-4 mb-8">
            <Slider
              min={minBound}
              max={maxBound}
              step={10}
              value={values}
              onValueChange={handleSliderChange}
              className="w-full"
            />
          </div>

          {/* Inputs */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <Input
              value={values[0]}
              onChange={handleMinChange}
              className="h-12 text-center text-base rounded-xl border bg-background"
            />
            <span className="text-muted-foreground font-medium">to</span>
            <Input
              value={values[1].toLocaleString()}
              onChange={handleMaxChange}
              className="h-12 text-center text-base rounded-xl border bg-background"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-base font-medium"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white text-base font-medium"
              onClick={handleDone}
            >
              Done
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PriceFilter;
