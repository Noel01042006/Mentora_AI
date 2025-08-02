import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Brain, Sun, Moon } from "lucide-react";
import { Sidebar } from "./sidebar";
import { useTheme } from "@/components/ui/theme-provider";

interface MobileMenuProps {
  currentMode: 'tutor' | 'wellbeing';
  onModeChange: (mode: 'tutor' | 'wellbeing') => void;
  onPersonalityChange: (personality: string) => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function MobileMenu(props: MobileMenuProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="h-full">
            <Sidebar {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
