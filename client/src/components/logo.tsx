import { useTheme } from "@/components/ui/theme-provider";
import { Brain } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  const { theme } = useTheme();

  // For now using placeholder, will be replaced with actual logos when provided
  const lightLogo = null; // Will be set to light logo path
  const darkLogo = null;  // Will be set to dark logo path

  // Fallback to Brain icon if no logos are provided
  if (!lightLogo || !darkLogo) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
          <Brain className="text-white text-lg" />
        </div>
        {showText && (
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">StudyMind AI</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">AI Learning Companion</p>
          </div>
        )}
      </div>
    );
  }

  // When logos are provided, use this implementation
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={theme === 'dark' ? darkLogo : lightLogo} 
        alt="StudyMind AI Logo" 
        className="w-10 h-10 object-contain"
      />
      {showText && (
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">StudyMind AI</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">AI Learning Companion</p>
        </div>
      )}
    </div>
  );
}