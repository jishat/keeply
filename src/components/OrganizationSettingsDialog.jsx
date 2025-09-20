import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export function OrganizationSettingsDialog() {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
    >
      <Settings size={16} />
      Organization settings
    </Button>
  );
}
