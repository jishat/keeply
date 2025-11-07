import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus, PanelRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTabStore } from '@/stores/tabStore';
import { useNotesStore } from '@/stores/notesStore';
import { useMenu } from '@/contexts/MenuContext';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Toolbar({ onSearchChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { addCollection } = useTabStore();
  const { addNoteCollection } = useNotesStore();
  const { activeMenu } = useMenu();
  const { isPopupMode, isTabsSidebarOpen, toggleTabsSidebar } = useSidebar();

  const sanitize = (text) => {
    return text.trim().replace(/\s+/g, ' ');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCollectionTitle('');
  };

  const handleInputChange = (e) => {
    setCollectionTitle(e.target.value);
  };

  const handleSave = () => {
    const sanitizedTitle = sanitize(collectionTitle);
    if (sanitizedTitle) {
      if (activeMenu === 'Notes') {
        addNoteCollection(sanitizedTitle);
      } else {
        addCollection(sanitizedTitle);
      }
      handleCloseModal();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCloseModal();
    }
  };

  const isTitleValid = collectionTitle.trim().replace(/\s+/g, ' ').trim().length > 0;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <>
      <div className="h-14 sm:h-16 bg-background flex items-center justify-between px-3 sm:px-6 border-b border-b-gray-500/20 flex-shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search anything..."
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 w-full max-w-80 border border-input rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {isPopupMode && activeMenu === 'Links' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTabsSidebar}
                className="h-8 w-8 p-0 cursor-pointer"
                aria-label="Toggle tabs sidebar"
                title={isTabsSidebarOpen ? "Hide open tabs" : "Show open tabs"}
              >
                <PanelRight className={`h-4 w-4 ${isTabsSidebarOpen ? '' : 'opacity-50'}`} />
              </Button>
            )}
            <Button size="sm" className="gap-1.5 sm:gap-2 cursor-pointer text-xs sm:text-sm px-2 sm:px-3" onClick={handleOpenModal}>
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sm:inline">{activeMenu === 'Notes' ? 'New Collection' : 'New Collection'}</span>
            </Button>
          </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] w-[400px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
            <DialogDescription>
              {activeMenu === 'Notes' 
                ? 'Create a new collection to organize your notes.'
                : 'Create a new collection to organize your links.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="collection-title" className="">
                Title
              </Label>
              <Input
                id="collection-title"
                value={collectionTitle}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className=""
                placeholder="Enter collection title.."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isTitleValid}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}