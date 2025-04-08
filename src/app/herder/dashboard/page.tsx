"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaBox, FaList, FaClipboardList, FaUser } from "react-icons/fa";
import { getHerderProducts } from "@/lib/products";
import { getHerderOrders } from "@/lib/orders";
import { Product, Order } from "@/types";
import Link from "next/link";

export default function HerderDashboard() {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Хэрэглэгчийн мэдээлэл ачаалагдахыг хүлээх
  useEffect(() => {
    if (!loading) {
      // Хэрэглэгч нэвтрээгүй эсвэл малчин биш бол нэвтрэх хуудас руу шилжүүлэх
      if (!currentUser || userRole !== "herder") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router, userRole]);

  // Малчны мэдээлэл ачаалах
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && userRole === "herder") {
        setDataLoading(true);
        try {
          // Бүх бүтээгдэхүүнийг авах
          const productsResult = await getHerderProducts(currentUser.id);
          if (productsResult.success) {
            setProducts(productsResult.products);
          }

          // Захиалгуудыг авах
          const ordersResult = await getHerderOrders(currentUser.id);
          if (ordersResult.success) {
            setOrders(ordersResult.orders);
          }
        } catch (error) {
          console.error("Error fetching herder data:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchData();
  }, [currentUser, userRole]);

  // Хүлээж байгаа хүсэлтүүдийн тоо
  const pendingProducts = products.filter(
    (product) => product.status === "pending"
  ).length;

  // Шинэ захиалгын тоо
  const newOrders = orders.filter((order) => order.status === "pending").length;

  // Баталгаажсан захиалгын тоо
  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed"
  ).length;

  if (loading || !currentUser || userRole !== "herder") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Малчны хянах самбар</h1>

      {/* Welcome message */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Сайн байна уу, {currentUser.name}!
        </h2>
        <p className="text-gray-600">
          Таны хянах самбарт тавтай морил. Энд та өөрийн бүтээгдэхүүн болон
          захиалгуудыг харж, удирдах боломжтой.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Нийт бүтээгдэхүүн</p>
              <h3 className="text-3xl font-bold mt-1">{products.length}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaBox className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Link
            href="/herder/products"
            className="text-sm text-green-600 hover:underline mt-4 inline-block"
          >
            Бүх бүтээгдэхүүнийг харах &rarr;
          </Link>
        </div>

        {/* Pending Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Хүлээгдэж буй</p>
              <h3 className="text-3xl font-bold mt-1">{pendingProducts}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaClipboardList className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <Link
            href="/herder/products?status=pending"
            className="text-sm text-green-600 hover:underline mt-4 inline-block"
          >
            Хүлээгдэж буй бүтээгдэхүүн &rarr;
          </Link>
        </div>

        {/* New Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Шинэ захиалга</p>
              <h3 className="text-3xl font-bold mt-1">{newOrders}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaList className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link
            href="/herder/orders?status=pending"
            className="text-sm text-green-600 hover:underline mt-4 inline-block"
          >
            Шинэ захиалгууд &rarr;
          </Link>
        </div>

        {/* Confirmed Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Баталгаажсан захиалга</p>
              <h3 className="text-3xl font-bold mt-1">{confirmedOrders}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaUser className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <Link
            href="/herder/orders?status=confirmed"
            className="text-sm text-green-600 hover:underline mt-4 inline-block"
          >
            Баталгаажсан захиалгууд &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Түргэн үйлдлүүд</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/herder/products/new"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Шинэ бүтээгдэхүүн нэмэх
          </Link>
          <Link
            href="/herder/orders"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Захиалга шалгах
          </Link>
          <Link
            href="/account"
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Бүртгэл шинэчлэх
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Сүүлийн захиалгууд</h2>
        {dataLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Захиалгын ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Хэрэглэгч
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дүн
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Төлөв
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Огноо
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/herder/orders/${order.id}`}>
                        {order.id.substring(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.totalAmount.toLocaleString()}₮
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                        ${
                          order.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }
                        ${
                          order.status === "delivered"
                            ? "bg-purple-100 text-purple-800"
                            : ""
                        }
                        ${
                          order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : ""
                        }
                        `}
                      >
                        {order.status === "pending" && "Хүлээгдэж байна"}
                        {order.status === "confirmed" && "Баталгаажсан"}
                        {order.status === "shipped" && "Илгээгдсэн"}
                        {order.status === "delivered" && "Хүргэгдсэн"}
                        {order.status === "cancelled" && "Цуцлагдсан"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("mn-MN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  href="/herder/orders"
                  className="text-green-600 hover:underline"
                >
                  Бүх захиалгыг харах &rarr;
                </Link>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Одоогоор захиалга байхгүй байна.
          </p>
        )}
      </div>
    </div>
  );
}
