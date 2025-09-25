import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

export default function Toolbar() {
  return (
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
  );
}