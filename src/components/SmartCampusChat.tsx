import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import QuickActions from "./QuickActions";
import TypingIndicator from "./TypingIndicator";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const mockResponses: Record<string, string> = {
  cgpa: `📊 **Your Academic Performance**

Current CGPA: **3.72** / 4.00
Semester GPA: **3.85**
Credits Completed: 96/120

You're doing great! Keep up the excellent work! 🌟`,
  attendance: `📅 **Attendance Summary**

Overall Attendance: **87.5%**

• Data Structures: 92% ✅
• Database Systems: 85% ⚠️
• Operating Systems: 88% ✅
• Software Engineering: 84% ⚠️

Note: Maintain above 75% to be eligible for exams.`,
  schedule: `📚 **Today's Schedule** (Monday)

🕘 09:00 - 10:30 | Data Structures
   📍 Room: CS-201

🕙 11:00 - 12:30 | Database Systems
   📍 Room: CS-Lab 3

🕐 14:00 - 15:30 | Software Engineering
   📍 Room: CS-105

No more classes today! 🎉`,
  courses: `📖 **Enrolled Courses (Fall 2024)**

1. CS-301 Data Structures & Algorithms
2. CS-302 Database Management Systems
3. CS-303 Operating Systems
4. CS-304 Software Engineering
5. GE-201 Technical Communication

Total Credits: 18`,
  fee: `💳 **Fee Payment Status**

Semester: Fall 2024
Total Fee: $4,500

✅ Paid: $3,000 (Installment 1 & 2)
⏳ Due: $1,500 (Installment 3)
📅 Due Date: November 30, 2024

Pay now to avoid late fees!`,
  results: `📝 **Latest Exam Results**

Mid-Term Examinations (Fall 2024)

• Data Structures: 85/100 (A)
• Database Systems: 78/100 (B+)
• Operating Systems: 82/100 (A-)
• Software Engineering: 88/100 (A)

Overall Performance: Excellent! 🏆`,
  default: `I'm here to help you with your academic queries! You can ask me about:

• Your CGPA and grades
• Attendance records
• Class schedules
• Course enrollment
• Fee payment status
• Exam results

What would you like to know?`,
};

const getResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("cgpa") || lowerQuery.includes("grade") || lowerQuery.includes("gpa")) {
    return mockResponses.cgpa;
  }
  if (lowerQuery.includes("attendance") || lowerQuery.includes("present")) {
    return mockResponses.attendance;
  }
  if (lowerQuery.includes("schedule") || lowerQuery.includes("class") || lowerQuery.includes("timetable") || lowerQuery.includes("today")) {
    return mockResponses.schedule;
  }
  if (lowerQuery.includes("course") || lowerQuery.includes("enroll") || lowerQuery.includes("subject")) {
    return mockResponses.courses;
  }
  if (lowerQuery.includes("fee") || lowerQuery.includes("payment") || lowerQuery.includes("due")) {
    return mockResponses.fee;
  }
  if (lowerQuery.includes("result") || lowerQuery.includes("exam") || lowerQuery.includes("mark") || lowerQuery.includes("score")) {
    return mockResponses.results;
  }
  
  return mockResponses.default;
};

const formatTime = (): string => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const SmartCampusChat = () => {
  const { user, userRole, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! 👋 I'm your SmartCampus assistant. I can help you check your attendance, CGPA, class schedule, and more. What would you like to know?",
      isBot: true,
      timestamp: formatTime(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot thinking
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getResponse(text),
      isBot: true,
      timestamp: formatTime(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botResponse]);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <ChatHeader userRole={userRole} onSignOut={handleSignOut} />
      
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 gradient-surface"
      >
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Quick actions to get started
            </p>
            <QuickActions onAction={handleSendMessage} />
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isBot={message.isBot}
            timestamp={message.timestamp}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          <p className="text-xs text-center text-muted-foreground mt-3">
            SmartCampus AI may occasionally provide inaccurate information. Please verify important details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartCampusChat;
