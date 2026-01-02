import { cn } from "@/lib/utils";
import { GraduationCap, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in-up",
        isBot ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
          isBot
            ? "gradient-primary text-primary-foreground shadow-glow"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isBot ? (
          <GraduationCap className="w-5 h-5" />
        ) : (
          <User className="w-5 h-5" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
          isBot
            ? "bg-card text-card-foreground rounded-tl-md border border-border"
            : "gradient-primary text-primary-foreground rounded-tr-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p
            className={cn(
              "text-xs mt-1.5",
              isBot ? "text-muted-foreground" : "text-primary-foreground/70"
            )}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
