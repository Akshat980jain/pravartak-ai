import { Button } from "@/components/ui/button";
import { Moon, Sun, Type, Languages, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AccessibilityToolbar = () => {
  const [fontSize, setFontSize] = useState(100);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const increaseFontSize = () => {
    if (fontSize < 150) setFontSize(fontSize + 10);
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) setFontSize(fontSize - 10);
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 p-2 bg-card border border-border rounded-lg shadow-large">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setDarkMode(!darkMode)}
        title="Toggle Dark Mode"
        className="w-10 h-10"
      >
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" title="Font Size" className="w-10 h-10">
            <Type className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={increaseFontSize}>
            Increase Size
          </DropdownMenuItem>
          <DropdownMenuItem onClick={decreaseFontSize}>
            Decrease Size
          </DropdownMenuItem>
          <DropdownMenuItem onClick={resetFontSize}>
            Reset Size
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" title="Language" className="w-10 h-10">
            <Languages className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>English</DropdownMenuItem>
          <DropdownMenuItem>हिंदी</DropdownMenuItem>
          <DropdownMenuItem>বাংলা</DropdownMenuItem>
          <DropdownMenuItem>தமிழ்</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="icon" title="Screen Reader" className="w-10 h-10">
        <Volume2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AccessibilityToolbar;
