import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  // Detect if we're in popup mode (smaller window dimensions)
  const [isPopupMode, setIsPopupMode] = useState(false);
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);
  const [isTabsSidebarOpen, setIsTabsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if we're in popup mode based on window dimensions
    // Popups are typically smaller than 800px wide
    const checkPopupMode = () => {
      const isPopup = window.innerWidth < 800 || window.innerHeight < 600;
      setIsPopupMode(isPopup);
    };

    checkPopupMode();
    window.addEventListener('resize', checkPopupMode);
    
    return () => window.removeEventListener('resize', checkPopupMode);
  }, []);

  // Set initial sidebar state based on popup mode
  useEffect(() => {
    if (isPopupMode) {
      // In popup mode, start with sidebars closed
      setIsMainSidebarOpen(false);
      setIsTabsSidebarOpen(false);
    } else {
      // In new tab mode, keep sidebars open
      setIsMainSidebarOpen(true);
      setIsTabsSidebarOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopupMode]);

  const toggleMainSidebar = () => {
    setIsMainSidebarOpen(prev => !prev);
  };

  const toggleTabsSidebar = () => {
    setIsTabsSidebarOpen(prev => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        isPopupMode,
        isMainSidebarOpen,
        isTabsSidebarOpen,
        toggleMainSidebar,
        toggleTabsSidebar,
        setIsMainSidebarOpen,
        setIsTabsSidebarOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

