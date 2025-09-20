import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@/components/ui/button';
import { ButtonDemo } from '@/components/ButtonDemo';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SkeletonLoader } from '@/components/Skeleton';
import '@/styles.css';
import App from './App';



const container = document.getElementById('popup-root');
const root = createRoot(container);
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);