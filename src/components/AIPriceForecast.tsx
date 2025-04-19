"use client";

import { useState, useEffect } from "react";
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

type PriceTrend = "up" | "down" | "stable";

type PriceData = {
  name: string;
  currentPrice: number;
  forecastPrice: number;
  trend: PriceTrend;
  percentChange: number;
};

const mockData: PriceData[] = [
  {
    name: "Хонины мах",
    currentPrice: 10000,
    forecastPrice: 11000,
    trend: "up",
    percentChange: 10,
  },
  {
    name: "Үхрийн мах",
    currentPrice: 12000,
    forecastPrice: 11500,
    trend: "down",
    percentChange: 4.17,
  },
  {
    name: "Ямааны мах",
    currentPrice: 9000,
    forecastPrice: 9000,
    trend: "stable",
    percentChange: 0,
  },
  {
    name: "Адууны мах",
    currentPrice: 11000,
    forecastPrice: 12000,
    trend: "up",
    percentChange: 9.09,
  },
];

const AIPriceForecast = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляц хийж байна - бодит тохиолдолд API руу хүсэлт явуулна
    const timer = setTimeout(() => {
      setPriceData(mockData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend: PriceTrend) => {
    switch (trend) {
      case "up":
        return <FaArrowUp className="text-red-500" />;
      case "down":
        return <FaArrowDown className="text-green-500" />;
      case "stable":
        return <FaMinus className="text-gray-500" />;
    }
  };

  const getTrendColor = (trend: PriceTrend) => {
    switch (trend) {
      case "up":
        return "text-red-500";
      case "down":
        return "text-green-500";
      case "stable":
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FaChartLine className="text-blue-600 mr-2" size={24} />
        <h2 className="text-2xl font-bold">AI Үнийн Таамаглал</h2>
      </div>

      <p className="text-gray-600 mb-6">
        AI технологид суурилсан дараагийн 30 хоногийн үнийн хандлага. Энэхүү
        таамаглал нь өмнөх үнийн түүх, улирлын хэлбэлзэл, зах зээлийн нөхцөл
        байдалд үндэслэсэн.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Бүтээгдэхүүн</th>
                <th className="py-3 px-4 text-right">Одоогийн үнэ</th>
                <th className="py-3 px-4 text-right">Таамаглал үнэ</th>
                <th className="py-3 px-4 text-right">Өөрчлөлт</th>
              </tr>
            </thead>
            <tbody>
              {priceData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4 text-right">
                    {item.currentPrice.toLocaleString()}₮
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.forecastPrice.toLocaleString()}₮
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end">
                      {getTrendIcon(item.trend)}
                      <span className={`ml-1 ${getTrendColor(item.trend)}`}>
                        {item.percentChange}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>
          * Энэхүү таамаглал нь зөвхөн мэдээллийн зорилготой бөгөөд бодит үнэ
          өөрчлөгдөж болно.
        </p>
      </div>
    </div>
  );
};

export default AIPriceForecast;
