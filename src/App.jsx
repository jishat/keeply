import { useTheme } from "@/contexts/ThemeContext";
import { MenuProvider, useMenu } from "@/contexts/MenuContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Topbar from "@/components/features/Topbar";
import Sidebar from "@/components/features/Sidebar";
import Links from "@/components/page/Links";
import Notes from "@/components/page/Notes";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { useTabStore } from "@/stores/tabStore";
import { useNotesStore } from "@/stores/notesStore";

const MainContent = () => {
  const { activeMenu } = useMenu();
  const { isLoading } = useTheme();
  const { collections } = useTabStore();
  const { noteCollections } = useNotesStore();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  const collectionsCount = activeMenu === 'Links' 
    ? collections.length 
    : activeMenu === 'Notes'
    ? noteCollections.length
    : 0;

  return (
    <div className="w-full h-screen max-w-full max-h-screen bg-background flex overflow-hidden chrome-popup-container relative">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title={activeMenu} collectionsCount={collectionsCount} />
        {activeMenu === 'Links' ? <Links /> : <Notes />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <SidebarProvider>
      <MenuProvider>
        <MainContent />
      </MenuProvider>
    </SidebarProvider>
  );
};

export default App;
