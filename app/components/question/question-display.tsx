"use client";

import React, { useState } from "react";
import MathRenderer from "./math-renderer";
import { getFormattedQuestion } from "@/lib/mathUtils";

interface QuestionDisplayProps {
  question: {
    id: string;
    topic: string;
    difficulty: string;
    raw_text: string;
    answer_type: string;
  };
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  const [answer, setAnswer] = useState("");

  // Get the formatted question with proper LaTeX
  const formattedQuestion = getFormattedQuestion();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Question</h2>
            <p className="text-sm text-gray-600 mt-1">
              {question.topic} • {question.difficulty}
            </p>
          </div>
          <span className="text-xs text-gray-500 font-mono">{question.id}</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Question Text */}
          <div className="mb-8 text-lg leading-relaxed text-gray-800">
            <MathRenderer content={formattedQuestion} />
          </div>

          {/* Answer Input */}
          <div className="mt-8">
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Answer
            </label>
            <input
              id="answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
            <p className="mt-2 text-sm text-gray-500">
              Express your answer in the form ± a × 10ⁿ
            </p>
          </div>

          {/* Optional: Submit Button */}
          <div className="mt-6">
            <button
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              onClick={() => console.log("Answer submitted:", answer)}
            >
              Check Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
