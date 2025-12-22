'use client';

import { useState, useRef, useEffect } from 'react';
import { BookOpen, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Helper function to render markdown links as clickable Next.js Links
function renderMessageWithLinks(content: string) {
  // Regex to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const linkText = match[1];
    const linkUrl = match[2];

    // Add the link as a clickable element
    parts.push(
      <Link
        key={match.index}
        href={linkUrl}
        className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium"
      >
        {linkText}
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  // If no links found, return original content
  if (parts.length === 0) {
    return content;
  }

  return parts;
}

// Helper function to render markdown bold text
function renderFormattedText(content: string) {
  // First handle links
  const withLinks = renderMessageWithLinks(content);

  // If it's just a string, also handle bold
  if (typeof withLinks === 'string') {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  }

  return withLinks;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi! I'm your **Nutraceutical Industry Expert**. I can help you with:

• **Regulations** - FSSAI, FDA, GMP compliance
• **Supply Chain** - Sourcing, manufacturing, distribution
• **CDMO Insights** - Market trends, pricing, strategies
• **Business Growth** - Sales, targeting, market entry

What would you like to know about the nutraceutical industry?`,
  timestamp: new Date(),
};

export function KnowledgeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get conversation history (excluding welcome message for API)
      const conversationHistory = [...messages, userMessage]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/knowledge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.error || "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Knowledge chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Chat Popup */}
      <div
        className={cn(
          'absolute bottom-20 left-0 w-[400px] max-h-[550px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden',
          'transition-all duration-300 ease-out origin-bottom-left',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Industry Knowledge</h3>
              <p className="text-xs text-purple-200">Nutraceutical Expertise</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[350px] max-h-[400px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 text-purple-600 dark:text-purple-300'
                )}
              >
                {message.role === 'user' ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Bot className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-3 py-2',
                  message.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                )}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {renderFormattedText(message.content)}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the nutraceutical industry..."
              className="flex-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 h-9 w-9"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* "Industry Expert" Popup - only when closed */}
      {!isOpen && (
        <div
          className="absolute bottom-16 left-0 animate-fade-in cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-2 hover:shadow-xl transition-shadow">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
              Industry Expert
            </span>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-14 w-14 rounded-full shadow-lg',
          'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
          'transition-all duration-300 hover:scale-105'
        )}
        size="icon"
        aria-label={isOpen ? 'Close industry knowledge chat' : 'Open industry knowledge chat'}
      >
        <div className="relative">
          <BookOpen
            className={cn(
              'h-6 w-6 text-white transition-all duration-300',
              isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
            )}
          />
          <X
            className={cn(
              'h-6 w-6 text-white absolute inset-0 transition-all duration-300',
              isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
            )}
          />
        </div>
      </Button>
    </div>
  );
}
