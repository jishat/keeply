import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sidebar } from "@/components/features/Sidebar/Sidebar";
import { Toolbar } from "@/components/features/Toolbar/Toolbar";
import { CollectionGrid } from "@/components/features/CollectionGrid/CollectionGrid";
import { SkeletonLoader } from "@/components/Skeleton";

const App = () => {
    const [count, setCount] = useState(0);
    const [currentTab, setCurrentTab] = useState(null);
    const { isLoading } = useTheme();
  
    useEffect(() => {
      // Get current tab info
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
          <Toolbar />
          <CollectionGrid />
        </div>
      </div>
      // <div className="w-80 min-h-48 p-4 bg-background text-foreground rounded-lg shadow-lg theme-loaded">
      //   <div className="flex items-center justify-between mb-4">
      //     <h1 className="text-lg font-semibold text-foreground">Keeply</h1>
      //     <ThemeToggle />
      //   </div>
      //   <div className="space-y-3">
      //     <p className="text-muted-foreground">
      //       Current count: <strong className="text-primary">{count}</strong>
      //     </p>
      //     <div className="flex gap-2">
      //       <Button 
      //         onClick={handleIncrement}
      //         className="flex-1"
      //       >
      //         Increment
      //       </Button>
      //       <Button 
      //         onClick={handleSendMessage}
      //         variant="secondary"
      //         className="flex-1"
      //       >
      //         Send Message
      //       </Button>
      //     </div>
      //     {currentTab && (
      //       <div className="mt-4 p-3 bg-muted rounded border-l-4 border-primary">
      //         <p className="text-xs text-muted-foreground break-words">
      //           Current tab: {currentTab.title}
      //         </p>
      //       </div>
      //     )}
          
      //     <div className="mt-6 pt-4 border-t border-border">
      //       <ButtonDemo />
      //     </div>
      //   </div>
      // </div>
    );
  };

  export default App;
