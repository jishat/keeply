import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { MenuProvider, useMenu } from "@/contexts/MenuContext";
import Topbar from "@/components/features/Topbar";
import Sidebar from "@/components/features/Sidebar";
import Links from "@/components/page/Links";
import Notes from "@/components/page/Notes";
import { SkeletonLoader } from "@/components/SkeletonLoader";

const MainContent = () => {
  const { activeMenu } = useMenu();
  const [count, setCount] = useState(0);
  const [currentTab, setCurrentTab] = useState(null);
  const { isLoading } = useTheme();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentTab(tabs[0]);
    });

    // Load saved count from storage
    chrome.storage.local.get(['count'], (result) => {
      setCount(result.count || 0);
    });
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    chrome.storage.local.set({ count: newCount });
  };

  const handleSendMessage = () => {
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, {
        action: 'showAlert',
        message: `Hello from popup! Count: ${count}`
      });
    }
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title={activeMenu} />
        {activeMenu === 'Links' ? <Links /> : <Notes />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <MenuProvider>
      <MainContent />
    </MenuProvider>
  );
};

export default App;
