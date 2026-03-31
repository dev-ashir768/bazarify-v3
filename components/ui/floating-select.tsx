"use client";

import { useState } from "react";
import ReactSelect, { Props as SelectProps, StylesConfig } from "react-select";
import { Label } from "./label";

export interface FloatingSelectProps extends SelectProps {
  label: string;
}

export const FloatingSelect = ({ label, ...props }: FloatingSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue =
    !!props.value &&
    (Array.isArray(props.value)
      ? props.value.length > 0
      : typeof props.value === "string"
        ? props.value.length > 0
        : typeof props.value === "object" && Object.keys(props.value).length > 0);

  const isFloated = isFocused || hasValue;

  const defaultStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "56px",
      borderWidth: state.isFocused ? "1px" : "2px",
      borderRadius: "0.75rem",
      borderColor: state.isFocused ? "var(--primary)" : "var(--border)",
      boxShadow: state.isFocused
        ? "0 0 0 1px var(--primary), 0 0 0 4px color-mix(in oklch, var(--primary) 20%, transparent)"
        : "none",
      transition:
        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      "&:hover": {
        borderColor: state.isFocused ? "var(--primary)" : "var(--border)",
      },
      backgroundColor: "transparent",
      fontSize: "14px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 16px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "var(--muted-foreground)",
      padding: "8px 16px 8px 8px",
      cursor: "pointer",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "var(--muted-foreground)",
      fontSize: "14px",
      textTransform: "capitalize",
      cursor: "pointer",
      whiteSpace: "normal",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "var(--muted-foreground)",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "var(--primary)",
        color: "var(--background)",
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "var(--muted-foreground)",
      cursor: "pointer",
      padding: "0px",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.75rem",
      overflow: "hidden",
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
      marginTop: "4px",
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : state.isFocused
          ? "var(--muted)"
          : "transparent",
      color: state.isSelected ? "var(--background)" : "var(--muted-foreground)",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "var(--primary)",
        color: "var(--background)",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      display: "none",
    }),
  };

  const combinedStyles = {
    ...defaultStyles,
    ...(props.styles || {}),
  };

  return (
    <div className="relative">
      <ReactSelect
        {...props}
        styles={combinedStyles}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        onChange={(val, actionMeta) => {
          props.onChange?.(val, actionMeta);
        }}
        placeholder=""
      />
      <Label
        className={`absolute left-3 bg-background px-2 font-medium z-10 pointer-events-none transition-all duration-200 ${
          isFloated ? "-top-[10px] text-sm" : "top-[16px] text-[14px]"
        } ${isFocused ? "text-primary" : "text-muted-foreground"}`}
      >
        {label}
      </Label>
    </div>
  );
};
