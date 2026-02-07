import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  quickReplies?: string[];
  showCallNow?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onQuickReply?: (reply: string) => void;
}

export function ChatMessage({ message, onQuickReply }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div data-message-id={message.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isAssistant
            ? "bg-muted text-foreground rounded-tl-none"
            : "bg-primary text-primary-foreground rounded-tr-none"
        }`}
      >
        <p className="font-body text-sm whitespace-pre-wrap">{message.content}</p>
        
        {/* Quick Replies */}
        {isAssistant && message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => onQuickReply?.(reply)}
                className="bg-card border border-border text-foreground font-body text-xs px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
        
        {/* Call Now Button */}
        {isAssistant && message.showCallNow && (
          <div className="mt-3">
            <Button
              asChild
              size="sm"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold w-full"
            >
              <a href="tel:+2348064398669" className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
