import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { MessageComponent } from "./message";
import { TypingIndicator } from "./typing-indicator";
import { Send, Paperclip, Smile, Mic, Trash2 } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatInterfaceProps {
  currentMode: 'tutor' | 'wellbeing';
  aiName: string;
}

export function ChatInterface({ currentMode, aiName }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // WebSocket connection for real-time features
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      if ((user as any)?.id) {
        socket.send(JSON.stringify({
          type: 'auth',
          userId: (user as any).id,
          aiType: currentMode
        }));
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'typing') {
        setIsTyping(data.isTyping);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [(user as any)?.id, currentMode]);

  // Fetch messages for current mode
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/messages', currentMode],
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/messages', {
        content,
        sender: 'user',
        aiType: currentMode,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', currentMode] });
      setMessage("");
      setIsTyping(false);
    },
    onError: (error) => {
      setIsTyping(false);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setIsTyping(true);
    if (ws) {
      ws.send(JSON.stringify({
        type: 'typing',
        isTyping: true,
        aiType: currentMode
      }));
    }
    
    sendMessageMutation.mutate(message.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [message]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickSuggestions = currentMode === 'tutor' 
    ? ["Explain a concept", "Generate a quiz", "Help with homework"]
    : ["Check my mood", "Stress management tips", "Study-life balance"];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Chat Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <i className={`fas ${currentMode === 'tutor' ? 'fa-graduation-cap' : 'fa-heart'} text-white text-sm`}></i>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {aiName} - {currentMode === 'tutor' ? 'Study Tutor' : 'Wellbeing Companion'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ready to help</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Welcome Message */}
            {(messages as Message[]).length === 0 && (
              <MessageComponent
                message={{
                  id: 'welcome',
                  content: currentMode === 'tutor' 
                    ? `Hi! I'm ${aiName}, your AI study tutor. I'm here to help you learn and understand any topic. What would you like to study today?`
                    : `Hi! I'm ${aiName}, your AI wellbeing companion. I'm here to support your mental health and help you maintain a healthy study-life balance. How are you feeling today?`,
                  sender: 'ai',
                  aiType: currentMode,
                  userId: (user as any)?.id || '',
                  timestamp: new Date(),
                  reactions: null,
                  bookmarked: false,
                }}
                isUser={false}
                aiType={currentMode}
                userImage={(user as any)?.profileImageUrl}
              />
            )}
            
            {(messages as Message[]).map((msg: Message) => (
              <MessageComponent
                key={msg.id}
                message={msg}
                isUser={msg.sender === 'user'}
                aiType={currentMode}
                userImage={(user as any)?.profileImageUrl}
              />
            ))}
            
            {(isTyping || sendMessageMutation.isPending) && (
              <TypingIndicator aiType={currentMode} />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentMode === 'tutor' 
                ? "Ask me anything about your studies..."
                : "How are you feeling today?"
              }
              className="resize-none min-h-[48px] max-h-32 pr-20"
              rows={1}
            />
            
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <Button variant="ghost" size="sm" className="p-1">
                <Paperclip className="h-4 w-4 text-gray-400" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <Smile className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="p-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setMessage(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
