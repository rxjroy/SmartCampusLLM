import { BookOpen, Calendar, GraduationCap, Clock, CreditCard, FileText } from "lucide-react";

interface QuickActionsProps {
  onAction: (query: string) => void;
}

const actions = [
  { icon: GraduationCap, label: "My CGPA", query: "What is my current CGPA?" },
  { icon: Calendar, label: "Attendance", query: "Show my attendance percentage" },
  { icon: Clock, label: "Class Schedule", query: "What is my class schedule for today?" },
  { icon: BookOpen, label: "Courses", query: "List my enrolled courses" },
  { icon: CreditCard, label: "Fee Status", query: "What is my fee payment status?" },
  { icon: FileText, label: "Exam Results", query: "Show my latest exam results" },
];

const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onAction(action.query)}
          className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-secondary border border-border rounded-full text-sm font-medium text-foreground transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <action.icon className="w-4 h-4 text-primary" />
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
