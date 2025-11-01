import { 
  Link2, 
  HelpCircle, 
  StickyNote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMenu } from "@/contexts/MenuContext";

const spaceItems = [
  { icon: Link2, label: "Links", value: "Links" },
  { icon: StickyNote, label: "Notes", value: "Notes" },
];

export default function Sidebar() {
  const { activeMenu, setMenu } = useMenu();
  return (
    <div className="w-60 bg-sidebar border-r border-r-gray-500/20 flex flex-col h-full">
      <div className="p-4 flex items-center gap-2 flex-shrink-0">
        <h2 className="font-bold text-lg">Keeply</h2>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-2">
          {spaceItems.map((item, index) => (
            <Button
              key={index}
              onClick={() => setMenu(item.value)}
              className={`w-full justify-start gap-3 cursor-pointer ${
                activeMenu === item.value
                  ? 'bg-primary-muted hover:bg-gray-800 font-medium'
                  : 'hover:bg-primary-muted'
              }`}
              variant={'ghost'}
            >
              <item.icon size={16} />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 flex-shrink-0">
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