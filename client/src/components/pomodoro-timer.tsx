import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Settings, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface PomodoroSettings {
  workTime: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

export function PomodoroTimer() {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  });

  const [currentSession, setCurrentSession] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYfAzWI0fPSeS0EHnDA8aGVOwkRV6D...'; // Base64 encoded notification sound
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Fallback to browser notification sound
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        
        oscillator.start();
        oscillator.stop(context.currentTime + 0.2);
      });
    }

    if (currentSession === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      if (newSessionsCompleted % settings.longBreakInterval === 0) {
        setCurrentSession('longBreak');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setCurrentSession('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setCurrentSession('work');
      setTimeLeft(settings.workTime * 60);
    }

    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(`${currentSession === 'work' ? 'Work' : 'Break'} session completed!`, {
        body: `Time for a ${currentSession === 'work' ? 'break' : 'work session'}`,
        icon: '/favicon.ico',
      });
    }
  };

  const startTimer = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSession('work');
    setTimeLeft(settings.workTime * 60);
    setSessionsCompleted(0);
  };

  const applySettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    if (!isRunning) {
      if (currentSession === 'work') {
        setTimeLeft(newSettings.workTime * 60);
      } else if (currentSession === 'shortBreak') {
        setTimeLeft(newSettings.shortBreak * 60);
      } else {
        setTimeLeft(newSettings.longBreak * 60);
      }
    }
    setShowSettings(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentSessionTime = (): number => {
    switch (currentSession) {
      case 'work':
        return settings.workTime * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
      default:
        return settings.workTime * 60;
    }
  };

  const progress = ((getCurrentSessionTime() - timeLeft) / getCurrentSessionTime()) * 100;

  const getSessionLabel = (): string => {
    switch (currentSession) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  const getSessionColor = (): string => {
    switch (currentSession) {
      case 'work':
        return 'text-red-500';
      case 'shortBreak':
        return 'text-green-500';
      case 'longBreak':
        return 'text-blue-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Pomodoro Timer</CardTitle>
          <p className="text-muted-foreground">Stay focused and productive with timed work sessions</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className={cn("text-sm font-medium uppercase tracking-wide", getSessionColor())}>
              {getSessionLabel()}
            </div>
            
            <div className="text-6xl font-bold font-mono">
              {formatTime(timeLeft)}
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="text-sm text-muted-foreground">
              Session {sessionsCompleted + 1} • Next: {
                currentSession === 'work' 
                  ? (sessionsCompleted + 1) % settings.longBreakInterval === 0 
                    ? 'Long Break' 
                    : 'Short Break'
                  : 'Focus Time'
              }
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button onClick={startTimer} size="lg" className="px-8">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} size="lg" variant="secondary" className="px-8">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button onClick={resetTimer} size="lg" variant="outline">
              <Square className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button onClick={() => setShowSettings(!showSettings)} size="lg" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              size="lg" 
              variant="outline"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{sessionsCompleted}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {Math.floor(sessionsCompleted / settings.longBreakInterval)}
              </div>
              <div className="text-sm text-muted-foreground">Cycles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {Math.floor((sessionsCompleted * settings.workTime) / 60)}h {(sessionsCompleted * settings.workTime) % 60}m
              </div>
              <div className="text-sm text-muted-foreground">Focus Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <PomodoroSettings 
          settings={settings} 
          onApply={applySettings}
          onCancel={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

interface PomodoroSettingsProps {
  settings: PomodoroSettings;
  onApply: (settings: PomodoroSettings) => void;
  onCancel: () => void;
}

function PomodoroSettings({ settings, onApply, onCancel }: PomodoroSettingsProps) {
  const [workTime, setWorkTime] = useState(settings.workTime);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.longBreak);
  const [longBreakInterval, setLongBreakInterval] = useState(settings.longBreakInterval);

  const handleApply = () => {
    onApply({
      workTime,
      shortBreak,
      longBreak,
      longBreakInterval,
    });
  };

  const presets = [
    { name: 'Classic', work: 25, short: 5, long: 15, interval: 4 },
    { name: 'Short Focus', work: 15, short: 3, long: 10, interval: 3 },
    { name: 'Long Focus', work: 45, short: 10, long: 20, interval: 2 },
    { name: 'Study Session', work: 50, short: 10, long: 30, interval: 3 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setWorkTime(preset.work);
    setShortBreak(preset.short);
    setLongBreak(preset.long);
    setLongBreakInterval(preset.interval);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timer Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Presets */}
        <div>
          <Label className="text-sm font-medium">Quick Presets</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="justify-start"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workTime">Focus Time (minutes)</Label>
            <Input
              id="workTime"
              type="number"
              min="1"
              max="120"
              value={workTime}
              onChange={(e) => setWorkTime(Number(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="shortBreak">Short Break (minutes)</Label>
            <Input
              id="shortBreak"
              type="number"
              min="1"
              max="30"
              value={shortBreak}
              onChange={(e) => setShortBreak(Number(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="longBreak">Long Break (minutes)</Label>
            <Input
              id="longBreak"
              type="number"
              min="5"
              max="60"
              value={longBreak}
              onChange={(e) => setLongBreak(Number(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="longBreakInterval">Long Break Interval</Label>
            <Select value={longBreakInterval.toString()} onValueChange={(value) => setLongBreakInterval(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Every 2 sessions</SelectItem>
                <SelectItem value="3">Every 3 sessions</SelectItem>
                <SelectItem value="4">Every 4 sessions</SelectItem>
                <SelectItem value="5">Every 5 sessions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}