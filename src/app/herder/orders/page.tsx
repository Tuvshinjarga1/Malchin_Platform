"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getHerderOrders } from "@/lib/orders";
import { Order } from "@/types";
import Link from "next/link";
import { FaArrowLeft, FaEye } from "react-icons/fa";

export default function HerderOrders() {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Хэрэглэгчийн мэдээлэл ачаалагдахыг хүлээх
  useEffect(() => {
    if (!loading) {
      // Хэрэглэгч нэвтрээгүй эсвэл малчин биш бол нэвтрэх хуудас руу шилжүүлэх
      if (!currentUser || userRole !== "herder") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router, userRole]);

  // Малчны захиалгуудыг ачаалах
  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser && userRole === "herder") {
        setIsLoading(true);
        try {
          const result = await getHerderOrders(currentUser.id);
          if (result.success) {
            let filteredOrders = result.orders || [];

            // Захиалгын төлөвөөр шүүх хэрэгтэй бол
            if (statusFilter) {
              filteredOrders = filteredOrders.filter(
                (order) => order.status === statusFilter
              );
            }

            setOrders(filteredOrders);
          } else {
            setError("Захиалгууд ачаалахад алдаа гарлаа");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          setError("Захиалгууд ачаалахад алдаа гарлаа");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
  }, [currentUser, userRole, statusFilter]);

  // Захиалгын төлөвийн нэр
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Хүлээгдэж байна";
      case "confirmed":
        return "Баталгаажсан";
      case "shipped":
        return "Илгээгдсэн";
      case "delivered":
        return "Хүргэгдсэн";
      case "cancelled":
        return "Цуцлагдсан";
      default:
        return status;
    }
  };

  // Захиалгын төлөвийн өнгө
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Хуудасны гарчиг
  const getPageTitle = () => {
    if (statusFilter === "pending") return "Хүлээгдэж буй захиалгууд";
    if (statusFilter === "confirmed") return "Баталгаажсан захиалгууд";
    if (statusFilter === "shipped") return "Илгээгдсэн захиалгууд";
    if (statusFilter === "delivered") return "Хүргэгдсэн захиалгууд";
    if (statusFilter === "cancelled") return "Цуцлагдсан захиалгууд";
    return "Бүх захиалгууд";
  };

  if (loading || !currentUser || userRole !== "herder") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/herder/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Хянах самбар руу буцах
          </Link>
          <h1 className="text-2xl font-bold mt-2">{getPageTitle()}</h1>
        </div>

        <div className="flex gap-2">
          <Link
            href="/herder/orders"
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              !statusFilter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Бүгд
          </Link>
          <Link
            href="/herder/orders?status=pending"
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Хүлээгдэж буй
          </Link>
          <Link
            href="/herder/orders?status=confirmed"
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "confirmed"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Баталгаажсан
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Захиалгын ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Хэрэглэгч
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Огноо
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Дүн
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Төлөв
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr
                    key={order.id || `order-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id ? order.id.substring(0, 8) : "N/A"}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("mn-MN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.totalAmount?.toLocaleString() || 0}₮
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        href={`/herder/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <FaEye className="mr-1" />
                        Харах
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Захиалга байхгүй байна</p>
            <Link
              href="/herder/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-900"
            >
              <FaArrowLeft className="mr-2" />
              Хянах самбар руу буцах
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
