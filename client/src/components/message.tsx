import { format } from "date-fns";
import { Brain, GraduationCap, Heart, Bookmark, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Message } from "@shared/schema";

interface MessageProps {
  message: Message;
  isUser: boolean;
  aiType: 'tutor' | 'wellbeing';
  userImage?: string;
}

export function MessageComponent({ message, isUser, aiType, userImage }: MessageProps) {
  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return format(date, 'h:mm a');
  };

  if (isUser) {
    return (
      <div className="flex items-start space-x-3 justify-end">
        <div className="bg-primary text-white rounded-2xl rounded-tr-md p-4 max-w-md shadow-sm">
          <p>{message.content}</p>
          <span className="text-xs text-blue-200 mt-2 block">
            {formatTime(message.timestamp || new Date())}
          </span>
        </div>
        <img 
          src={userImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"} 
          alt="User" 
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      </div>
    );
  }

  const aiIcon = aiType === 'tutor' ? GraduationCap : Heart;
  const AiIcon = aiIcon;

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
        <AiIcon className="text-white text-xs" />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-md p-4 max-w-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {message.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-900 dark:text-white mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Check if this looks like a lesson */}
          {message.content.toLowerCase().includes('lesson') && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                  📚 Interactive Lesson
                </h4>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
                    Take Quiz
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Bookmark className="mr-1 h-3 w-3" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp || new Date())}
          </span>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="p-1">
              <ThumbsUp className="h-3 w-3 text-gray-400" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <Bookmark className="h-3 w-3 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
