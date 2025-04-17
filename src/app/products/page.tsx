"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { FaSearch } from "react-icons/fa";

const categories = [
  { id: "all", name: "Бүх бүтээгдэхүүн" },
  { id: "meat", name: "Мах" },
  { id: "dairy", name: "Цагаан идээ" },
];

const meatSubcategories = [
  { id: "beef", name: "Үхрийн мах" },
  { id: "mutton", name: "Хонины мах" },
  { id: "goat", name: "Ямааны мах" },
  { id: "horse", name: "Адууны мах" },
];

const dairySubcategories = [
  { id: "milk", name: "Сүү" },
  { id: "yogurt", name: "Тараг" },
  { id: "cheese", name: "Бяслаг" },
  { id: "airag", name: "Айраг" },
  { id: "aaruul", name: "Ааруул" },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSubcategory = searchParams.get("subcategory") || null;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState(initialSubcategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    if (category) {
      setSelectedCategory(category);
    }

    if (subcategory) {
      setSelectedSubcategory(subcategory);
    }
  }, [searchParams]);

  const subcategories =
    selectedCategory === "meat"
      ? meatSubcategories
      : selectedCategory === "dairy"
      ? dairySubcategories
      : [];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Бүтээгдэхүүн</h1>

      <div className="lg:flex items-start gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0 mb-8 lg:mb-0">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Ангилал</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`block w-full text-left px-3 py-2 rounded-md transition ${
                    selectedCategory === category.id
                      ? "bg-green-100 text-green-800"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedSubcategory(null);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {subcategories.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Дэд ангилал</h2>
              <div className="space-y-2">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md transition ${
                    selectedSubcategory === null
                      ? "bg-green-100 text-green-800"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedSubcategory(null)}
                >
                  Бүгд
                </button>
                {subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    className={`block w-full text-left px-3 py-2 rounded-md transition ${
                      selectedSubcategory === subcategory.id
                        ? "bg-green-100 text-green-800"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedSubcategory(subcategory.id)}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">
                {selectedCategory === "all"
                  ? "Бүх бүтээгдэхүүн"
                  : selectedCategory === "meat"
                  ? selectedSubcategory
                    ? meatSubcategories.find(
                        (sc) => sc.id === selectedSubcategory
                      )?.name
                    : "Мах"
                  : selectedSubcategory
                  ? dairySubcategories.find(
                      (sc) => sc.id === selectedSubcategory
                    )?.name
                  : "Цагаан идээ"}
              </h2>

              <button
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Хайх"
              >
                <FaSearch size={20} />
              </button>
            </div>

            {showSearch && (
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Бүтээгдэхүүн хайх..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10"
                  />
                  <FaSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </div>
            )}

            <ProductGrid
              category={selectedCategory === "all" ? null : selectedCategory}
              subcategory={selectedSubcategory}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
