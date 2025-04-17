"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const { currentUser, userRole } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        scrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm"
      } transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-700">
            Малчин Маркет
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Бүтээгдэхүүн
            </Link>
            <Link
              href="/products?category=meat"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Мах
            </Link>
            <Link
              href="/products?category=dairy"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Цагаан идээ
            </Link>
            {userRole === "herder" && (
              <Link
                href="/herder/dashboard"
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                Миний хэсэг
              </Link>
            )}
            {userRole === "admin" && (
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                Админ хэсэг
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/cart"
              className="text-gray-700 hover:text-green-600 relative"
            >
              <FaShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {currentUser ? (
              <Link
                href="/profile"
                className="flex items-center text-gray-700 hover:text-green-600"
              >
                <FaUser className="mr-2" />
                <span>{currentUser.name}</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600 font-medium"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Бүтээгдэхүүн
              </Link>
              <Link
                href="/products?category=meat"
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Мах
              </Link>
              <Link
                href="/products?category=dairy"
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Цагаан идээ
              </Link>
              {userRole === "herder" && (
                <Link
                  href="/herder/dashboard"
                  className="text-gray-700 hover:text-green-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Миний хэсэг
                </Link>
              )}
              {userRole === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="text-gray-700 hover:text-green-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Админ хэсэг
                </Link>
              )}
              {currentUser ? (
                <Link
                  href="/profile"
                  className="flex items-center text-gray-700 hover:text-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="mr-2" />
                  <span>{currentUser.name}</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-green-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Нэвтрэх
                  </Link>
                  <Link
                    href="/register"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Бүртгүүлэх
                  </Link>
                </>
              )}
              <Link
                href="/cart"
                className="text-gray-700 hover:text-green-600 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaShoppingCart className="mr-2" />
                <span>Сагс {totalItems > 0 && `(${totalItems})`}</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
