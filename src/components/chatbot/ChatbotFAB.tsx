import { MessageCircle } from "lucide-react";
import { useChatbot } from "./ChatbotContext";

export function ChatbotFAB() {
  const { isOpen, toggleChat } = useChatbot();

  if (isOpen) return null;

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-25" />
    </button>
  );
}
