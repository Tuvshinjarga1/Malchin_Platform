"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaFilter } from "react-icons/fa";
import {
  getAllProducts,
  updateProductStatus,
  deleteProduct,
} from "@/lib/products";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Хэрэглэгчийн мэдээлэл ачаалагдахыг хүлээх
  useEffect(() => {
    if (!loading) {
      // Хэрэглэгч нэвтрээгүй эсвэл админ биш бол нэвтрэх хуудас руу шилжүүлэх
      if (!currentUser || userRole !== "admin") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router, userRole]);

  // Бүх бүтээгдэхүүнийг авах
  useEffect(() => {
    const fetchProducts = async () => {
      if (currentUser && userRole === "admin") {
        setDataLoading(true);
        try {
          const result = await getAllProducts();
          if (result.success && result.products) {
            setProducts(result.products);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchProducts();
  }, [currentUser, userRole]);

  // Бүтээгдэхүүнийг зөвшөөрөх
  const handleApprove = async (productId: string) => {
    try {
      await updateProductStatus(productId, "approved");
      setProducts(
        products.map((product) =>
          product.id === productId
            ? { ...product, status: "approved" }
            : product
        )
      );
    } catch (error) {
      console.error("Error approving product:", error);
    }
  };

  // Бүтээгдэхүүнийг цуцлах
  const handleReject = async (productId: string) => {
    try {
      await updateProductStatus(productId, "rejected");
      setProducts(
        products.map((product) =>
          product.id === productId
            ? { ...product, status: "rejected" }
            : product
        )
      );
    } catch (error) {
      console.error("Error rejecting product:", error);
    }
  };

  // Бүтээгдэхүүнийг устгах
  const handleDelete = async (productId: string) => {
    if (window.confirm("Та энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?")) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Шүүлтүүрээр шүүх
  const filteredProducts = products.filter((product) => {
    // Төлөв шүүлтүүр
    if (statusFilter !== "all" && product.status !== statusFilter) {
      return false;
    }
    // Ангилал шүүлтүүр
    if (categoryFilter !== "all" && product.category !== categoryFilter) {
      return false;
    }
    return true;
  });

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
        <h1 className="text-3xl font-bold">Бүтээгдэхүүний удирдлага</h1>
        <Link
          href="/admin/dashboard"
          className="text-purple-600 hover:underline"
        >
          &larr; Хянах самбар руу буцах
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center">
            <FaFilter className="text-gray-500 mr-2" />
            <span className="text-gray-700">Шүүлтүүр:</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Бүх төлөв</option>
              <option value="pending">Хүлээгдэж буй</option>
              <option value="approved">Зөвшөөрөгдсөн</option>
              <option value="rejected">Цуцлагдсан</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Бүх ангилал</option>
              <option value="meat">Мах</option>
              <option value="dairy">Цагаан идээ</option>
            </select>
          </div>
        </div>
      </div>

      {dataLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Зураг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Нэр
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ангилал
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Малчин
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үнэ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төлөв
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image
                        src={product.images[0] || "/images/placeholder.jpg"}
                        alt={product.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product.category === "meat" ? "Мах" : "Цагаан идээ"} -{" "}
                      {product.subCategory}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product.herderName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product.price.toLocaleString()}₮ / {product.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : product.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.status === "approved"
                        ? "Зөвшөөрөгдсөн"
                        : product.status === "rejected"
                        ? "Цуцлагдсан"
                        : "Хүлээгдэж буй"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {product.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(product.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Зөвшөөрөх"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleReject(product.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Цуцлах"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {/* <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Засах"
                      >
                        <FaEdit />
                      </Link> */}
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Устгах"
                      >
                        <FaTrash />
                      </button>
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
            {categoryFilter !== "all" || statusFilter !== "all"
              ? "Шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй"
              : "Бүтээгдэхүүн олдсонгүй"}
          </p>
          {(categoryFilter !== "all" || statusFilter !== "all") && (
            <button
              onClick={() => {
                setCategoryFilter("all");
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
