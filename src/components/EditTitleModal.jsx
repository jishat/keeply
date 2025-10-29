import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EditTitleModal({ isOpen, onClose, currentTitle, onSave }) {
  const [title, setTitle] = useState(currentTitle || '');

  // Sanitize: trim and replace multiple spaces with single space
  const sanitize = (text) => {
    return text.trim().replace(/\s+/g, ' ');
  };

  React.useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle || '');
    }
  }, [isOpen, currentTitle]);

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    const sanitizedTitle = sanitize(title);
    if (sanitizedTitle) {
      onSave(sanitizedTitle);
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const isTitleValid = title.trim().replace(/\s+/g, ' ').trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Title</DialogTitle>
          <DialogDescription>
            Update the collection title.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="title">
              Title
            </Label>
            <Input 
              id="title" 
              value={title} 
              onChange={handleInputChange} 
              onKeyDown={handleKeyPress} 
              placeholder="Enter title..." 
              autoFocus 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isTitleValid}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
