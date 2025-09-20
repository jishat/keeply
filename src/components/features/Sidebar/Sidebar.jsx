import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Link2, 
  Plus, 
  Star, 
  Folder,
  Users,
  Settings,
  HelpCircle, 
  StickyNote
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SettingModal } from "../SettingModal/SettingModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMenu } from "@/contexts/MenuContext";

const spaceItems = [
  { icon: Link2, label: "Links", value: "Links" },
  { icon: StickyNote, label: "Notes", value: "Notes" },
];

export default function Sidebar() {
  const { activeMenu, setMenu } = useMenu();
  return (
    <div className="w-60 bg-sidebar border-r border-r-gray-500/20 flex flex-col h-screen">
      <div className="p-4 flex items-center gap-2">
        <h2 className="font-bold text-lg">Keeply</h2>
      </div>

      <div className="p-4 flex-1">
        <nav className="space-y-2">
          {spaceItems.map((item, index) => (
            <Button
              key={index}
              onClick={() => setMenu(item.value)}
              className={`w-full justify-start gap-3 cursor-pointer ${
                activeMenu === item.value
                  ? 'bg-dark hover:bg-gray-800 text-white font-medium'
                  : 'hover:bg-sidebar-accent'
              }`}
              variant={activeMenu === item.value ? 'default' : 'ghost'}
            >
              <item.icon size={16} />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <HelpCircle size={16} />
          FAQ
        </Button>
      </div>
    </div>
  );
}