import React from 'react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from '@/components/ui/badge';

export default function Topbar({title="Links", collectionsCount=0}) {
  return (
    <div className="h-16 flex items-center justify-between px-4 border-b border-b-gray-500/20 bg-background flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <Badge variant="secondary" className="text-dashboard-text-secondary">
            {collectionsCount} collections
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
