import React from 'react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Topbar({title="Links", collectionsCount=0}) {
  const { isPopupMode, isMainSidebarOpen, toggleMainSidebar } = useSidebar();

  return (
    <div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 border-b border-b-gray-500/20 bg-background flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {isPopupMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMainSidebar}
            className="h-8 w-8 p-0 cursor-pointer flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">{title}</h1>
          <Badge variant="secondary" className="text-dashboard-text-secondary text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
            {collectionsCount} collections
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <ThemeToggle />
      </div>
    </div>
  );
}
