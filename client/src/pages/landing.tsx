import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain, GraduationCap, Heart, BookOpen, MessageCircle, Target } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Theme Toggle in top-right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <Logo showText={false} className="scale-150" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Mentora
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your dual AI-powered companion for learning and wellbeing. Get personalized tutoring 
            and mental health support all in one intelligent platform.
          </p>
          
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started - It's Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">AI Study Tutor</CardTitle>
              <CardDescription>
                Get personalized explanations, step-by-step problem solving, and interactive lessons on any topic.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-xl">Wellbeing Support</CardTitle>
              <CardDescription>
                Manage stress, track your mood, and get mental health guidance from your AI companion.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Smart Learning</CardTitle>
              <CardDescription>
                Adaptive difficulty, progress tracking, and personalized study recommendations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Real-time Chat</CardTitle>
              <CardDescription>
                Instant responses with typing indicators and seamless conversation flow.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-xl">Progress Tracking</CardTitle>
              <CardDescription>
                Study streaks, performance analytics, and achievement tracking to keep you motivated.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Dual AI Modes</CardTitle>
              <CardDescription>
                Switch seamlessly between Study Tutor and Wellbeing Companion with one click.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of students who are already using Mentora to achieve their academic and personal goals.
              </p>
              <div className="space-y-4">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl w-full sm:w-auto"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Start Learning Today
                </Button>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">or continue with</span>
                  <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                </div>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 w-full sm:w-auto"
                  onClick={() => window.location.href = '/api/login?provider=google'}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
