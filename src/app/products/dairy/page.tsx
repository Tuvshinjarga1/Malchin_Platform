"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DairyCategoryPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/products?category=dairy");
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16">
      <p className="text-center">Дамжуулж байна...</p>
    </div>
  );
}
