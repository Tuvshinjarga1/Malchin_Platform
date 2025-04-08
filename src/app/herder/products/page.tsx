"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { FaPlus, FaPencilAlt, FaTrash, FaFilter } from "react-icons/fa";
import { getHerderProducts, updateProduct } from "@/lib/products";
import { Product } from "@/types";

export default function HerderProducts() {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "meat" | "dairy"
  >("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // URL параметрээс статус филтерийг авах
  useEffect(() => {
    const status = searchParams.get("status");
    if (
      status === "pending" ||
      status === "approved" ||
      status === "rejected"
    ) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  // Хэрэглэгчийн мэдээлэл ачаалагдахыг хүлээх
  useEffect(() => {
    if (!loading) {
      // Хэрэглэгч нэвтрээгүй эсвэл малчин биш бол нэвтрэх хуудас руу шилжүүлэх
      if (!currentUser || userRole !== "herder") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router, userRole]);

  // Бүтээгдэхүүний мэдээлэл ачаалах
  useEffect(() => {
    const fetchProducts = async () => {
      if (currentUser && userRole === "herder") {
        setDataLoading(true);
        try {
          const result = await getHerderProducts(currentUser.id);
          if (result.success) {
            setProducts(result.products);
          }
        } catch (error) {
          console.error("Error fetching herder products:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchProducts();
  }, [currentUser, userRole]);

  // Филтер хийх
  useEffect(() => {
    let filtered = [...products];

    // Статусаар филтерлэх
    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    // Категориор филтерлэх
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    setFilteredProducts(filtered);
  }, [products, statusFilter, categoryFilter]);

  if (loading || !currentUser || userRole !== "herder") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Миний бүтээгдэхүүнүүд</h1>
        <Link
          href="/herder/products/new"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Шинэ бүтээгдэхүүн нэмэх
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Шүүлтүүр</h2>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <FaFilter />
          </button>
        </div>

        <div className={`mt-4 ${isFilterOpen ? "block" : "hidden md:block"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Төлөв
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Бүгд</option>
                <option value="pending">Хүлээгдэж буй</option>
                <option value="approved">Зөвшөөрөгдсөн</option>
                <option value="rejected">Цуцлагдсан</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ангилал
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Бүгд</option>
                <option value="meat">Мах</option>
                <option value="dairy">Цагаан идээ</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      {dataLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={product.images[0] || "/images/placeholder.jpg"}
                  alt={product.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div
                  className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full text-white
                  ${product.status === "pending" ? "bg-yellow-500" : ""}
                  ${product.status === "approved" ? "bg-green-500" : ""}
                  ${product.status === "rejected" ? "bg-red-500" : ""}
                `}
                >
                  {product.status === "pending" && "Хүлээгдэж байна"}
                  {product.status === "approved" && "Зөвшөөрөгдсөн"}
                  {product.status === "rejected" && "Цуцлагдсан"}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {product.category === "meat" ? "Мах" : "Цагаан идээ"} -{" "}
                  {product.subCategory}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-green-600">
                    {product.price.toLocaleString()}₮
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      / {product.unit}
                    </span>
                  </span>
                  <span className="text-sm text-gray-500">
                    Үлдэгдэл: {product.quantity}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/herder/products/${product.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded"
                  >
                    Дэлгэрэнгүй
                  </Link>
                  <Link
                    href={`/herder/products/edit/${product.id}`}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded"
                  >
                    <FaPencilAlt />
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm("Бүтээгдэхүүнийг устгах уу?")) {
                        // TO DO: Delete functionality
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Бүтээгдэхүүн олдсонгүй</h3>
          <p className="text-gray-600 mb-6">
            {statusFilter !== "all" || categoryFilter !== "all"
              ? "Шүүлтүүртэй тохирох бүтээгдэхүүн олдсонгүй."
              : "Та одоогоор бүтээгдэхүүн нэмээгүй байна. Шинэ бүтээгдэхүүн нэмнэ үү."}
          </p>
          {statusFilter !== "all" || categoryFilter !== "all" ? (
            <button
              onClick={() => {
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Бүх шүүлтүүрийг арилгах
            </button>
          ) : (
            <Link
              href="/herder/products/new"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Шинэ бүтээгдэхүүн нэмэх
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
