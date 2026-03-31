import ProductDetailWrapper from "@/features/products/product-detail-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Detail",
};

interface PageProps {
  params: Promise<{ id: string; acno: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id, acno } = await params;

  return (
    <>
      <ProductDetailWrapper productId={Number(id)} acno={acno} />
    </>
  );
};

export default page;
