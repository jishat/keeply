import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="w-9 h-9 p-0"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </Button>
  );
};

export const ThemeSelector = () => {
  const { theme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Theme</label>
      <div className="flex gap-2">
        <Button
          onClick={setLightTheme}
          variant={theme === 'light' ? 'default' : 'outline'}
          size="sm"
        >
          Light
        </Button>
        <Button
          onClick={setDarkTheme}
          variant={theme === 'dark' ? 'default' : 'outline'}
          size="sm"
        >
          Dark
        </Button>
        <Button
          onClick={setSystemTheme}
          variant={theme === 'system' ? 'default' : 'outline'}
          size="sm"
        >
          System
        </Button>
      </div>
    </div>
  );
};
