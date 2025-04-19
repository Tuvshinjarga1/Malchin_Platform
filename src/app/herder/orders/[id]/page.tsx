"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getOrderById, updateOrderStatus } from "@/lib/orders";
import { getProduct } from "@/lib/products";
import { Order, Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaTruck, FaCheck, FaTimes } from "react-icons/fa";

export default function OrderDetails() {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<(Product | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Хэрэглэгчийн эрхийг шалгах
  useEffect(() => {
    if (!loading) {
      if (!currentUser || userRole !== "herder") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router, userRole]);

  // Захиалгын мэдээллийг ачаалах
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !currentUser) return;

      setIsLoading(true);
      try {
        const orderData = await getOrderById(orderId);

        if (!orderData) {
          setError("Захиалга олдсонгүй");
          setIsLoading(false);
          return;
        }

        // Малчны захиалга мөн эсэхийг шалгах
        if (orderData.herderId !== currentUser.id) {
          setError("Энэ захиалгыг харах эрх танд байхгүй байна");
          setIsLoading(false);
          return;
        }

        setOrder(orderData);

        // Бүтээгдэхүүний дэлгэрэнгүй мэдээллийг ачаалах
        if (orderData.products && orderData.products.length > 0) {
          const productPromises = orderData.products.map(async (item) => {
            try {
              return await getProduct(item.productId);
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
              return null;
            }
          });

          const productDetails = await Promise.all(productPromises);
          setProducts(productDetails);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Захиалгын мэдээлэл ачаалахад алдаа гарлаа");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, currentUser]);

  // Захиалгын төлөвийг өөрчлөх
  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!order || !orderId) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const result = await updateOrderStatus(orderId, newStatus);

      if (result.success) {
        setOrder({ ...order, status: newStatus });
        setStatusMessage({
          type: "success",
          text: "Захиалгын төлөв амжилттай шинэчлэгдлээ",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: result.error || "Төлөв шинэчлэхэд алдаа гарлаа",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setStatusMessage({
        type: "error",
        text: "Төлөв шинэчлэхэд алдаа гарлаа",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (loading || (!currentUser && !error)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/herder/orders"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Захиалгууд руу буцах
      </Link>

      <h1 className="text-2xl font-bold mb-6">
        Захиалгын дэлгэрэнгүй #{orderId ? orderId.substring(0, 8) : ""}
      </h1>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : order ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Захиалгын мэдээлэл */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Захиалгын мэдээлэл</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Захиалгын дугаар</p>
                  <p className="font-medium">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Огноо</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("mn-MN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Нийт дүн</p>
                  <p className="font-medium text-lg text-green-600">
                    {order.totalAmount?.toLocaleString() || 0}₮
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Бүтээгдэхүүний тоо
                  </p>
                  <p className="font-medium">
                    {order.products?.length || 0} төрөл
                  </p>
                </div>
              </div>

              {/* Статус өөрчлөх хэсэг */}
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-md font-medium mb-3">
                    Захиалгын төлөв шинэчлэх
                  </h3>

                  {statusMessage && (
                    <div
                      className={`mb-4 px-4 py-2 rounded-md text-sm ${
                        statusMessage.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {statusMessage.text}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange("confirmed")}
                          disabled={isSubmitting}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                        >
                          <FaCheck className="mr-2" />
                          Баталгаажуулах
                        </button>
                        <button
                          onClick={() => handleStatusChange("cancelled")}
                          disabled={isSubmitting}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                        >
                          <FaTimes className="mr-2" />
                          Цуцлах
                        </button>
                      </>
                    )}

                    {order.status === "confirmed" && (
                      <button
                        onClick={() => handleStatusChange("shipped")}
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                      >
                        <FaTruck className="mr-2" />
                        Хүргэлтэд гаргах
                      </button>
                    )}

                    {order.status === "shipped" && (
                      <button
                        onClick={() => handleStatusChange("delivered")}
                        disabled={isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                      >
                        <FaCheck className="mr-2" />
                        Хүргэгдсэн
                      </button>
                    )}

                    {isSubmitting && (
                      <span className="ml-3 text-sm text-gray-500">
                        Боловсруулж байна...
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Бүтээгдэхүүний жагсаалт */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Захиалсан бүтээгдэхүүн
              </h2>

              <div className="divide-y divide-gray-200">
                {order.products?.map((item, index) => {
                  const productDetails = products[index];

                  return (
                    <div
                      key={item.productId}
                      className="py-4 flex items-center"
                    >
                      <div className="flex-shrink-0 mr-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                          {productDetails?.images?.[0] ? (
                            <Image
                              src={productDetails.images[0]}
                              alt={item.title}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Зураггүй
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-md font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {item.price.toLocaleString()}₮
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">
                          {(item.quantity * item.price).toLocaleString()}₮
                        </p>

                        {productDetails ? (
                          <Link
                            href={`/herder/products/${item.productId}`}
                            className="text-sm text-blue-600 hover:text-blue-900"
                          >
                            Бүтээгдэхүүн харах
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Нийт дүн:</span>
                  <span className="font-bold text-lg">
                    {order.totalAmount?.toLocaleString() || 0}₮
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Хэрэглэгчийн мэдээлэл */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Хүргэлтийн мэдээлэл
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Хэрэглэгчийн нэр</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>

                {order.contactPhone && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Утасны дугаар</p>
                    <p className="font-medium">{order.contactPhone}</p>
                  </div>
                )}

                {order.deliveryAddress && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Хүргэлтийн хаяг
                    </p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                )}

                {order.notes && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Нэмэлт тэмдэглэл
                    </p>
                    <p>{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
