"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import { createOrder } from "@/lib/orders";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading) {
      if (!currentUser) {
        router.push("/login?redirect=/checkout");
        return;
      }

      if (items.length === 0) {
        router.push("/cart");
        return;
      }

      // Хэрэглэгчийн нэр автоматаар бөглөх
      setFormData((prev) => ({
        ...prev,
        name: currentUser?.name || "",
        phone: currentUser?.phoneNumber || "",
      }));
    }
  }, [currentUser, items.length, router, loading, isClient]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!currentUser) {
        throw new Error("Та нэвтрээгүй байна");
      }

      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        title: item.product.title,
      }));

      const orderData = {
        customerId: currentUser.id,
        customerName: formData.name,
        products: orderItems,
        totalAmount: totalPrice,
        contactPhone: formData.phone,
        deliveryAddress: formData.address,
        notes: formData.notes,
      };

      const result = await createOrder(orderData);

      if (result.success) {
        clearCart();
        router.push(`/profile/orders/${result.orderId}`);
      } else {
        setError(result.error || "Захиалга үүсгэхэд алдаа гарлаа");
      }
    } catch (err) {
      setError("Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient || loading || !currentUser || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">Ачаалж байна...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Захиалга баталгаажуулах</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Захиалгын мэдээлэл */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Хүргэлтийн мэдээлэл</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Нэр
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Утасны дугаар
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Хүргэлтийн хаяг
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Нэмэлт тэмдэглэл
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium"
                >
                  {isSubmitting
                    ? "Боловсруулж байна..."
                    : "Захиалга баталгаажуулах"}
                </button>

                <Link
                  href="/cart"
                  className="w-full block text-center border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium"
                >
                  Сагс руу буцах
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Захиалгын дүн */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Захиалгын бүтээгдэхүүн</h2>

            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.product.id} className="py-4 flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
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
                    <h3 className="text-sm font-medium">
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {item.product.price.toLocaleString()}₮
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-sm font-medium">
                      {(item.product.price * item.quantity).toLocaleString()}₮
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Дүн</span>
                <span>{totalPrice.toLocaleString()}₮</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Хүргэлт</span>
                <span>Үнэгүй</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Нийт дүн</span>
                <span>{totalPrice.toLocaleString()}₮</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
