"use client";

import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

type Message = {
  content: string;
  isUser: boolean;
};

const initialMessages: Message[] = [
  {
    content:
      "Сайн байна уу! Би таны захиалга, махны үнэ, бүтээгдэхүүний талаар асуултад хариулахад бэлэн байна.",
    isUser: false,
  },
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      content: inputValue,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "";

      // Simple response logic based on keywords
      const lowerCaseInput = inputValue.toLowerCase();
      if (lowerCaseInput.includes("үнэ") || lowerCaseInput.includes("үнийн")) {
        response =
          "Одоогийн байдлаар хонины мах 10,000₮/кг, үхрийн мах 12,000₮/кг, ямааны мах 9,000₮/кг байна.";
      } else if (
        lowerCaseInput.includes("хүргэлт") ||
        lowerCaseInput.includes("хүргүүлэх")
      ) {
        response =
          "Хүргэлт Улаанбаатар хотын хэмжээнд 3-5 цагийн дотор хүргэгдэх бөгөөд 50,000₮-өөс дээш захиалгад үнэгүй.";
      } else if (
        lowerCaseInput.includes("захиалга") ||
        lowerCaseInput.includes("захиалах")
      ) {
        response =
          'Захиалгыг манай вэбсайт дээр хийх боломжтой. "Бүтээгдэхүүн" цэс рүү орж сонгоод, сагсандаа нэмээд, шууд худалдан авалт хийнэ үү.';
      } else if (
        lowerCaseInput.includes("хямдрал") ||
        lowerCaseInput.includes("урамшуулал")
      ) {
        response =
          "Одоогоор хонины махны хямдрал явагдаж байна. 5кг-аас дээш захиалгад 10% хямдрал.";
      } else {
        response =
          "Уучлаарай, таны асуултыг ойлгосонгүй. Махны үнэ, захиалга, хүргэлтийн талаар асууж болно.";
      }

      const aiMessage: Message = {
        content: response,
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
          <FaRobot size={24} />
        </button>
      ) : (
        <div
          className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col"
          style={{ height: "500px" }}
        >
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <h3 className="font-bold">AI Туслах</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white">
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.isUser ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4 flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Асуултаа бичнэ үү..."
              className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-lg disabled:bg-blue-300"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
