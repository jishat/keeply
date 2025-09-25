import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@/components/ui/button';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { ThemeSelector } from '@/components/ThemeToggle';
import { OptionsSkeletonLoader } from '@/components/SkeletonLoader';
import '@/styles.css';

const OptionsContent = () => {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    theme: 'light',
    apiKey: ''
  });
  const [saved, setSaved] = useState(false);
  const { isLoading } = useTheme();

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading) {
    return <OptionsSkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 theme-loaded">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h1 className="text-2xl font-semibold text-card-foreground mb-8">Extension Options</h1>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.enableNotifications}
                onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="notifications" className="text-sm font-medium text-foreground">
                Enable notifications
              </label>
            </div>

            <ThemeSelector />

            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-foreground mb-2">
                API Key:
              </label>
              <input
                type="text"
                id="apiKey"
                value={settings.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="Enter your API key"
                className="chrome-extension-input"
              />
            </div>

            <Button 
              onClick={handleSave} 
              className={`px-6 py-3 text-base font-medium mt-4 ${
                saved ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
            >
              {saved ? '✓ Saved!' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('options-root');
const root = createRoot(container);
root.render(
  <ThemeProvider>
    <OptionsContent />
  </ThemeProvider>
);
