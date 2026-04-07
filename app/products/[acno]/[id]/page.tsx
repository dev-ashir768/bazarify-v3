import ProductDetailWrapper from "@/features/products/product-detail-wrapper";

interface PageProps {
  params: Promise<{ id: string; acno: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id, acno } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_GET_ORIO}/api/marketplace/productdetail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MARKETPLACE_AUTHORIZATION_TOKEN}`,
        },
        body: JSON.stringify({
          acno,
          product_id: Number(id),
        }),
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) throw new Error();

    const data = await response.json();

    return {
      title: data?.payload?.product_name || "Product Detail",
      description:
        data?.payload?.description || "Product description goes here",
    };
  } catch (error) {
    console.log(error)
    return {
      title: "Product Detail",
    };
  }
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