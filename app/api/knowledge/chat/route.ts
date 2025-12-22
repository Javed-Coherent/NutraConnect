import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateIndustrySystemPrompt } from '@/lib/knowledge/industry-knowledge';
import {
  detectCompanyIntent,
  searchCompaniesForChat,
  formatCompaniesForContext,
} from '@/lib/services/chat-company-search';

// Generate base system prompt from industry knowledge base
const BASE_SYSTEM_PROMPT = generateIndustrySystemPrompt();

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
        message: `I'm currently in demo mode. To enable full AI capabilities, please configure the OPENAI_API_KEY in your environment variables.

In the meantime, here's what I can help you with when fully activated:
- **Regulatory guidance** (FSSAI, GMP requirements)
- **Supply chain advice** (sourcing, manufacturing, distribution)
- **CDMO industry insights** (market trends, pricing, best practices)
- **Business strategies** (sales, market entry, customer targeting)
- **Product knowledge** (vitamins, herbs, probiotics, sports nutrition)
- **Company recommendations** from 80,000+ verified businesses

NutraConnect connects you with 80,000+ verified nutraceutical businesses across India!`,
      });
    }

    // Get the last user message for intent detection
    const lastUserMessage = messages
      .filter((m: { role: string }) => m.role === 'user')
      .pop();

    // Build dynamic system prompt
    let systemPrompt = BASE_SYSTEM_PROMPT;
    let companyDataForAssistant = '';

    // Check if user is asking for company recommendations (wrapped in try-catch for safety)
    try {
      const userContent = lastUserMessage?.content;
      if (userContent && typeof userContent === 'string' && detectCompanyIntent(userContent)) {
        console.log('[KnowledgeChat] Company intent detected, searching database...');
        console.log('[KnowledgeChat] User query:', userContent);

        const { companies, total, entityTypesUsed } = await searchCompaniesForChat(userContent, 5);
        console.log(`[KnowledgeChat] Found ${companies.length} companies (total: ${total})`);
        console.log('[KnowledgeChat] Entity types used for filtering:', entityTypesUsed || 'none');

        if (companies.length > 0) {
          // Log company names and types for debugging
          console.log('[KnowledgeChat] Companies found:', companies.map(c => `${c.name} (${c.type})`).join(', '));

          // Append company results to system prompt with entity type context
          const companyContext = formatCompaniesForContext(companies, entityTypesUsed);
          systemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${companyContext}`;

          // Also inject as assistant context so GPT knows these are real and what type they are
          const typeDescription = entityTypesUsed
            ? `These are ${entityTypesUsed.join('/')} companies.`
            : '';
          companyDataForAssistant = `I found these ${companies.length} real companies in our database that match your query. ${typeDescription} I will ONLY recommend these exact companies and no others.`;
        } else {
          console.log('[KnowledgeChat] No companies found for query');
          // Add explicit instruction when no companies found
          systemPrompt = `${BASE_SYSTEM_PROMPT}\n\n[NO COMPANY RESULTS]\nThe database search returned no matching companies. DO NOT make up or invent any company names. Instead, say "I couldn't find specific companies matching your criteria" and suggest the user visit /search to browse companies manually.`;
        }
      }
    } catch (searchError) {
      console.error('[KnowledgeChat] Company search failed:', searchError);
      // Continue without company results - chatbot will still work with knowledge base
    }

    const openai = new OpenAI({ apiKey });

    // Build messages array
    const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // If we found companies, add a hidden assistant acknowledgment
    if (companyDataForAssistant) {
      // Insert before the last user message
      const lastIndex = chatMessages.length - 1;
      chatMessages.splice(lastIndex, 0, { role: 'assistant', content: companyDataForAssistant });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      max_tokens: 800,
      temperature: 0.3, // Lower temperature for more factual responses
    });

    const assistantMessage = response.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Knowledge Chat API error:', error);

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
      { error: 'Failed to process knowledge chat request' },
      { status: 500 }
    );
  }
}
