import { GraduationCap } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in-up">
      <div className="flex-shrink-0 w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-glow">
        <GraduationCap className="w-5 h-5" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/50 typing-dot" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground/50 typing-dot" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground/50 typing-dot" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
