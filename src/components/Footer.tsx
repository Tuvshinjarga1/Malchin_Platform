import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Малчны Зах</h3>
            <p className="text-gray-300 mb-4">
              Монгол малчдаас шууд худалдан авах боломжтой цэвэр, органик мах,
              сүү, цагаан идээний цахим зах
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-300 hover:text-white"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-300 hover:text-white"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-300 hover:text-white"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Холбоосууд</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Нүүр
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white"
                >
                  Бүтээгдэхүүн
                </Link>
              </li>
              <li>
                <Link
                  href="/products/meat"
                  className="text-gray-300 hover:text-white"
                >
                  Мах
                </Link>
              </li>
              <li>
                <Link
                  href="/products/dairy"
                  className="text-gray-300 hover:text-white"
                >
                  Цагаан идээ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white"
                >
                  Холбоо барих
                </Link>
              </li>
            </ul>
          </div>

          {/* User Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Хэрэглэгч</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white">
                  Нэвтрэх
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-300 hover:text-white"
                >
                  Бүртгүүлэх
                </Link>
              </li>
              <li>
                <Link
                  href="/register?role=herder"
                  className="text-gray-300 hover:text-white"
                >
                  Малчнаар бүртгүүлэх
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-white">
                  Сагс
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-white">
                  Захиалгууд
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Холбоо барих</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaPhone className="h-5 w-5 mr-2 text-gray-300" />
                <span className="text-gray-300">+976 9911-2233</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-2 text-gray-300" />
                <span className="text-gray-300">info@malchnyzah.mn</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="h-5 w-5 mr-2 mt-1 text-gray-300" />
                <span className="text-gray-300">
                  Улаанбаатар хот, Баянзүрх дүүрэг, 1-р хороо, Энхтайваны өргөн
                  чөлөө 33
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {currentYear} Малчны Зах. Бүх эрх хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
