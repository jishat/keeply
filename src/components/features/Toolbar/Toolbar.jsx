import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from '@/components/ui/badge';

export function Toolbar() {
  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b border-b-gray-500/20">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Links</h1>
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
      <div className="h-16 bg-background flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 w-80 bg-muted border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            New Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
