import React, { useEffect, useState } from "react";
import TextViewerSkeleton from "../ui/TaskViwerSkeleton"

const LoadingSkeleton = ({ theme = "light" }) => {
  const [cardCount, setCardCount] = useState(4);

  useEffect(() => {
    const updateCardCount = () => {
      const width = window.innerWidth;
      if (width < 640) setCardCount(2);
      else if (width < 1024) setCardCount(4);
      else setCardCount(6);
    };
    updateCardCount();
    window.addEventListener("resize", updateCardCount);
    return () => window.removeEventListener("resize", updateCardCount);
  }, []);

  const cards = Array.from({ length: cardCount });

  return (
    <div
      className={`min-h-screen py-6 sm:py-8 px-4 ${
        theme === "dark"
          ? "bg-linear-to-br from-gray-900 to-gray-800"
          : "bg-linear-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((_, i) => (
            <TextViewerSkeleton key={i} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
