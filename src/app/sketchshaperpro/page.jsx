"use client";
import React from "react";
import { useRouter } from "next/navigation";

const SketchShaperProPage = () => {
  const router = useRouter();

  const handleAccessClick = () => {
    router.push("/pro");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Pro Access Required
      </h1>
      <p className="text-gray-300 mb-8 text-center max-w-md">
        The SketchShaper Pro Library has moved to a new URL.
        <br />
        Please use the button below to access the updated Pro page.
      </p>
      <button
        onClick={handleAccessClick}
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-xl shadow-lg transition"
      >
        Go to Sketchshaper Pro Library
      </button>
    </div>
  );
};

export default SketchShaperProPage;