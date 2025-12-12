/**
 * Example API Route for LLM Integration
 * File: app/api/chat/route.ts
 *
 * This demonstrates how to connect the chat interface to a real LLM API
 * in production. This file is NOT included in the demo but shows the pattern.
 */

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

// Types
interface ChatRequest {
  message: string;
  context: {
    questionId: string;
    questionText: string;
    studentAnswer?: string;
    conversationHistory: Array<{
      role: "user" | "assistant";
      content: string;
    }>;
  };
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for Jojo
const JOJO_SYSTEM_PROMPT = `You are Jojo, a friendly and helpful AI math tutor.

Your role:
- Help students understand math problems without giving away answers immediately
- Provide hints that guide thinking rather than solve directly
- Only reveal full solutions when explicitly asked for "steps" or "solution"
- Use encouraging, supportive language
- Break down complex concepts into simpler parts

Guidelines:
- For hint requests: Give subtle clues about approach
- For step requests: Provide detailed step-by-step solution
- For questions: Explain concepts clearly with examples
- Always relate back to the current problem
- Use appropriate math notation when helpful

Current problem context will be provided with each request.`;

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: ChatRequest = await req.json();
    const { message, context } = body;

    // Validate input
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build conversation messages for OpenAI
    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      {
        role: "system",
        content: `${JOJO_SYSTEM_PROMPT}

Current Question (ID: ${context.questionId}):
${context.questionText}

Student's Current Answer: ${context.studentAnswer || "Not provided yet"}

Remember: Guide the student's thinking, don't just give answers.`,
      },
    ];

    // Add conversation history (last 5 messages for context)
    const recentHistory = context.conversationHistory.slice(-5);
    recentHistory.forEach((msg) => {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      });
    });

    // Add current user message
    messages.push({
      role: "user",
      content: message,
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or 'gpt-3.5-turbo' for lower cost
      messages: messages,
      temperature: 0.7, // Balance creativity and consistency
      max_tokens: 500, // Limit response length
      presence_penalty: 0.6, // Encourage diverse responses
      frequency_penalty: 0.3, // Reduce repetition
    });

    // Extract response
    const aiResponse =
      completion.choices[0]?.message?.content ||
      "I'm having trouble generating a response. Please try again.";

    // Return response
    return NextResponse.json({
      message: aiResponse,
      tokensUsed: completion.usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error("Chat API Error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("rate_limit")) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment." },
          { status: 429 }
        );
      }

      if (error.message.includes("api_key")) {
        return NextResponse.json(
          { error: "API configuration error" },
          { status: 500 }
        );
      }
    }

    // Generic error
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}

// Optional: Add rate limiting
// Install: npm install @upstash/ratelimit @upstash/redis

/*
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

// In POST handler:
const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
const { success } = await ratelimit.limit(identifier);

if (!success) {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429 }
  );
}
*/

// Optional: Add request logging
/*
import { AnalyticsClient } from '@/lib/analytics';

await AnalyticsClient.track({
  event: 'chat_message_sent',
  userId: session?.user?.id,
  properties: {
    questionId: context.questionId,
    messageLength: message.length,
    tokensUsed: completion.usage?.total_tokens,
  },
});
*/

// Optional: Add response caching for common queries
/*
import { redis } from '@/lib/redis';

const cacheKey = `chat:${context.questionId}:${message.toLowerCase()}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return NextResponse.json({ message: cached, cached: true });
}

// ... make API call ...

await redis.setex(cacheKey, 3600, aiResponse); // Cache for 1 hour
*/
