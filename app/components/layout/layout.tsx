"use client";

import React, { useState, useEffect } from "react";
import QuestionDisplay from "../question/question-display";
import ChatDrawer from "../chat/chat-drawer";
import { questionData } from "@/lib/data";

export default function ExamLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-[#0284c7] font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Fokuslah</h1>
          </div>
          <div className="text-sm text-gray-600">Exam Mode</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Question Area */}
          <div
            className={`${
              isMobile ? "w-full" : "w-[60%]"
            } h-full overflow-hidden`}
          >
            <QuestionDisplay question={questionData} />
          </div>

          {/* Chat Area - Desktop */}
          {!isMobile && (
            <div className="w-[40%] h-full border-l border-gray-200">
              <ChatDrawer isOpen={true} onClose={() => {}} isMobile={false} />
            </div>
          )}

          {/* Chat Drawer - Mobile */}
          {isMobile && (
            <ChatDrawer
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              isMobile={true}
            />
          )}
        </div>
      </div>

      {/* Floating Action Button - Mobile Only */}
      {isMobile && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-purple-700 transition-all hover:scale-110 z-40"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
            J
          </span>
        </button>
      )}
    </div>
  );
}
