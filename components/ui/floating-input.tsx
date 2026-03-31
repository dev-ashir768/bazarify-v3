import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { cva, type VariantProps } from "class-variance-authority"
import { Label } from "./label"

const floatingInputVariants = cva(
  "peer flex w-full border-2 border-border bg-transparent transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: {
        sm: "h-10 rounded-lg px-3 py-1.5 text-sm",
        md: "h-12 rounded-xl px-4 py-2 text-sm",
        lg: "h-14 rounded-xl px-4 py-2 text-[15px]",
        xl: "h-16 rounded-2xl px-5 py-4 text-base",
      },
    },
    defaultVariants: {
      inputSize: "lg",
    },
  }
)

const floatingLabelVariants = cva(
  "absolute bg-background px-2 font-medium text-muted-foreground transition-all duration-200 z-10 pointer-events-none",
  {
    variants: {
      inputSize: {
        sm: "left-2 peer-placeholder-shown:top-[10px] peer-placeholder-shown:text-sm peer-focus:-top-[8px] peer-focus:text-xs peer-focus:text-primary -top-[8px] text-xs",
        md: "left-3 peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-sm peer-focus:-top-[10px] peer-focus:text-xs peer-focus:text-primary -top-[10px] text-xs",
        lg: "left-3 peer-placeholder-shown:top-[17px] peer-placeholder-shown:text-[15px] peer-focus:-top-[10px] peer-focus:text-sm peer-focus:text-primary -top-[10px] text-sm",
        xl: "left-4 peer-placeholder-shown:top-[20px] peer-placeholder-shown:text-base peer-focus:-top-[12px] peer-focus:text-sm peer-focus:text-primary -top-[12px] text-sm",
      },
    },
    defaultVariants: {
      inputSize: "lg",
    },
  }
)

export interface FloatingInputProps
  extends React.ComponentProps<typeof Input>,
    VariantProps<typeof floatingInputVariants> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type, label, id, inputSize, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || defaultId;

    return (
      <div className="relative">
        <Input
          type={type}
          id={inputId}
          className={cn(floatingInputVariants({ inputSize, className }))}
          placeholder=" "
          ref={ref}
          {...props}
        />
        <Label
          htmlFor={inputId}
          className={cn(floatingLabelVariants({ inputSize }))}
        >
          {label}
        </Label>
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput, floatingInputVariants }
