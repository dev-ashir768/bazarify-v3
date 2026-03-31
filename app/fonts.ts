import { Sora } from "next/font/google";

export const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  preload: true,
  style: ["normal"],
});
