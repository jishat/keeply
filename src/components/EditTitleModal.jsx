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

  // Validation: only alphanumeric, hyphen, underscore, ampersand, and spaces
  const isValidTitle = (text) => {
    return /^[a-zA-Z0-9_&\- ]*$/.test(text);
  };

  React.useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle || '');
    }
  }, [isOpen, currentTitle]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow valid characters
    if (isValidTitle(value)) {
      setTitle(value);
    }
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle && isValidTitle(trimmedTitle)) {
      onSave(trimmedTitle);
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

  const isTitleValid = title.trim() && isValidTitle(title.trim());

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
            <p className="text-xs text-muted-foreground">
              Only letters, numbers, hyphens (-), underscores (_), ampersands (&), and spaces are allowed
            </p>
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
