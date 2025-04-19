"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getCustomerOrders } from "@/lib/orders";
import { Order } from "@/types";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const { items } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Клиент-талын рендер
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Хэрэглэгч нэвтрээгүй бол login хуудас руу чиглүүлнэ
  useEffect(() => {
    if (isClient && !loading && !currentUser) {
      router.push("/login?redirect=/profile");
    } else if (isClient && currentUser) {
      fetchOrders();
    }
  }, [currentUser, loading, router, isClient]);

  // Захиалгуудыг авах функц
  const fetchOrders = async () => {
    if (!currentUser) return;

    setLoadingOrders(true);
    try {
      const customerOrders = await getCustomerOrders(currentUser.id);
      setOrders(customerOrders);
    } catch (error) {
      console.error("Захиалга авахад алдаа гарлаа:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Гарахад алдаа гарлаа:", error);
    }
  };

  if (!isClient || loading || !currentUser) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Ачаалж байна...</div>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Хүлээгдэж байна";
      case "confirmed":
        return "Баталгаажсан";
      case "shipped":
        return "Хүргэлтэнд гарсан";
      case "delivered":
        return "Хүргэгдсэн";
      case "cancelled":
        return "Цуцлагдсан";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Миний хэсэг</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mx-auto mb-4">
                <FaUser size={40} />
              </div>
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <p className="text-gray-500">
                {currentUser.role === "customer" ? "Хэрэглэгч" : "Малчин"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <FaEnvelope className="text-gray-500 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">И-мэйл хаяг</p>
                  <p>{currentUser.email}</p>
                </div>
              </div>
              {currentUser.phoneNumber && (
                <div className="flex items-start">
                  <FaPhone className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Утасны дугаар</p>
                    <p>{currentUser.phoneNumber}</p>
                  </div>
                </div>
              )}
              {currentUser.location && (
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Байршил</p>
                    <p>{currentUser.location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              <Link
                href="/profile/edit"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaEdit className="mr-2" />
                Мэдээлэл засах
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <FaSignOutAlt className="mr-2" />
                Гарах
              </button>
            </div>
          </div>

          {/* Сагсны мэдээлэл */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Таны сагс</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {items.length} бүтээгдэхүүн
              </span>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-500 text-sm">Таны сагс хоосон байна</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  Нийт дүн:{" "}
                  {items
                    .reduce(
                      (sum, item) => sum + item.product.price * item.quantity,
                      0
                    )
                    .toLocaleString()}
                  ₮
                </p>
                <Link
                  href="/cart"
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md block text-sm"
                >
                  Сагс руу очих
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Миний захиалгууд</h2>
              <Link
                href="/cart"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <FaShoppingBag className="mr-2" />
                Сагс руу очих
              </Link>
            </div>

            {loadingOrders ? (
              <div className="text-center py-8">Захиалга ачаалж байна...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Танд одоогоор захиалга байхгүй байна
                </p>
                <Link
                  href="/products"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Бүтээгдэхүүн үзэх
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="py-6">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <Link
                          href={`/profile/orders/${order.id}`}
                          className="text-lg font-medium text-blue-600 hover:text-blue-800"
                        >
                          Захиалга #{order.id}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "mn-MN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="md:text-right mt-2 md:mt-0">
                        <span
                          className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                        <p className="font-bold mt-2">
                          {order.totalAmount.toLocaleString()}₮
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600 mb-1">
                        Бүтээгдэхүүн: {order.products.length} төрөл
                      </p>
                      <p className="text-gray-600">
                        Хүргэлтийн хаяг: {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
