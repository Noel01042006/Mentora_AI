import { GraduationCap, Heart } from "lucide-react";

interface TypingIndicatorProps {
  aiType: 'tutor' | 'wellbeing';
}

export function TypingIndicator({ aiType }: TypingIndicatorProps) {
  const AiIcon = aiType === 'tutor' ? GraduationCap : Heart;

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
        <AiIcon className="text-white text-xs" />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
