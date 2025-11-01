import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
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

export default function Toolbar({ onSearchChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { addCollection } = useTabStore();

  // Sanitize: trim and replace multiple spaces with single space
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
      addCollection(sanitizedTitle);
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
      <div className="h-16 bg-background flex items-center justify-between px-6 border-b border-b-gray-500/20 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 w-80 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-2 cursor-pointer" onClick={handleOpenModal}>
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to organize your links.
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