import HomeWrapper from "@/features/marketplace/home-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace | Bazarify by Orio",
};

export default function Home() {
  return (
    <>
      <HomeWrapper />
    </>
  );
}
