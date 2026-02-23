import React from "react";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg px-10 py-8 flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-sm font-medium text-gray-600">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loading;
