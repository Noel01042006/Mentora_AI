import { useTheme } from "@/components/ui/theme-provider";
import lightLogoPath from "@assets/Mentora light logo_1754147059545.png";
import darkLogoPath from "@assets/Mentora dark logo_1754147059542.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={theme === 'dark' ? darkLogoPath : lightLogoPath} 
        alt="Mentora Logo" 
        className="w-10 h-10 object-contain"
      />
      {showText && (
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Mentora</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">AI Learning Companion</p>
        </div>
      )}
    </div>
  );
}