"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaArrowLeft, FaUpload, FaTimes } from "react-icons/fa";
import { addProduct } from "@/lib/products";
import Link from "next/link";

// Мал, мах төрлүүд
const meatTypes = [
  "Хонины мах",
  "Үхрийн мах",
  "Ямааны мах",
  "Адууны мах",
  "Тэмээний мах",
  "Гахайн мах",
  "Шувууны мах",
  "Бусад",
];

// Сүү, цагаан идээ төрлүүд
const dairyTypes = [
  "Шинэ сүү",
  "Зөөхий",
  "Тараг",
  "Айраг",
  "Ааруул",
  "Бяслаг",
  "Ээзгий",
  "Цөцгий",
  "Хурууд",
  "Шар тос",
  "Бусад",
];

// Хэмжих нэгжүүд
const units = ["кг", "гр", "л", "мл", "ш"];

export default function NewProduct() {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Бүтээгдэхүүний мэдээлэл
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    category: "meat",
    subCategory: meatTypes[0],
    unit: "кг",
  });

  // Зураг
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Хэрэглэгчийн мэдээлэл ачаалагдахыг хүлээх
  useEffect(() => {
    if (!loading) {
      // Хэрэглэгч нэвтрээгүй эсвэл малчин биш бол нэвтрэх хуудас руу шилжүүлэх
      if (!currentUser || userRole !== "herder") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router, userRole]);

  // Категори сонгосон үед дэд категорийг шинэчлэх
  useEffect(() => {
    if (formData.category === "meat") {
      setFormData((prev) => ({ ...prev, subCategory: meatTypes[0] }));
    } else {
      setFormData((prev) => ({ ...prev, subCategory: dairyTypes[0] }));
    }
  }, [formData.category]);

  // Форм өгөгдөл өөрчлөгдөх
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "quantity") {
      // Зөвхөн тоо оруулах
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Зураг оруулах
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Хамгийн ихдээ 5 зураг
      if (imageFiles.length + files.length > 5) {
        setError("Хамгийн ихдээ 5 зураг оруулах боломжтой");
        return;
      }

      setImageFiles((prev) => [...prev, ...files]);

      // Preview URLs үүсгэх
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  // Зураг хасах
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    // Preview URL-ийг устгах
    const urlToRemove = previewUrls[index];
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(urlToRemove);
  };

  // Форм илгээх
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (imageFiles.length === 0) {
      setError("Доод тал нь 1 зураг оруулна уу");
      return;
    }

    setIsSubmitting(true);

    try {
      // Бүтээгдэхүүний мэдээлэл бэлтгэх
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category as "meat" | "dairy",
        subCategory: formData.subCategory,
        unit: formData.unit,
        herderId: currentUser!.id,
        herderName: currentUser!.name,
        images: [],
      };

      // Бүтээгдэхүүн нэмэх
      const result = await addProduct(productData, imageFiles);

      if (result.success) {
        setSuccess(true);
        // Формыг хоослох
        setFormData({
          title: "",
          description: "",
          price: "",
          quantity: "",
          category: "meat",
          subCategory: meatTypes[0],
          unit: "кг",
        });
        setImageFiles([]);
        setPreviewUrls([]);

        // 3 секундын дараа жагсаалт руу буцах
        setTimeout(() => {
          router.push("/herder/products");
        }, 3000);
      } else {
        setError(result.error || "Бүтээгдэхүүн нэмэхэд алдаа гарлаа");
      }
    } catch (err: any) {
      setError(err.message || "Бүтээгдэхүүн нэмэхэд алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !currentUser || userRole !== "herder") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link
          href="/herder/products"
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">Шинэ бүтээгдэхүүн нэмэх</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Бүтээгдэхүүн амжилттай нэмэгдлээ! Таны бүтээгдэхүүнийг админ шалгасны
          дараа нэмэгдэх болно.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        {/* Категори сонголт */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Бүтээгдэхүүний төрөл
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`
              border rounded-md p-4 flex items-center cursor-pointer
              ${
                formData.category === "meat"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }
            `}
            >
              <input
                type="radio"
                name="category"
                value="meat"
                checked={formData.category === "meat"}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Мах</span>
            </label>
            <label
              className={`
              border rounded-md p-4 flex items-center cursor-pointer
              ${
                formData.category === "dairy"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }
            `}
            >
              <input
                type="radio"
                name="category"
                value="dairy"
                checked={formData.category === "dairy"}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Сүү, цагаан идээ</span>
            </label>
          </div>
        </div>

        {/* Нэр */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Бүтээгдэхүүний нэр <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Жишээ: Шинэ хонины мах"
          />
        </div>

        {/* Дэд төрөл */}
        <div className="mb-6">
          <label
            htmlFor="subCategory"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Дэд төрөл <span className="text-red-500">*</span>
          </label>
          <select
            id="subCategory"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {formData.category === "meat"
              ? meatTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))
              : dairyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
          </select>
        </div>

        {/* Тайлбар */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Тайлбар <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Бүтээгдэхүүний талаар дэлгэрэнгүй мэдээлэл оруулна уу"
          ></textarea>
        </div>

        {/* Үнэ ба хэмжээ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Үнэ (₮) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Жишээ: 15000"
            />
          </div>
          <div>
            <label
              htmlFor="unit"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Хэмжих нэгж <span className="text-red-500">*</span>
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Нийт хэмжээ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Жишээ: 50"
            />
          </div>
        </div>

        {/* Зураг оруулах */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Зураг <span className="text-red-500">*</span>{" "}
            <span className="text-gray-500">(Хамгийн ихдээ 5 зураг)</span>
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="flex flex-wrap gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {previewUrls.length < 5 && (
                <label
                  htmlFor="images"
                  className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <FaUpload className="text-gray-400" />
                </label>
              )}
            </div>

            {previewUrls.length === 0 && (
              <div className="text-center py-8">
                <FaUpload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-500">Зураг оруулахын тулд дарна уу</p>
                <label
                  htmlFor="images"
                  className="mt-2 inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer"
                >
                  Зураг сонгох
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Хадгалах товч */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-2 px-4 rounded-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-medium`}
          >
            {isSubmitting ? "Нэмж байна..." : "Нэмэх"}
          </button>
        </div>
      </form>
    </div>
  );
}
