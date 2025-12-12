"use client";

import React from "react";

export default function ThinkingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start max-w-[80%]">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm bg-purple-600 mr-2">
          J
        </div>

        {/* Thinking Animation */}
        <div className="px-4 py-3 rounded-2xl bg-gray-100 rounded-tl-sm">
          <div className="flex space-x-2">
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
