import { GraduationCap, Sparkles, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  userRole: 'student' | 'teacher' | null;
  onSignOut: () => void;
}

const ChatHeader = ({ userRole, onSignOut }: ChatHeaderProps) => {
  return (
    <header className="gradient-primary text-primary-foreground px-6 py-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center animate-pulse-ring">
              <Sparkles className="w-2.5 h-2.5 text-accent-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SmartCampus</h1>
            <p className="text-sm text-primary-foreground/80">Your AI University Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userRole && (
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 capitalize">
              <User className="w-3 h-3 mr-1" />
              {userRole}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
