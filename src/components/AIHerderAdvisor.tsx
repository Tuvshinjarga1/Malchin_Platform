"use client";

import { useState } from "react";
import { FaLightbulb, FaArrowRight } from "react-icons/fa";

const marketTips = [
  {
    title: "Үнийн хэлбэлзэл",
    description:
      "Шинэ жилийн баяраар махны эрэлт ихсэх тул үнийг одооноос бага зэрэг өсгөх нь зүйтэй. Таны орлого дунджаар 15-20% нэмэгдэх боломжтой.",
  },
  {
    title: "Зах зээлийн судалгаа",
    description:
      "Хамгийн их эрэлттэй махны төрөл одоогоор хонины мах байна. Үхрийн махны эрэлт буурч, адууны махны эрэлт өссөн байна.",
  },
  {
    title: "Борлуулалтын зөвлөгөө",
    description:
      'Бүтээгдэхүүнээ багцалж санал болгосноор борлуулалт дунджаар 25% өсөх магадлалтай. Жишээлбэл: "Шөлний багц", "Хоолны багц" гэх мэт.',
  },
  {
    title: "Бүтээгдэхүүний чанар",
    description:
      "Органик гэдгээ онцолсон тайлбар, гэрчилгээ, зураг хавсаргаснаар хэрэглэгчдийн итгэлийг нэмэгдүүлж, үнийг 10-15% нэмэх боломжтой.",
  },
];

const AIHerderAdvisor = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="bg-green-600 text-white p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <FaLightbulb className="mr-2" size={20} />
          <h2 className="text-xl font-bold">Малчдад зориулсан AI зөвлөгөө</h2>
        </div>
        <div
          className={`transform transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Манай AI системээс таны борлуулалтыг нэмэгдүүлэх, зах зээлийн чиг
            хандлагыг ойлгоход туслах зөвлөгөө:
          </p>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
              {marketTips.map((tip, index) => (
                <div
                  key={index}
                  className={`cursor-pointer p-3 rounded-md transition-colors duration-200 ${
                    activeIndex === index
                      ? "bg-green-600 text-white"
                      : "bg-green-100 hover:bg-green-200 text-green-800"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {tip.title}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                {marketTips[activeIndex].title}
              </h3>
              <p className="text-gray-700">
                {marketTips[activeIndex].description}
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Борлуулалтын стратеги
            </h3>
            <p className="text-gray-700 mb-4">
              Таны бүтээгдэхүүний борлуулалтын түүх, зах зээлийн хандлагын дүн
              шинжилгээнд үндэслэн, дараах стратегийг санал болгож байна:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start">
                <FaArrowRight className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                <span>
                  2-р сарын эхний 2 долоо хоногт хонины махны үнийг 8-10%
                  нэмэгдүүлэх
                </span>
              </li>
              <li className="flex items-start">
                <FaArrowRight className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                <span>Үхрийн махыг багцалж, хямдралтай үнээр санал болгох</span>
              </li>
              <li className="flex items-start">
                <FaArrowRight className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                <span>Адууны махны нийлүүлэлтийг 15-20% нэмэгдүүлэх</span>
              </li>
              <li className="flex items-start">
                <FaArrowRight className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                <span>
                  Бүтээгдэхүүний онцлог шинж чанарыг дэлгэрэнгүй тайлбарлах
                </span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Link
              href="/herder/dashboard"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Малчны хянах самбар руу очих
              <svg
                className="ml-2"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Дотоод Link компонент
const Link = ({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

export default AIHerderAdvisor;
