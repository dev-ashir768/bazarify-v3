"use client";

import { RiAlertLine } from "@remixicon/react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load the products. Please try again later.",
  onRetry,
  className = "",
}: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center bg-card/50 backdrop-blur-sm border border-border rounded-3xl ${className}`}
    >
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <RiAlertLine size={32} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-xs">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          size="xl"
          className="w-40 font-medium text-base mt-6"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
