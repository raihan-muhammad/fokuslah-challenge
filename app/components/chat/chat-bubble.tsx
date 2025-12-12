"use client";

import React from "react";
import { ChatMessage } from "@/lib/data";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start max-w-[80%]`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
            isUser ? "bg-[#0284c7] ml-2" : "bg-purple-600 mr-2"
          }`}
        >
          {isUser ? "U" : "J"}
        </div>

        {/* Message Content */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-[#0284c7] text-white rounded-tr-sm"
              : "bg-gray-100 text-gray-900 rounded-tl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          <span
            className={`text-xs mt-1 block ${
              isUser ? "text-primary-100" : "text-gray-500"
            }`}
          >
            {message.timestamp.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
