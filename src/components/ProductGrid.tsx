"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { getApprovedProducts } from "@/lib/products";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductGridProps {
  category: string | null;
  limit?: number;
  subcategory?: string | null;
  searchTerm?: string;
}

const ProductGrid = ({
  category,
  limit = 12,
  subcategory = null,
  searchTerm = "",
}: ProductGridProps) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedProducts, setAddedProducts] = useState<Record<string, boolean>>(
    {}
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getApprovedProducts(
          null,
          limit,
          category || undefined,
          subcategory || undefined,
          searchTerm || undefined
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

    if (isClient) {
      fetchProducts();
    }
  }, [category, limit, subcategory, searchTerm, isClient]);

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    console.log(
      "ProductGrid handleAddToCart called for product:",
      product.title
    );
    try {
      addToCart(product, 1);
      console.log("Added product to cart successfully");

      // Анимэйшн харуулах
      setAddedProducts((prev) => ({ ...prev, [product.id]: true }));

      // 1.5 секундын дараа анимэйшн буцаах
      setTimeout(() => {
        setAddedProducts((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);
    } catch (err) {
      console.error("Error when adding product to cart:", err);
    }
  };

  if (!isClient) {
    return <div className="text-center py-12">Ачааллаж байна...</div>;
  }

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
              </div>
            </div>
          </Link>
          <div className="px-4 pb-4">
            <button
              onClick={(e) => handleAddToCart(product, e)}
              className={`w-full p-2 rounded-md flex items-center justify-center transition-colors ${
                addedProducts[product.id]
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {addedProducts[product.id] ? (
                <>
                  <FaCheck className="h-4 w-4 mr-2" />
                  Нэмэгдлээ
                </>
              ) : (
                <>
                  <FaShoppingCart className="h-4 w-4 mr-2" />
                  Сагсанд нэмэх
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
