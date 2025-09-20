import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('Links');

  // Load active menu from localStorage on component mount
  useEffect(() => {
    const savedMenu = localStorage.getItem('keeply-active-menu');
    if (savedMenu && (savedMenu === 'Links' || savedMenu === 'Notes')) {
      setActiveMenu(savedMenu);
    }
  }, []);

  const setMenu = (menuName) => {
    setActiveMenu(menuName);
    // Save to localStorage whenever menu changes
    localStorage.setItem('keeply-active-menu', menuName);
  };

  return (
    <MenuContext.Provider value={{ activeMenu, setMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
