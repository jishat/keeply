import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TabCard } from './TabCard';
import { X, RefreshCw, Plus } from 'lucide-react';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import LinkItem from '../LinkCollection/internals/LinkItem';
import { useTabStore } from '../../../stores/tabStore';

export function TabsSidebar() {
  const { openTabs, setOpenTabs } = useTabStore();
  const [isLoading, setIsLoading] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: 'open',
  });
  

  const sortedTabs = openTabs.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  console.log('sortedTabs', sortedTabs)
  const loadTabs = async () => {
    setIsLoading(true);
    try {
      const browserTabs = await chrome.tabs.query({ active: false });
      const filtered = browserTabs.filter(tab => tab.url !== "chrome://newtab/");
      setOpenTabs(filtered || []);
    } catch (error) {
      console.error('Error loading tabs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTabs();
  }, []);

  const handleCloseTab = async (tabId) => {
    try {
      await chrome.tabs.remove(tabId);
      // Note: This would need to be handled by the store
    } catch (error) {
      console.error('Error closing tab:', error);
    }
  };

  const handleActivateTab = async (tabId) => {
    try {
      await chrome.tabs.update(tabId, { active: true });
      await chrome.windows.update((await chrome.tabs.get(tabId)).windowId, { focused: true });
    } catch (error) {
      console.error('Error activating tab:', error);
    }
  };

  const handleNewTab = async () => {
    try {
      await chrome.tabs.create({});
      loadTabs(); // Refresh the tabs list
    } catch (error) {
      console.error('Error creating new tab:', error);
    }
  };

  return (
    <div className="w-85 bg-sidebar border-l border-l-gray-500/20 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-b-gray-500/20">
        <div className="flex items-center justify-between mb-0">
          <h2 className="font-semibold text-lg">Open Tabs</h2>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewTab}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadTabs}
              disabled={isLoading}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {sortedTabs.length} tab{sortedTabs.length !== 1 ? 's' : ''} open
        </p>
      </div>

      {/* Tabs List */}
      <div ref={setNodeRef} className={`flex-1 p-4 overflow-x-auto transition-colors ${
          isOver ? 'bg-primary/5' : ''
        }`}>

        <SortableContext
            items={sortedTabs.map((t) => t.id)}
            strategy={rectSortingStrategy}
          >

          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : sortedTabs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-muted-foreground text-sm">No tabs open</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewTab}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Open New Tab
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTabs.map((tab) => (
                  <TabCard key={tab.id} tab={tab} />
                ))}
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
