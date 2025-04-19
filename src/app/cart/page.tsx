"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaSignInAlt,
} from "react-icons/fa";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = () => {
    if (!currentUser) {
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Таны сагс</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-center">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Таны сагс</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl mb-6">Таны сагс хоосон байна</p>
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Бүтээгдэхүүн үзэх
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Таны сагс</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.product.id} className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-md overflow-hidden">
                        <Image
                          src={
                            item.product.images[0] || "/images/placeholder.jpg"
                          }
                          alt={item.product.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>

                    <div className="flex-grow">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-gray-500 text-sm">
                        Малчин: {item.product.herderName}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.product.unit}
                      </p>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Бууруулах"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Нэмэх"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Хасах"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-lg font-medium text-gray-900">
                        {(item.product.price * item.quantity).toLocaleString()}₮
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.product.price.toLocaleString()}₮ /{" "}
                        {item.product.unit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                  <FaTrash className="mr-1" />
                  Сагс хоослох
                </button>

                <Link
                  href="/products"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FaArrowLeft className="mr-1" />
                  Бүтээгдэхүүн үзэх
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-4">Захиалгын дүн</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Дүн</span>
                <span>{totalPrice.toLocaleString()}₮</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Хүргэлт</span>
                <span>Үнэгүй</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-medium">
                  <span>Нийт дүн</span>
                  <span>{totalPrice.toLocaleString()}₮</span>
                </div>
              </div>
            </div>

            {currentUser ? (
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium"
                disabled={isProcessing}
              >
                {isProcessing ? "Боловсруулж байна..." : "Захиалах"}
              </button>
            ) : (
              <div>
                <button
                  onClick={() => router.push("/login?redirect=/checkout")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
                >
                  <FaSignInAlt className="mr-2" />
                  Нэвтрэх
                </button>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Захиалга өгөхийн тулд та нэвтрэх шаардлагатай
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
