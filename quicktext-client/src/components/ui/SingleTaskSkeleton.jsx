import React from "react";

const SingleTaskViewSkeleton = ({ theme = "light" }) => {
  const isDark = theme === "dark";
  const bgBase = isDark ? "bg-gray-600" : "bg-gray-300";
  const bgContainer = isDark ? "bg-gray-800" : "bg-white";
  const borderBase = isDark ? "border-gray-700" : "border-gray-200";
  const subBg = isDark ? "bg-gray-700" : "bg-gray-100";
  const pageBg = isDark ? "bg-gray-900" : "bg-gray-50";

  return (
    <div
      className={`min-h-screen w-full ${pageBg} flex justify-center py-4 sm:py-6 px-3 sm:px-6 transition-colors duration-300`}
    >
      <div
        className={`w-full max-w-4xl shadow-md p-4 sm:p-6 md:p-8 animate-pulse border rounded-lg ${borderBase} ${bgContainer}`}
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div className="space-y-2 w-full sm:w-2/3">
            <div className={`h-5 sm:h-6 w-10/12 sm:w-5/6 ${bgBase} rounded`}></div>
            <div className={`h-3 sm:h-4 w-3/4 ${bgBase} rounded`}></div>
          </div>
          <div className="flex gap-2 sm:gap-3 justify-start sm:justify-end flex-wrap">
            <div className={`h-8 sm:h-9 w-24 sm:w-28 ${bgBase} rounded`}></div>
            <div className={`h-8 sm:h-9 w-20 sm:w-24 ${bgBase} rounded`}></div>
          </div>
        </div>

        {/* Task Meta Info */}
        <div
          className={`border p-4 sm:p-5 md:p-6 mb-5 sm:mb-6 ${subBg} ${borderBase} rounded-md`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-5">
            <div className="space-y-2">
              <div className={`h-3 sm:h-4 w-24 ${bgBase} rounded`}></div>
              <div className={`h-3 sm:h-4 w-36 sm:w-48 ${bgBase} rounded`}></div>
            </div>
            <div className="space-y-2">
              <div className={`h-3 sm:h-4 w-28 ${bgBase} rounded`}></div>
              <div className={`h-3 sm:h-4 w-40 sm:w-44 ${bgBase} rounded`}></div>
            </div>
          </div>

          {/* Content Block */}
          <div className="space-y-2 sm:space-y-3">
            <div className={`h-3 sm:h-4 w-full ${bgBase} rounded`}></div>
            <div className={`h-3 sm:h-4 w-11/12 ${bgBase} rounded`}></div>
            <div className={`h-3 sm:h-4 w-10/12 ${bgBase} rounded`}></div>
            <div className={`h-3 sm:h-4 w-9/12 ${bgBase} rounded`}></div>
            <div className={`h-3 sm:h-4 w-4/6 ${bgBase} rounded`}></div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="space-y-2 w-full sm:w-auto">
            <div className={`h-3 sm:h-4 w-32 sm:w-40 ${bgBase} rounded`}></div>
            <div className={`h-3 sm:h-4 w-28 sm:w-36 ${bgBase} rounded`}></div>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-wrap justify-start sm:justify-end">
            <div className={`h-8 sm:h-9 w-24 sm:w-28 ${bgBase} rounded`}></div>
            <div className={`h-8 sm:h-9 w-20 sm:w-24 ${bgBase} rounded`}></div>
            <div className={`h-8 sm:h-9 w-16 sm:w-20 ${bgBase} rounded`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTaskViewSkeleton;
