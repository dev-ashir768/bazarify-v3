import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import { sora } from "./fonts";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: {
    default: "Bazarify by Orio",
    template: "%s | Bazarify by Orio",
  },
  description: "Bazarify is a marketplace for everything",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", sora.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col justify-between">
        <Providers>
          <NextTopLoader color="var(--primary)" showSpinner={false} />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
