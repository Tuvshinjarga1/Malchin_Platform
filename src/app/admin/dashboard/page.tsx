"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FaBox,
  FaUsers,
  FaShoppingBag,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { getPendingProducts, updateProductStatus } from "@/lib/products";
import { Product } from "@/types";
import Image from "next/image";

export default function AdminDashboard() {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Хэрэглэгчийн мэдээлэл ачаалагдахыг хүлээх
  useEffect(() => {
    if (!loading) {
      // Хэрэглэгч нэвтрээгүй эсвэл админ биш бол нэвтрэх хуудас руу шилжүүлэх
      if (!currentUser || userRole !== "admin") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router, userRole]);

  // Хүлээгдэж буй бүтээгдэхүүнүүдийг авах
  useEffect(() => {
    const fetchPendingProducts = async () => {
      if (currentUser && userRole === "admin") {
        setDataLoading(true);
        try {
          const result = await getPendingProducts();
          if (result.success && result.products) {
            setPendingProducts(result.products);
          }
        } catch (error) {
          console.error("Error fetching pending products:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchPendingProducts();
  }, [currentUser, userRole]);

  // Бүтээгдэхүүнийг зөвшөөрөх
  const handleApprove = async (productId: string) => {
    try {
      await updateProductStatus(productId, "approved");
      setPendingProducts(
        pendingProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error approving product:", error);
    }
  };

  // Бүтээгдэхүүнийг цуцлах
  const handleReject = async (productId: string) => {
    try {
      await updateProductStatus(productId, "rejected");
      setPendingProducts(
        pendingProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error rejecting product:", error);
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
      <h1 className="text-3xl font-bold mb-8">Админ хянах самбар</h1>

      {/* Welcome message */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Сайн байна уу, {currentUser.name}!
        </h2>
        <p className="text-gray-600">
          Админ хянах самбарт тавтай морил. Энд та бүтээгдэхүүн, хэрэглэгчид,
          захиалгуудыг удирдах боломжтой.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pending Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Хүлээгдэж буй бүтээгдэхүүн
              </p>
              <h3 className="text-3xl font-bold mt-1">
                {pendingProducts.length}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaBox className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <Link
            href="/admin/products"
            className="text-sm text-purple-600 hover:underline mt-4 inline-block"
          >
            Бүх бүтээгдэхүүнийг харах &rarr;
          </Link>
        </div>

        {/* Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Нийт хэрэглэгч</p>
              <h3 className="text-3xl font-bold mt-1">0</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link
            href="/admin/users"
            className="text-sm text-purple-600 hover:underline mt-4 inline-block"
          >
            Бүх хэрэглэгчийг харах &rarr;
          </Link>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Нийт захиалга</p>
              <h3 className="text-3xl font-bold mt-1">0</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaShoppingBag className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm text-purple-600 hover:underline mt-4 inline-block"
          >
            Бүх захиалгыг харах &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Түргэн үйлдлүүд</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Бүтээгдэхүүн удирдах
          </Link>
          <Link
            href="/admin/users"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Хэрэглэгч удирдах
          </Link>
          <Link
            href="/admin/orders"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Захиалга удирдах
          </Link>
        </div>
      </div>

      {/* Pending Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">
          Хүлээгдэж буй бүтээгдэхүүн
        </h2>
        {dataLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : pendingProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {pendingProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Image */}
                  <div className="relative h-48 md:h-full">
                    <Image
                      src={product.images[0] || "/images/placeholder.jpg"}
                      alt={product.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 md:col-span-2">
                    <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Малчин:</span>{" "}
                      {product.herderName}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Ангилал:</span>{" "}
                      {product.category === "meat" ? "Мах" : "Цагаан идээ"} -{" "}
                      {product.subCategory}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Үнэ:</span>{" "}
                      {product.price.toLocaleString()}₮ / {product.unit}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Тоо хэмжээ:</span>{" "}
                      {product.quantity} {product.unit}
                    </p>
                    <p className="text-sm text-gray-600 mt-4">
                      {product.description.length > 150
                        ? `${product.description.substring(0, 150)}...`
                        : product.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="p-4 flex flex-col justify-center">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded mb-2"
                    >
                      Дэлгэрэнгүй
                    </Link>
                    <button
                      onClick={() => handleApprove(product.id)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mb-2 flex items-center justify-center"
                    >
                      <FaCheck className="mr-2" /> Зөвшөөрөх
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center"
                    >
                      <FaTimes className="mr-2" /> Цуцлах
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Одоогоор хүлээгдэж буй бүтээгдэхүүн байхгүй байна.
            </p>
          </div>
        )}

        {pendingProducts.length > 0 && (
          <div className="mt-6 text-center">
            <Link
              href="/admin/products?status=pending"
              className="text-purple-600 hover:underline"
            >
              Бүх хүлээгдэж буй бүтээгдэхүүнийг харах &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
