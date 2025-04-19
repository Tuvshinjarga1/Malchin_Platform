"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaTimes,
  FaTruck,
} from "react-icons/fa";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  unit: string;
  herderName: string;
  herderId: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  customerName: string;
  userEmail: string;
  userPhone: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: {
    addressLine1: string;
    city: string;
    district: string;
    phone: string;
  };
  createdAt: number;
}

export default function AdminOrdersPage() {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Хэрэглэгчийн мэдээлэл ачаалагдахыг хүлээх
  useEffect(() => {
    if (!loading) {
      // Хэрэглэгч нэвтрээгүй эсвэл админ биш бол нэвтрэх хуудас руу шилжүүлэх
      if (!currentUser || userRole !== "admin") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router, userRole]);

  // Бүх захиалгыг авах
  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser && userRole === "admin") {
        setDataLoading(true);
        try {
          const ordersQuery = query(
            collection(db, "orders"),
            orderBy("createdAt", "desc")
          );
          const querySnapshot = await getDocs(ordersQuery);
          const ordersData: Order[] = [];

          querySnapshot.forEach((doc) => {
            const orderData = doc.data() as Order;
            ordersData.push({
              ...orderData,
              id: doc.id,
            });
          });

          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchOrders();
  }, [currentUser, userRole]);

  // Захиалгын төлөвийг шинэчлэх
  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
      });

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Хайлт ба шүүлтүүрийн хэрэгжүүлэлт
  const filteredOrders = orders.filter((order) => {
    // Хайлтын термээр шүүх
    const searchMatch =
      searchTerm === "" ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userPhone.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Төлвөөр шүүх
    const statusMatch = statusFilter === "all" || order.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Хүлээгдэж буй";
      case "processing":
        return "Боловсруулж буй";
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

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
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

  if (loading || !currentUser || userRole !== "admin") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Захиалгын удирдлага</h1>
        <Link
          href="/admin/dashboard"
          className="text-purple-600 hover:underline"
        >
          &larr; Хянах самбар руу буцах
        </Link>
      </div>

      {/* Хайлт ба шүүлтүүр */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Захиалга хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center">
            <FaFilter className="text-gray-500 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Бүх төлөв</option>
              <option value="pending">Хүлээгдэж буй</option>
              <option value="processing">Боловсруулж буй</option>
              <option value="shipped">Илгээгдсэн</option>
              <option value="delivered">Хүргэгдсэн</option>
              <option value="cancelled">Цуцлагдсан</option>
            </select>
          </div>
        </div>
      </div>

      {dataLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Захиалгын ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Хэрэглэгч
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Нийт дүн
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төлөв
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Огноо
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.id.slice(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.userPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {order.totalAmount.toLocaleString()}₮
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items?.length || 0} төрлийн бүтээгдэхүүн
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("mn-MN")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {/* <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Дэлгэрэнгүй"
                      >
                        <FaEye />
                      </Link> */}

                      {order.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, "processing")
                          }
                          className="text-blue-600 hover:text-blue-900"
                          title="Боловсруулах"
                        >
                          <FaCheckCircle />
                        </button>
                      )}

                      {order.status === "processing" && (
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, "shipped")
                          }
                          className="text-purple-600 hover:text-purple-900"
                          title="Илгээх"
                        >
                          <FaTruck />
                        </button>
                      )}

                      {order.status === "shipped" && (
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, "delivered")
                          }
                          className="text-green-600 hover:text-green-900"
                          title="Хүргэгдсэн"
                        >
                          <FaCheckCircle />
                        </button>
                      )}

                      {(order.status === "pending" ||
                        order.status === "processing") && (
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, "cancelled")
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Цуцлах"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Шүүлтүүрт тохирох захиалга олдсонгүй"
              : "Захиалга олдсонгүй"}
          </p>
          {(searchTerm || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="text-purple-600 hover:underline"
            >
              Шүүлтүүрийг арилгах
            </button>
          )}
        </div>
      )}
    </div>
  );
}
