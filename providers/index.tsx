import React from "react";
import { ThemeProvider } from "./theme-provider";
import QueryProvider from "./query-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
    // attribute="class"
    // defaultTheme="system"
    // enableSystem
    // disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
};

export default Providers;
