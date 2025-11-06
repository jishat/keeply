import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(['theme'], (result) => {
      if (result.theme) {
        setTheme(result.theme);
        applyTheme(result.theme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        setTheme(systemTheme);
        applyTheme(systemTheme);
      }
      
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    });
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    chrome.storage.sync.set({ theme: newTheme });
  };

  const setLightTheme = () => {
    setTheme('light');
    applyTheme('light');
    chrome.storage.sync.set({ theme: 'light' });
  };

  const setDarkTheme = () => {
    setTheme('dark');
    applyTheme('dark');
    chrome.storage.sync.set({ theme: 'dark' });
  };

  const setSystemTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    setTheme(systemTheme);
    applyTheme(systemTheme);
    chrome.storage.sync.set({ theme: 'system' });
  };

  const value = {
    theme,
    isLoading,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
