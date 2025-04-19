"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { updateUserProfile } from "@/lib/auth";

export default function ProfileEditPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    location: "",
  });

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login?redirect=/profile/edit");
      return;
    }

    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        location: currentUser.location || "",
      });
    }
  }, [currentUser, loading, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!currentUser) {
        throw new Error("Та нэвтрээгүй байна");
      }

      const result = await updateUserProfile(currentUser.id, formData);

      if (result.success) {
        setSuccess("Мэдээлэл амжилттай шинэчлэгдлээ");
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        setError(result.error || "Мэдээлэл шинэчлэхэд алдаа гарлаа");
      }
    } catch (err) {
      setError("Мэдээлэл шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Ачаалж байна...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Link
        href="/profile"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <FaArrowLeft className="mr-2" />
        Профайл руу буцах
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Мэдээлэл засах</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Нэр
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Утасны дугаар
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Байршил
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
              >
                {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500">
            И-мэйл хаягаа солихыг хүсвэл дахин нэвтрэх шаардлагатай.
          </p>
        </div>
      </div>
    </div>
  );
}
