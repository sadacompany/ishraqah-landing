'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { apiPost } from '@/lib/api-client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type ConversationState = 'chatting' | 'collecting_contact' | 'done';

const GREETING = 'مرحباً بك في إشراقة وعي! كيف يمكنني مساعدتك اليوم؟';

const CONTACT_REGEX =
  /(\b[\w.-]+@[\w.-]+\.\w{2,}\b|\b(?:\+?\d[\d\s\-()]{7,}\d)\b)/;

function extractName(messages: Message[]): string {
  for (const msg of messages) {
    if (msg.role === 'user') {
      const nameMatch = msg.content.match(
        /(?:اسمي|أنا|انا)\s+([^\d,،.]+)/
      );
      if (nameMatch) return nameMatch[1].trim();
    }
  }
  return '';
}

function extractContact(messages: Message[]): string {
  for (const msg of [...messages].reverse()) {
    if (msg.role === 'user') {
      const match = msg.content.match(CONTACT_REGEX);
      if (match) return match[1].trim();
    }
  }
  return '';
}

function hasContactInfo(messages: Message[]): boolean {
  return messages.some(
    (msg) => msg.role === 'user' && CONTACT_REGEX.test(msg.content)
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<ConversationState>('chatting');
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (!initialized) {
      setMessages([{ role: 'assistant', content: GREETING }]);
      setInitialized(true);
    }
  };

  const saveConversation = useCallback(
    async (allMessages: Message[]) => {
      if (saved) return;
      const name = extractName(allMessages);
      const contact = extractContact(allMessages);
      try {
        await apiPost('/api/chat/save', {
          name,
          contact,
          conversation: allMessages,
        });
        setSaved(true);
      } catch (err) {
        console.error('Failed to save chat:', err);
      }
    },
    [saved]
  );

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const { reply } = await apiPost<{ reply: string }>('/api/chat', {
        messages: updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMessage: Message = { role: 'assistant', content: reply };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      if (state === 'chatting' && hasContactInfo(updatedMessages)) {
        setState('collecting_contact');
        await saveConversation(finalMessages);
        setState('done');
      } else if (state === 'collecting_contact' && hasContactInfo(updatedMessages)) {
        await saveConversation(finalMessages);
        setState('done');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          aria-label="افتح المحادثة"
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-bronze text-white shadow-lg hover:bg-bronze-light transition-colors duration-200 flex items-center justify-center"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 left-6 z-50 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-cream-dark/40 flex flex-col overflow-hidden"
          style={{
            animation: 'chatSlideUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div className="bg-bronze text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <span className="font-bold text-sm">إشراقة وعي</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="أغلق المحادثة"
              className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-bronze text-white rounded-bl-sm'
                      : 'bg-cream-warm text-charcoal rounded-br-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-cream-warm text-charcoal-light rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-charcoal-light/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-charcoal-light/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-charcoal-light/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            {saved && (
              <div className="flex justify-center">
                <div className="flex items-center gap-1.5 bg-teal-pale text-teal rounded-full px-3 py-1.5 text-xs font-medium">
                  <svg
                    className="w-4 h-4 text-teal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  تم حفظ بياناتك، ستتواصل معك المختصة قريبًا
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-cream-dark/30 bg-white p-3 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالتك..."
                disabled={loading}
                className="flex-1 bg-cream-warm rounded-xl px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal-light/50 outline-none focus:ring-2 focus:ring-bronze/30 transition-shadow disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="إرسال الرسالة"
                className="w-10 h-10 rounded-xl bg-bronze text-white flex items-center justify-center hover:bg-bronze-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-up animation */}
      <style jsx global>{`
        @keyframes chatSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
