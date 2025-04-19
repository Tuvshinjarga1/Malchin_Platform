"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, userRole } = useAuth();
  const pathname = usePathname();

  // Mobile меню хаах үед scroll lock хийх
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Нүүр" },
    { href: "/products", label: "Бүтээгдэхүүн" },
    { href: "/products/meat", label: "Мах" },
    { href: "/products/dairy", label: "Цагаан идээ" },
    // { href: "/about", label: "Бидний тухай" },
    // { href: "/contact", label: "Холбоо барих" },
  ];

  const userNavigation = currentUser ? (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 hover:text-green-600 focus:outline-none"
      >
        <FaUser className="h-5 w-5 mr-1" />
        <span>{currentUser.name?.split(" ")[0] || "Хэрэглэгч"}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {userRole === "herder" && (
            <>
              <Link
                href="/herder/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Миний хянах самбар
              </Link>
              <Link
                href="/herder/products"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Миний бүтээгдэхүүн
              </Link>
              <Link
                href="/herder/orders"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Захиалгууд
              </Link>
            </>
          )}

          {userRole === "admin" && (
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Админ самбар
            </Link>
          )}

          {userRole === "customer" && (
            <>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Миний бүртгэл
              </Link>
              {/* <Link
                href="/orders"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Миний захиалгууд
              </Link> */}
            </>
          )}

          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Гарах
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link href="/login" className="text-gray-700 hover:text-green-600">
      <div className="flex items-center">
        <FaUser className="h-5 w-5 mr-1" />
        <span>Нэвтрэх</span>
      </div>
    </Link>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-green-600">
                Малчны Зах
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? "text-green-600 font-semibold"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop user navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/cart" className="text-gray-700 hover:text-green-600">
              <div className="flex items-center">
                <FaShoppingCart className="h-5 w-5 mr-1" />
                <span>Сагс</span>
              </div>
            </Link>
            {userNavigation}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Link
              href="/cart"
              className="text-gray-700 hover:text-green-600 mr-4"
            >
              <FaShoppingCart className="h-6 w-6" />
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-16">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? "text-green-600 font-semibold"
                    : "text-gray-700 hover:text-green-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-4 pt-4 border-t border-gray-200">
              {currentUser ? (
                <>
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    Сайн байна уу,{" "}
                    {currentUser.name?.split(" ")[0] || "Хэрэглэгч"}
                  </div>

                  {userRole === "herder" && (
                    <>
                      <Link
                        href="/herder/dashboard"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Миний хянах самбар
                      </Link>
                      <Link
                        href="/herder/products"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Миний бүтээгдэхүүн
                      </Link>
                      <Link
                        href="/herder/orders"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Захиалгууд
                      </Link>
                    </>
                  )}

                  {userRole === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Админ самбар
                    </Link>
                  )}

                  {userRole === "customer" && (
                    <>
                      <Link
                        href="/account"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Миний бүртгэл
                      </Link>
                      {/* <Link
                        href="/orders"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Миний захиалгууд
                      </Link> */}
                    </>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                  >
                    Гарах
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Нэвтрэх
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
