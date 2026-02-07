import { MessageCircle, Zap, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/chatbot";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

const features = [
  { icon: Zap, text: "Instant service recommendations" },
  { icon: Clock, text: "Available 24/7" },
  { icon: Shield, text: "Guided by our expertise" },
];

const ChatbotPromo = () => {
  const { openChat } = useChatbot();

  return (
    <section className="py-20 bg-muted/50 relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/pages" label="Edit Content" />
      </div>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-6 h-6 text-secondary" />
                  <span className="font-body text-sm font-medium text-secondary uppercase tracking-wider">
                    AI Assistant
                  </span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Get Instant Answers
                </h2>
                <p className="font-body text-muted-foreground mb-6">
                  Our AI assistant can answer your questions and recommend the right service for your needs—then connect you with our team for a personalized consultation.
                </p>
                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-body text-sm text-foreground">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={openChat}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Chat
                </Button>
              </div>

              {/* Illustration */}
              <div className="relative bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 flex items-center justify-center">
                <div className="space-y-4 w-full max-w-xs">
                  {/* Chat Bubbles */}
                  <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4">
                    <p className="font-body text-sm text-primary-foreground">
                      👋 Hi! I'm STIL's assistant. What brings you here today?
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-secondary text-secondary-foreground font-body text-xs px-3 py-1.5 rounded-full">
                      I need CCTV
                    </span>
                    <span className="bg-secondary text-secondary-foreground font-body text-xs px-3 py-1.5 rounded-full">
                      Solar quote
                    </span>
                    <span className="bg-secondary text-secondary-foreground font-body text-xs px-3 py-1.5 rounded-full">
                      Electrical help
                    </span>
                  </div>
                  <div className="bg-primary-foreground/90 rounded-2xl rounded-tr-none p-4 ml-8">
                    <p className="font-body text-sm text-primary">
                      I'm interested in solar installation for my home.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotPromo;
