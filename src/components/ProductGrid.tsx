"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { getApprovedProducts } from "@/lib/products";
import { Product } from "@/types";

interface ProductGridProps {
  category: string | null;
  limit?: number;
}

const ProductGrid = ({ category, limit = 12 }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getApprovedProducts(
          null,
          limit,
          category || undefined
        );
        if (result.success) {
          setProducts(result.products || []);
        } else {
          setError("Бүтээгдэхүүн ачаалахад алдаа гарлаа");
        }
      } catch (err) {
        setError("Бүтээгдэхүүн ачаалахад алдаа гарлаа");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(limit)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="bg-gray-300 w-full h-48 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded-md w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Дахин оролдох
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Одоогоор бүтээгдэхүүн байхгүй байна.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <Link href={`/products/${product.id}`}>
            <div className="relative h-48 w-full">
              <Image
                src={product.images[0] || "/images/placeholder.jpg"}
                alt={product.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 text-gray-900">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{product.herderName}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  {product.price.toLocaleString()}₮
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    / {product.unit}
                  </span>
                </span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                  <FaShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
