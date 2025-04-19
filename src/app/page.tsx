import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaLeaf, FaHandshake } from "react-icons/fa";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <div className="relative h-[70vh] w-full">
        <Image
          src="/ger.jpg"
          alt="Монгол малчин"
          fill
          style={{ objectFit: "contain", objectPosition: "bottom" }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            Малчдаас шууд танд
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl text-center">
            Монгол малчдын гар дээрээс шууд худалдаж авах боломжтой цэвэр,
            органик мах, сүү, цагаан идээ
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products/meat"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              Мах үзэх
            </Link>
            <Link
              href="/products/dairy"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              Цагаан идээ үзэх
            </Link>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Яагаад биднийг сонгох вэ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl text-green-600 mx-auto mb-4">
                <FaLeaf className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-2">Цэвэр, органик</h3>
              <p className="text-gray-600">
                Малчдын бэлчээрт өсгөсөн цэвэр, химийн бодисгүй, байгалийн
                бүтээгдэхүүн
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl text-blue-600 mx-auto mb-4">
                <FaHandshake className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-2">Шууд малчнаас</h3>
              <p className="text-gray-600">
                Дундын зуучлагчгүй, малчидтай шууд холбогдож худалдаж авах
                боломжтой
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl text-red-600 mx-auto mb-4">
                <FaShoppingCart className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-2">Хялбар худалдан авалт</h3>
              <p className="text-gray-600">
                Хэдхэн товшилтоор захиалга өгч, төлбөр төлж, хүргүүлж авах
                боломжтой
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products section */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Шинэ бүтээгдэхүүнүүд</h2>
        <ProductGrid category={null} limit={8} />
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Бүх бүтээгдэхүүн үзэх
          </Link>
        </div>
      </div>

      {/* How it works section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Хэрхэн ажилладаг вэ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Бүртгүүлэх</h3>
              <p className="text-gray-600">
                Хэрэглэгч эсвэл малчнаар бүртгүүлж хувийн мэдээллээ оруулна
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Бүтээгдэхүүн сонгох</h3>
              <p className="text-gray-600">
                Хүссэн бүтээгдэхүүнээ сонгож, сагсандаа нэмнэ
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Захиалга өгөх</h3>
              <p className="text-gray-600">
                Хүргүүлэх хаяг, утасны дугаараа оруулж захиалга өгнө
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">Хүлээн авах</h3>
              <p className="text-gray-600">
                Захиалсан бүтээгдэхүүнээ хүргүүлж авна
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
