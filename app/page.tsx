import HomeWrapper from "@/features/marketplace/home-wrapper";
import { Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketplace | Bazarify",
};

export default function Home() {
  return <HomeWrapper />;
}
