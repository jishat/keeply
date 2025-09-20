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

const spaceItems = [
  { icon: Link2, label: "Links", active: true },
  { icon: StickyNote, label: "Notes", active: false },
];

export function Sidebar() {
  return (
    <div className="w-60 bg-sidebar border-r border-r-gray-500/20 flex flex-col h-screen">
      <div className="p-4 flex items-center gap-2">
        <h2 className="font-bold text-lg">Keeply</h2>
      </div>

      <div className="p-4 flex-1">
        <nav className="space-y-2">
          {spaceItems.map((item, index) => item.active ? (
            <Button
            key={index}
            className="w-full bg-dark justify-start gap-3 hover:bg-gray-800 text-white font-medium cursor-pointer"
          >
            <item.icon size={16} />
            {item.label}
          </Button>
          ): <Button
              key={index}
              variant="ghost"
              className="w-full justify-start gap-3 cursor-pointer"
            >
              <item.icon size={16} />
              {item.label}
            </Button>)}
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