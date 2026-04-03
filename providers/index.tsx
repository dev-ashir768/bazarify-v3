import React from "react";
import { ThemeProvider } from "./theme-provider";
import QueryProvider from "./query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
    // attribute="class"
    // defaultTheme="system"
    // enableSystem
    // disableTransitionOnChange
    >
      <TooltipProvider>
        <QueryProvider>
          {children}
          <Toaster richColors closeButton position="bottom-right" />
        </QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default Providers;
