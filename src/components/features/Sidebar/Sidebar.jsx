import { useState } from "react";
import { 
  Link2, 
  HelpCircle, 
  StickyNote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMenu } from "@/contexts/MenuContext";
import { useSidebar } from "@/contexts/SidebarContext";
import Logo from "../../logo";
import FAQModal from "../../FAQModal";

const spaceItems = [
  { icon: Link2, label: "Links", value: "Links" },
  { icon: StickyNote, label: "Notes", value: "Notes" },
];

export default function Sidebar() {
  const { activeMenu, setMenu } = useMenu();
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const { isPopupMode, isMainSidebarOpen, setIsMainSidebarOpen } = useSidebar();

  return (
    <>
      {isPopupMode && isMainSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMainSidebarOpen(false)}
        />
      )}
      <div className={`w-48 sm:w-60 bg-background border-r border-r-gray-500/20 flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out ${
        isPopupMode && !isMainSidebarOpen 
          ? '-translate-x-full absolute left-0 z-50' 
          : isPopupMode && isMainSidebarOpen
          ? 'absolute left-0 z-50 shadow-lg'
          : 'translate-x-0'
      }`}>
        <div className="p-3 sm:p-4 flex items-center gap-2 flex-shrink-0">
          <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="font-medium text-base sm:text-lg">keeply</h2>
        </div>

        <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
          <nav className="space-y-2">
            {spaceItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => setMenu(item.value)}
                className={`w-full justify-start gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base ${
                  activeMenu === item.value
                    ? 'bg-primary-muted hover:bg-gray-800 font-medium'
                    : 'hover:bg-primary-muted'
                }`}
                variant={'ghost'}
              >
                <item.icon size={14} className="sm:w-4 sm:h-4" />
                <span className="truncate">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className="p-3 sm:p-4 flex-shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 sm:gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:bg-primary-muted text-sm sm:text-base"
            onClick={() => setIsFAQOpen(true)}
          >
            <HelpCircle size={14} className="sm:w-4 sm:h-4" />
            <span className="truncate">FAQ</span>
          </Button>
        </div>
      </div>
      <FAQModal open={isFAQOpen} onOpenChange={setIsFAQOpen} />
    </>
  );
}