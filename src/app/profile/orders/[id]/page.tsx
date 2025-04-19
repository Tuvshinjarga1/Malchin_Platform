"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getOrderById } from "@/lib/orders";
import { Order } from "@/types";
import { FaArrowLeft, FaShoppingBag } from "react-icons/fa";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login?redirect=/profile");
      return;
    }

    if (currentUser && id) {
      fetchOrder();
    }
  }, [currentUser, loading, id, router]);

  const fetchOrder = async () => {
    if (!id) return;

    setLoadingOrder(true);
    try {
      const orderData = await getOrderById(id as string);
      if (orderData) {
        // Проверяем, принадлежит ли заказ текущему пользователю
        if (currentUser && orderData.customerId === currentUser.id) {
          setOrder(orderData);
        } else {
          setError("Танд энэ захиалгыг харах эрх байхгүй байна");
          setTimeout(() => {
            router.push("/profile");
          }, 3000);
        }
      } else {
        setError("Захиалга олдсонгүй");
      }
    } catch (err) {
      setError("Захиалгын мэдээлэл ачаалахад алдаа гарлаа");
      console.error(err);
    } finally {
      setLoadingOrder(false);
    }
  };

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

  if (loading || loadingOrder) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Ачаалж байна...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Захиалга олдсонгүй</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <Link
        href="/profile"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <FaArrowLeft className="mr-2" />
        Профайл руу буцах
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Захиалга #{order.id.substring(0, 8)}
            </h1>
            <p className="text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("mn-MN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`mt-2 md:mt-0 inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusText(order.status)}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium mb-4">Захиалгын бүтээгдэхүүн</h2>
          <div className="divide-y divide-gray-200">
            {order.products.map((item) => (
              <div key={item.productId} className="py-4 flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-gray-200 w-16 h-16 rounded-md flex items-center justify-center">
                    <FaShoppingBag className="text-gray-400" size={24} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-md font-medium">{item.title}</h3>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">
                      {item.quantity} x {item.price.toLocaleString()}₮
                    </p>
                    <p className="font-medium">
                      {(item.price * item.quantity).toLocaleString()}₮
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-lg font-medium mb-4">Хүргэлтийн мэдээлэл</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Хүлээн авагч</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Утасны дугаар</p>
              <p className="font-medium">{order.contactPhone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Хүргэлтийн хаяг</p>
              <p className="font-medium">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-lg font-medium mb-4">Төлбөрийн мэдээлэл</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Дүн</span>
              <span>{order.totalAmount.toLocaleString()}₮</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Хүргэлт</span>
              <span>Үнэгүй</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">Нийт дүн</span>
              <span className="font-bold text-lg">
                {order.totalAmount.toLocaleString()}₮
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
