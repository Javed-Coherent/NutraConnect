import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateSystemPrompt } from '@/lib/knowledge/website-knowledge';

// Generate system prompt from comprehensive knowledge base
const SYSTEM_PROMPT = generateSystemPrompt();

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Return a helpful fallback response if API key is not configured
      return NextResponse.json({
        message: "I'm currently in demo mode. To enable full AI capabilities, please configure the OPENAI_API_KEY in your environment variables. In the meantime, I can tell you that NutraConnect helps you find suppliers, manufacturers, and distributors in the nutraceutical industry across India!",
      });
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);

    // Check if it's an OpenAI API error
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json({
          message: "API authentication failed. Please check your OpenAI API key configuration.",
        });
      }
      if (error.status === 429) {
        return NextResponse.json({
          message: "I'm receiving too many requests right now. Please try again in a moment.",
        });
      }
    }

    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
