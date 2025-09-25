import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from '@/components/ui/badge';

export default function Topbar({title="Links"}) {
  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b border-b-gray-500/20">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <Badge variant="secondary" className="text-dashboard-text-secondary">
              16 collections
            </Badge>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
