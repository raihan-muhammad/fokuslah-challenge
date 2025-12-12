"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "./chat-bubble";
import ThinkingIndicator from "./thinking-indicator";
import { ChatMessage, mockAIResponses } from "@/lib/data";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export default function ChatDrawer({
  isOpen,
  onClose,
  isMobile,
}: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm Jojo, your AI tutor. Need help with this question? Try asking for a hint or the step-by-step solution!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Simulate AI response
  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Wait 1.5 seconds to simulate thinking
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("hint")) {
      return mockAIResponses.hint;
    } else if (
      lowerMessage.includes("step") ||
      lowerMessage.includes("solution")
    ) {
      return mockAIResponses.steps;
    } else {
      return mockAIResponses.default;
    }
  };

  // Handle sending message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isThinking) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    // Get and add AI response
    const aiResponse = await getAIResponse(content);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsThinking(false);
  };

  // Quick action buttons
  const handleQuickAction = (action: "hint" | "steps") => {
    const message = action === "hint" ? "Give me a hint" : "Reveal the steps";
    handleSendMessage(message);
  };

  return (
    <div
      className={`
        ${isMobile ? "fixed inset-0 z-50" : "h-full"}
        ${isMobile && !isOpen ? "pointer-events-none" : ""}
      `}
    >
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="absolute inset-0 bg-black opacity-50 fade-in"
          onClick={onClose}
        />
      )}

      {/* Chat Container */}
      <div
        className={`
          ${
            isMobile
              ? "absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl slide-up"
              : "h-full"
          }
          bg-white flex flex-col shadow-lg
          ${isMobile && !isOpen ? "translate-y-full" : ""}
          transition-transform duration-300 ease-out
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-600 font-bold">
                J
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Ask Jojo</h3>
                <p className="text-sm text-purple-100">Your AI tutor</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                className="text-white hover:bg-purple-800 rounded-full p-2 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex-shrink-0 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => handleQuickAction("hint")}
              disabled={isThinking}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💡 Give me a hint
            </button>
            <button
              onClick={() => handleQuickAction("steps")}
              disabled={isThinking}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📝 Reveal the steps
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 chat-container"
        >
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isThinking && <ThinkingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-gray-200 px-4 py-4 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && handleSendMessage(inputValue)
              }
              placeholder="Ask Jojo anything..."
              disabled={isThinking}
              className="flex-1 px-4 py-3 text-gray-400 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isThinking}
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
