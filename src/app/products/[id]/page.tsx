"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaCheck,
} from "react-icons/fa";
import { getProduct } from "@/lib/products";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;

      setLoading(true);
      try {
        const productData = await getProduct(params.id as string);
        if (productData) {
          setProduct(productData);
        } else {
          setError("Бүтээгдэхүүн олдсонгүй");
        }
      } catch (err) {
        setError("Бүтээгдэхүүн ачаалахад алдаа гарлаа");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchProduct();
    }
  }, [params.id, isClient]);

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.quantity) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!product) return;

    console.log(
      "ProductDetailPage handleAddToCart called for product:",
      product.title,
      "quantity:",
      quantity
    );
    try {
      setIsAddingToCart(true);
      addToCart(product, quantity);
      console.log("Added product to cart successfully");

      // Add to cart animation effect
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1500);
    } catch (err) {
      console.error("Error when adding product to cart:", err);
      setIsAddingToCart(false);
    }
  };

  if (!isClient || loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 animate-pulse">
            <div className="bg-gray-300 w-full h-96 rounded-lg"></div>
          </div>
          <div className="md:w-1/2 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-6"></div>
            <div className="h-10 bg-gray-300 rounded-md w-full mb-6"></div>
            <div className="h-12 bg-gray-300 rounded-md w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-red-500 text-xl mb-4">
            {error || "Бүтээгдэхүүн олдсонгүй"}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Бүтээгдэхүүн руу буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <Link
        href="/products"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <FaArrowLeft className="mr-2" />
        Бүтээгдэхүүн руу буцах
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage] || "/images/placeholder.jpg"}
              alt={product.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-xl text-green-600 font-bold mb-4">
            {product.price.toLocaleString()}₮
            <span className="text-sm font-normal text-gray-500 ml-2">
              / {product.unit}
            </span>
          </p>

          <div className="flex items-center mb-6">
            <span className="text-gray-600 mr-2">Малчин:</span>
            <span>{product.herderName}</span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Тайлбар</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Тоо ширхэг</h2>
              <span className="text-sm text-gray-500">
                Үлдэгдэл: {product.quantity} {product.unit}
              </span>
            </div>

            <div className="flex items-center mb-6">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-l-md bg-gray-100 flex items-center justify-center border border-gray-300"
              >
                <FaMinus size={12} />
              </button>
              <input
                type="number"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-16 h-10 text-center border-t border-b border-gray-300"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.quantity}
                className="w-10 h-10 rounded-r-md bg-gray-100 flex items-center justify-center border border-gray-300"
              >
                <FaPlus size={12} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.quantity === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                product.quantity === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : isAddingToCart
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {product.quantity === 0 ? (
                "Үлдэгдэлгүй"
              ) : isAddingToCart ? (
                <>
                  <FaCheck className="mr-2" />
                  Нэмэгдлээ!
                </>
              ) : (
                <>
                  <FaShoppingCart className="mr-2" />
                  Сагсанд нэмэх - {(product.price * quantity).toLocaleString()}₮
                </>
              )}
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-medium mb-2">
              Бүтээгдэхүүний мэдээлэл
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ангилал:</span>
                <span className="font-medium">
                  {product.category === "meat" ? "Мах" : "Цагаан идээ"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Дэд ангилал:</span>
                <span className="font-medium">{product.subCategory}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
