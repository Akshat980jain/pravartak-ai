import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: user 
        ? `Hello ${user.name}! I'm your DBT Assistant. How can I help you with your ${user.role.replace('_', ' ')} tasks today?`
        : "Hello! I'm your DBT Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    const userRole = user?.role;
    
    // Role-specific responses
    if (userRole === "victim_beneficiary") {
      if (lowerMessage.includes("apply") || lowerMessage.includes("application")) {
        return "To apply for DBT benefits, please visit the Apply page and fill out the required forms. You'll need your Aadhaar number and supporting documents.";
      }
      if (lowerMessage.includes("track") || lowerMessage.includes("status")) {
        return "You can track your application status by visiting the Track page and entering your application ID or Aadhaar number.";
      }
      if (lowerMessage.includes("payment") || lowerMessage.includes("fund")) {
        return "Payment processing is handled by authorized financial officers. If you're eligible for disbursement, you'll receive notifications about the payment status.";
      }
    }
    
    if (userRole === "district_officer") {
      if (lowerMessage.includes("verify") || lowerMessage.includes("verification")) {
        return "You can verify applications in your dashboard under the 'Applications' tab. Review documents and forward approved applications to the state level.";
      }
      if (lowerMessage.includes("forward") || lowerMessage.includes("approve")) {
        return "After verification, you can forward applications to the state welfare officer for final approval and sanction.";
      }
    }
    
    if (userRole === "state_welfare_officer") {
      if (lowerMessage.includes("approve") || lowerMessage.includes("sanction")) {
        return "You can approve and sanction applications in your dashboard. Review district officer recommendations and make final decisions.";
      }
      if (lowerMessage.includes("state") || lowerMessage.includes("coverage")) {
        return "You have state-wide access to monitor all applications within your state jurisdiction.";
      }
    }
    
    if (userRole === "financial_officer") {
      if (lowerMessage.includes("payment") || lowerMessage.includes("disburse")) {
        return "You can process payments and fund disbursements in the Payments tab. Review approved applications and initiate transfers.";
      }
      if (lowerMessage.includes("bulk") || lowerMessage.includes("batch")) {
        return "Use the bulk disbursement feature to process multiple payments at once for efficiency.";
      }
    }
    
    if (userRole === "central_ministry_admin") {
      if (lowerMessage.includes("monitor") || lowerMessage.includes("audit")) {
        return "You have nationwide access to monitor all applications, generate reports, and perform system audits.";
      }
      if (lowerMessage.includes("report") || lowerMessage.includes("analytics")) {
        return "Access comprehensive reports and analytics in your dashboard to monitor nationwide DBT performance.";
      }
    }
    
    if (userRole === "grievance_officer") {
      if (lowerMessage.includes("complaint") || lowerMessage.includes("grievance")) {
        return "You can manage complaints and grievances in the Complaints tab. Assign, resolve, and track all user issues.";
      }
      if (lowerMessage.includes("resolve") || lowerMessage.includes("issue")) {
        return "Review complaint details, provide resolutions, and update status in the grievance management system.";
      }
    }
    
    if (userRole === "system_admin") {
      if (lowerMessage.includes("system") || lowerMessage.includes("admin")) {
        return "You have technical access to system administration, API maintenance, and user management features.";
      }
      if (lowerMessage.includes("monitor") || lowerMessage.includes("health")) {
        return "Monitor system health, performance metrics, and technical issues in the System tab.";
      }
    }
    
    if (userRole === "auditor") {
      if (lowerMessage.includes("audit") || lowerMessage.includes("compliance")) {
        return "You have read-only access to audit logs, compliance reports, and system oversight features.";
      }
      if (lowerMessage.includes("report") || lowerMessage.includes("review")) {
        return "Generate audit reports and review compliance status across all system activities.";
      }
    }
    
    // General responses
    if (lowerMessage.includes("login") || lowerMessage.includes("sign in")) {
      return "You can login using your mobile number with OTP or Aadhaar number. Click on the Login button in the navigation menu.";
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "I can help you with role-specific tasks, application processes, tracking, payments, and general information about DBT services. What specific help do you need?";
    }
    
    if (lowerMessage.includes("role") || lowerMessage.includes("permission")) {
      return `Your current role is ${userRole?.replace('_', ' ')}. You have access to specific features based on your role permissions.`;
    }
    
    return "I understand you're asking about DBT services. Could you please be more specific about what you need help with? I can assist with role-specific tasks, applications, tracking, payments, or general information.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <Card className="w-80 h-96 shadow-2xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              DBT Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.sender === "bot" && (
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.text}
                    </div>
                    {message.sender === "user" && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
