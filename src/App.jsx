import { useTheme } from "@/contexts/ThemeContext";
import { MenuProvider, useMenu } from "@/contexts/MenuContext";
import Topbar from "@/components/features/Topbar";
import Sidebar from "@/components/features/Sidebar";
import Links from "@/components/page/Links";
import Notes from "@/components/page/Notes";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { useTabStore } from "@/stores/tabStore";

const MainContent = () => {
  const { activeMenu } = useMenu();
  const { isLoading } = useTheme();
  const { collections } = useTabStore();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  // Get collections count based on active menu
  const collectionsCount = activeMenu === 'Links' 
    ? collections.length 
    : 0;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={activeMenu} collectionsCount={collectionsCount} />
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
