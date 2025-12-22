'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, User, Sparkles, ArrowLeft, RotateCcw, MessageSquare, Trash2, Clock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  getConversationsAction,
  getConversationAction,
  startConversationAction,
  addMessageAction,
  deleteConversationAction,
  ConversationItem,
} from '@/lib/actions/conversations';

function renderFormattedText(content: string) {
  const lines = content.split('\n');

  return lines.map((line, lineIndex) => {
    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');

    const processInline = (text: string): (string | JSX.Element)[] => {
      const parts: (string | JSX.Element)[] = [];
      let remaining = text;
      let keyIndex = 0;

      while (remaining.length > 0) {
        // Match bold text: **text**
        const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
        // Match markdown links: [text](url)
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

        // Find which match comes first
        const boldIndex = boldMatch ? boldMatch.index! : Infinity;
        const linkIndex = linkMatch ? linkMatch.index! : Infinity;

        if (boldIndex < linkIndex && boldMatch) {
          // Process bold first
          if (boldMatch.index! > 0) {
            parts.push(remaining.substring(0, boldMatch.index));
          }
          parts.push(
            <strong key={`bold-${lineIndex}-${keyIndex++}`} className="font-semibold text-teal-600 dark:text-teal-400">
              {boldMatch[1]}
            </strong>
          );
          remaining = remaining.substring(boldMatch.index! + boldMatch[0].length);
        } else if (linkIndex < boldIndex && linkMatch) {
          // Process link first
          if (linkMatch.index! > 0) {
            parts.push(remaining.substring(0, linkMatch.index));
          }
          const linkText = linkMatch[1];
          const linkUrl = linkMatch[2];
          // Check if it's an internal link (starts with /)
          if (linkUrl.startsWith('/')) {
            parts.push(
              <Link
                key={`link-${lineIndex}-${keyIndex++}`}
                href={linkUrl}
                className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
              >
                {linkText}
              </Link>
            );
          } else {
            parts.push(
              <a
                key={`link-${lineIndex}-${keyIndex++}`}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
              >
                {linkText}
              </a>
            );
          }
          remaining = remaining.substring(linkMatch.index! + linkMatch[0].length);
        } else {
          parts.push(remaining);
          break;
        }
      }

      return parts.length > 0 ? parts : [text];
    };

    if (line.trim() === '') {
      return <div key={lineIndex} className="h-3" />;
    }

    return (
      <div key={lineIndex} className={cn(isBullet && 'flex gap-2 ml-1')}>
        {isBullet && <span className="text-teal-500 flex-shrink-0">•</span>}
        <span>{processInline(line.replace(/^[•-]\s*/, ''))}</span>
      </div>
    );
  });
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome! I'm your **Nutraceutical Industry Expert**, powered by NutraConnect's database of **80,000+ verified companies**.

**Ask me anything:**
• "How do I make protein powder?" → I'll suggest raw material suppliers & formulators
• "Find me a CDMO in Mumbai" → I'll show verified contract manufacturers
• "What certifications do I need?" → I'll explain FSSAI, GMP requirements

**I can help with:**
• **Manufacturing** - Connect with suppliers, formulators & CDMOs
• **Regulations** - FSSAI licensing, GMP, certifications
• **Business Strategy** - Market entry, pricing, distribution

Try asking: *"How do I start manufacturing creatine supplements?"*`,
};

function KnowledgePageContent() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const searchParams = useSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Define loadConversations before using it in useEffect
  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const convos = await getConversationsAction();
      setConversations(convos);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Load conversations on mount (for authenticated users)
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, loadConversations]);

  // Load conversation from URL param on mount
  useEffect(() => {
    const conversationId = searchParams.get('c');
    if (conversationId && isAuthenticated && !initialLoadDone) {
      setInitialLoadDone(true);
      // Load conversation from URL
      getConversationAction(conversationId).then((convo) => {
        if (convo) {
          setCurrentConversationId(conversationId);
          setMessages([
            WELCOME_MESSAGE,
            ...convo.messages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
            })),
          ]);
        }
      }).catch((error) => {
        console.error('Failed to load conversation from URL:', error);
      });
    }
  }, [searchParams, isAuthenticated, initialLoadDone]);

  // Update URL when conversation changes
  const updateUrl = useCallback((conversationId: string | null) => {
    if (conversationId) {
      router.replace(`/knowledge?c=${conversationId}`, { scroll: false });
    } else {
      router.replace('/knowledge', { scroll: false });
    }
  }, [router]);

  // Load a conversation by ID
  const loadConversationById = async (conversationId: string) => {
    try {
      const convo = await getConversationAction(conversationId);
      if (convo) {
        setCurrentConversationId(conversationId);
        setMessages([
          WELCOME_MESSAGE,
          ...convo.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          })),
        ]);
        updateUrl(conversationId);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // Use loadConversationById for loading conversations (updates URL)
  const loadConversation = (conversationId: string) => {
    loadConversationById(conversationId);
  };

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || inputValue.trim();
    if (!messageToSend || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const conversationHistory = [...messages, userMessage]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/knowledge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      const data = await response.json();
      const assistantContent = data.message || "Sorry, I couldn't process that. Please try again.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Persist to database if authenticated
      if (isAuthenticated) {
        if (!currentConversationId) {
          // Start new conversation
          const result = await startConversationAction(messageToSend, assistantContent);
          if (result.success && result.conversationId) {
            setCurrentConversationId(result.conversationId);
            updateUrl(result.conversationId); // Update URL with new conversation ID
            loadConversations(); // Refresh sidebar
          }
        } else {
          // Add to existing conversation
          await addMessageAction(currentConversationId, 'user', messageToSend);
          await addMessageAction(currentConversationId, 'assistant', assistantContent);
        }
      }
    } catch (error) {
      console.error('Knowledge chat error:', error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again.",
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setInputValue('');
    setCurrentConversationId(null);
    updateUrl(null); // Clear URL param
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversationAction(conversationId);
      if (currentConversationId === conversationId) {
        setMessages([WELCOME_MESSAGE]);
        setInputValue('');
        setCurrentConversationId(null);
        updateUrl(null); // Clear URL param
      }
      loadConversations();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-gradient-to-b from-teal-600 to-emerald-700 text-white">
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Industry Expert</h1>
              <p className="text-xs text-teal-100">NutraConnect AI</p>
            </div>
          </Link>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleNewConversation}
            variant="outline"
            className="w-full justify-start gap-3 bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <MessageSquare className="h-4 w-4" />
            New Conversation
          </Button>
        </div>

        {/* Conversation History or Login Prompt */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          {isLoading ? (
            <div className="text-sm text-teal-100 text-center py-4">Loading...</div>
          ) : isAuthenticated ? (
            <>
              {conversations.length > 0 && (
                <p className="text-xs text-teal-200 uppercase tracking-wider mb-3">Recent Chats</p>
              )}
              <div className="space-y-1">
                {conversations.map((convo) => (
                  <div
                    key={convo.id}
                    onClick={() => loadConversation(convo.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && loadConversation(convo.id)}
                    className={cn(
                      'w-full flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors text-left group cursor-pointer',
                      currentConversationId === convo.id
                        ? 'bg-white/20 text-white'
                        : 'text-teal-100 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-60" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{convo.title || 'New conversation'}</p>
                      <p className="text-xs opacity-60">{formatDate(convo.updatedAt)}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(convo.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              {conversations.length === 0 && !isLoadingConversations && (
                <div className="bg-white/10 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-white">Try asking:</p>
                  <ul className="text-sm text-teal-100 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-300 mt-0.5">→</span>
                      <span>"How to make protein powder?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-300 mt-0.5">→</span>
                      <span>"Find CDMO in Mumbai"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-300 mt-0.5">→</span>
                      <span>"FSSAI license requirements"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-300 mt-0.5">→</span>
                      <span>"Raw material suppliers for vitamins"</span>
                    </li>
                  </ul>
                  <p className="text-xs text-teal-200 pt-2 border-t border-white/10">
                    80,000+ verified companies
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-white">
                <LogIn className="h-4 w-4" />
                <p className="text-sm font-medium">Sign in to save chats</p>
              </div>
              <p className="text-xs text-teal-100">
                Your conversation history will be saved when you're logged in.
              </p>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white mt-2"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Back to Site */}
        <div className="p-4 border-t border-white/10">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-3 text-teal-100 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
              Back to NutraConnect
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-background">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-background">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-sm">Industry Expert</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleNewConversation}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'mb-6',
                  message.role === 'user' ? 'flex justify-end' : ''
                )}
              >
                <div className={cn(
                  'flex gap-4 max-w-[90%]',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}>
                  {/* Avatar */}
                  <div
                    className={cn(
                      'h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0',
                      message.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-muted text-foreground'
                    )}
                  >
                    <div className="text-[15px] leading-relaxed">
                      {renderFormattedText(message.content)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading */}
            {isSending && (
              <div className="mb-6">
                <div className="flex gap-4">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5 py-2">
                      <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce" />
                      <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about nutraceutical industry..."
                  className="w-full px-4 py-3 pr-12 bg-muted border-0 rounded-xl text-[15px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none min-h-[48px] max-h-[120px]"
                  disabled={isSending}
                  rows={1}
                />
              </div>
              <Button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isSending}
                className="h-12 w-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50"
                size="icon"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              {isAuthenticated
                ? 'Your conversations are automatically saved'
                : 'Sign in to save your conversation history'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Loading fallback for Suspense
function KnowledgePageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <Sparkles className="h-12 w-12 text-teal-600 animate-pulse mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading Industry Expert...</p>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function KnowledgePage() {
  return (
    <Suspense fallback={<KnowledgePageLoading />}>
      <KnowledgePageContent />
    </Suspense>
  );
}
