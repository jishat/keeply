import { useTheme } from "@/contexts/ThemeContext";
import { MenuProvider, useMenu } from "@/contexts/MenuContext";
import Topbar from "@/components/features/Topbar";
import Sidebar from "@/components/features/Sidebar";
import Links from "@/components/page/Links";
import Notes from "@/components/page/Notes";
import { SkeletonLoader } from "@/components/SkeletonLoader";

const MainContent = () => {
  const { activeMenu } = useMenu();
  const { isLoading } = useTheme();

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
