'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Helper function to render markdown links as clickable Next.js Links
function renderMessageWithLinks(content: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const linkText = match[1];
    const linkUrl = match[2];

    parts.push(
      <Link
        key={match.index}
        href={linkUrl}
        className="text-teal-600 dark:text-teal-400 underline hover:text-teal-700 dark:hover:text-teal-300 font-medium"
      >
        {linkText}
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  if (parts.length === 0) {
    return content;
  }

  return parts;
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
  content: "Hi! I'm your NutraConnect assistant. How can I help you today? You can ask me about our features, pricing, how to find suppliers, or anything else about the platform.",
  timestamp: new Date(),
};

export function HelpPageChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive (within the container only)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
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
      const conversationHistory = [...messages, userMessage]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
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
      console.error('Chat error:', error);
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
    <div className="flex flex-col h-[500px] md:h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">NutraConnect Assistant</h3>
          <p className="text-xs text-teal-100">Ask me anything about the platform</p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
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
                'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                message.role === 'user'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              )}
            >
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5',
                message.role === 'user'
                  ? 'bg-teal-500 text-white rounded-br-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
              )}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {renderMessageWithLinks(message.content)}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="bg-teal-500 hover:bg-teal-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
