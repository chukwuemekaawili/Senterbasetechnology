import { useState, useRef, useEffect, useCallback } from "react";
import { X, Phone, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatbot } from "./ChatbotContext";
import { ChatMessage, Message } from "./ChatMessage";
import { 
  getInitialMessages, 
  processUserMessage, 
  generateId,
  initialConversationState,
  QUICK_REPLIES,
  QUALIFYING_FLOWS,
} from "./chatbotLogic";

export function ChatbotWindow() {
  const { isOpen, closeChat } = useChatbot();
  const isMobile = useIsMobile();
  const isSmallViewport = typeof window !== "undefined" && window.innerWidth < 768;
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [inputValue, setInputValue] = useState("");
  const [conversationState, setConversationState] = useState(initialConversationState);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const isInitialOpen = useRef(true);

  // Ensure each open starts at the beginning (especially important on mobile)
  useEffect(() => {
    if (!isOpen) {
      isInitialOpen.current = true;
    }
  }, [isOpen]);

  // Auto-scroll to show the latest message from the beginning
  useEffect(() => {
    if (!isOpen) return;

    const container = messagesContainerRef.current;
    const scrollContainerToElStart = (el: Element, behavior: ScrollBehavior) => {
      if (!container || !(el instanceof HTMLElement)) return;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const top = elRect.top - containerRect.top + container.scrollTop;
      container.scrollTo({ top, behavior });
    };

    if (messages.length > 0) {
      const messageElements = document.querySelectorAll('[data-message-id]');
      
      // On initial open, scroll to the first message
      if (isInitialOpen.current) {
        const firstMessageEl = messageElements[0];
        if (firstMessageEl) {
          // Use standards-based behavior values; non-standard values can behave differently across mobile browsers.
          // Double-rAF to wait for layout/keyboard/animation on mobile.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              scrollContainerToElStart(firstMessageEl, "auto");
            });
          });
        }
        isInitialOpen.current = false;
        return;
      }
      
      const lastMessage = messages[messages.length - 1];
      // For bot messages, scroll to show the start of the message
      if (lastMessage.role === "assistant") {
        const lastMessageEl = messageElements[messageElements.length - 1];
        if (lastMessageEl) {
          scrollContainerToElStart(lastMessageEl, "smooth");
          return;
        }
      }
    }
    // Fallback to scrolling to bottom for user messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    // On mobile, auto-focus triggers the virtual keyboard and can force-scroll the chat to the bottom.
    // We intentionally avoid auto-focus on mobile so the greeting stays pinned to the top.
    if (isOpen && !(isMobile || isSmallViewport)) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, isMobile, isSmallViewport]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: text.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Handle special quick replies
    if (text.toLowerCase() === "call now") {
      window.location.href = "tel:+2348064398669";
      setIsTyping(false);
      return;
    }

    if (text.toLowerCase() === "get a quote") {
      // Navigate to contact form with service preselected when known
      const serviceSlug = conversationState.currentCategory 
        ? QUALIFYING_FLOWS[conversationState.currentCategory]?.service 
        : undefined;
      const url = serviceSlug ? `/contact?service=${serviceSlug}` : "/contact";
      window.location.href = url;
      setIsTyping(false);
      return;
    }

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));

    const { response, newState } = processUserMessage(text, conversationState);
    
    setMessages(prev => [...prev, response]);
    setConversationState(newState);
    setIsTyping(false);

    // CRITICAL: Never save placeholder leads. Only save after user explicitly provides
    // real name and phone. Chatbot lead capture happens on /contact form, not here.
    // The chatbot's role is to qualify and direct users to call or fill out the form.
  }, [conversationState]);

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-2rem)] flex flex-col bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-primary-foreground text-sm">
              STIL Assistant
            </h3>
            <p className="text-primary-foreground/70 text-xs">Typically replies instantly</p>
          </div>
        </div>
        <button
          onClick={closeChat}
          className="text-primary-foreground/80 hover:text-primary-foreground p-1 rounded"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Call Now Banner */}
      <a
        href="tel:+2348064398669"
        className="bg-secondary/10 border-b border-border px-4 py-2 flex items-center justify-center gap-2 hover:bg-secondary/20 transition-colors flex-shrink-0"
      >
        <Phone className="w-4 h-4 text-secondary" />
        <span className="font-body text-sm font-medium text-secondary">
          Call 0806 439 8669 for fastest response
        </span>
      </a>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onQuickReply={handleQuickReply}
          />
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Bar */}
      <div className="px-4 py-2 border-t border-border bg-muted/30 flex-shrink-0 overflow-x-auto">
        <div className="flex gap-2">
          {QUICK_REPLIES.slice(0, 4).map((reply) => (
            <button
              key={reply}
              onClick={() => handleQuickReply(reply)}
              className="whitespace-nowrap bg-card border border-border text-foreground font-body text-xs px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border flex-shrink-0">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 font-body text-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim()}
            className="bg-primary hover:bg-primary/90 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
