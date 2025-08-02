import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentMode, setCurrentMode] = useState<'tutor' | 'wellbeing'>('tutor');
  const [currentView, setCurrentView] = useState('chat');
  const [aiPersonality, setAiPersonality] = useState('encouraging');

  useEffect(() => {
    if (!isLoading && !user) {
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
  }, [user, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const aiName = currentMode === 'tutor' 
    ? ((user as any)?.tutorName || 'Alex')
    : ((user as any)?.wellbeingName || 'Sage');

  const handleModeChange = (mode: 'tutor' | 'wellbeing') => {
    setCurrentMode(mode);
  };

  const handlePersonalityChange = (personality: string) => {
    setAiPersonality(personality);
    // TODO: Save to user preferences
  };

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return (
          <ChatInterface 
            currentMode={currentMode}
            aiName={aiName}
          />
        );
      case 'lessons':
        return (
          <div className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Your completed lessons will appear here.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'quizzes':
        return (
          <div className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Your quiz results and practice tests will appear here.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'progress':
        return (
          <div className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Your learning analytics and progress charts will appear here.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'pomodoro':
        return (
          <div className="flex-1 p-6">
            <PomodoroTimer />
          </div>
        );
      case 'mood':
        return (
          <div className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Mood Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Your mood entries and wellbeing insights will appear here.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'notes':
        return (
          <div className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Your saved notes and bookmarks will appear here.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <ChatInterface 
            currentMode={currentMode}
            aiName={aiName}
          />
        );
    }
  };

  return (
    <div className="h-screen overflow-hidden flex">
      <Sidebar
        currentMode={currentMode}
        onModeChange={handleModeChange}
        onPersonalityChange={handlePersonalityChange}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <MobileMenu
            currentMode={currentMode}
            onModeChange={handleModeChange}
            onPersonalityChange={handlePersonalityChange}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          <Logo showText={false} />
          <ThemeToggle />
        </div>

        {/* Desktop Header with Theme Toggle */}
        <div className="hidden md:flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 justify-end">
          <ThemeToggle />
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
