import React from "react";

const TextViewerSkeleton = ({ theme = "light" }) => {
  const bgBase = theme === "dark" ? "bg-gray-600" : "bg-gray-300";
  const bgContainer = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderBase = theme === "dark" ? "border-gray-600" : "border-gray-200";
  const subBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";

  return (
    <div
      className={`rounded-xl shadow-lg p-4 sm:p-6 animate-pulse ${bgContainer} w-full max-w-full`}
    >
      {/* One-time view banner placeholder */}
      <div
        className={`mb-4 p-3 rounded-lg h-8 sm:h-10 w-full ${
          theme === "dark" ? "bg-yellow-300/20" : "bg-yellow-100/40"
        }`}
      ></div>

      {/* Header + content placeholder */}
      <div className="mb-4 space-y-3">
        <div className={`h-4 sm:h-5 w-1/2 sm:w-1/3 rounded ${bgBase}`}></div>

        <div className={`p-3 sm:p-4 rounded-lg border ${subBg} ${borderBase}`}>
          <div className={`h-3 w-full mb-2 rounded ${bgBase}`}></div>
          <div className={`h-3 w-5/6 mb-2 rounded ${bgBase}`}></div>
          <div className={`h-3 w-3/4 rounded ${bgBase}`}></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-4">
        <div className="space-y-2 w-full sm:w-auto">
          <div className={`h-3 w-2/3 sm:w-32 rounded ${bgBase}`}></div>
          <div className={`h-3 w-1/2 sm:w-24 rounded ${bgBase}`}></div>
        </div>

        <div className="flex flex-wrap gap-2 justify-start sm:justify-end w-full sm:w-auto">
          <div className={`h-8 w-24 sm:w-20 rounded-lg ${bgBase}`}></div>
          <div className={`h-8 w-20 sm:w-16 rounded-lg ${bgBase}`}></div>
        </div>
      </div>
    </div>
  );
};

export default TextViewerSkeleton;
