import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/logo";
import { Brain, GraduationCap, Heart, Sun, Moon, Settings, Flame, Clock, Trophy, MessageCircle, BookOpen, HelpCircle, BarChart3, Smile, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentMode: 'tutor' | 'wellbeing';
  onModeChange: (mode: 'tutor' | 'wellbeing') => void;
  onPersonalityChange: (personality: string) => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentMode, onModeChange, onPersonalityChange, currentView, onViewChange }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [personality, setPersonality] = useState('encouraging');

  const handlePersonalityChange = (value: string) => {
    setPersonality(value);
    onPersonalityChange(value);
  };

  const navItems = [
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'lessons', icon: BookOpen, label: 'Lessons' },
    { id: 'quizzes', icon: HelpCircle, label: 'Quizzes' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'mood', icon: Smile, label: 'Mood Tracking' },
    { id: 'notes', icon: StickyNote, label: 'Notes' },
  ];

  return (
    <div className="hidden md:flex md:w-80 md:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Logo showText={true} />
      </div>

      {/* AI Mode Toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1 relative">
          <div 
            className={cn(
              "absolute top-1 left-1 w-1/2 h-8 bg-white dark:bg-gray-600 rounded-lg shadow-sm transition-transform duration-300",
              currentMode === 'wellbeing' && "transform translate-x-full"
            )}
          />
          <div className="relative flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onModeChange('tutor')}
              className={cn(
                "flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium transition-colors z-10",
                currentMode === 'tutor' 
                  ? "text-primary dark:text-primary" 
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Study Tutor
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onModeChange('wellbeing')}
              className={cn(
                "flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium transition-colors z-10",
                currentMode === 'wellbeing' 
                  ? "text-primary dark:text-primary" 
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              <Heart className="mr-2 h-4 w-4" />
              Wellbeing
            </Button>
          </div>
        </div>
        
        {/* AI Personality Settings */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Personality</label>
          <Select value={personality} onValueChange={handlePersonalityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select personality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="encouraging">Encouraging</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="motivational">Motivational</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Today's Progress</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="text-accent text-sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Study Streak</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {(user as any)?.studyStreak || 0} days
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="text-secondary text-sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Study Time</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {Math.floor(((user as any)?.totalStudyTime || 0) / 60)}h {((user as any)?.totalStudyTime || 0) % 60}m
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="text-accent text-sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {(user as any)?.lessonsCompleted || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              currentView === item.id && "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
            )}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <img 
            src={(user as any)?.profileImageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {(user as any)?.firstName ? `${(user as any).firstName} ${(user as any)?.lastName || ''}`.trim() : (user as any)?.email || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            <Settings className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
