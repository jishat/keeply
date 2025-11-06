import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GripVertical, Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionHeader } from '@/components/ui/accordion';
import { EditTitleModal } from '@/components/EditTitleModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDroppable } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NoteItem from './internals/NoteItem';

const NoteCollection = ({ 
  id,
  collectionId,
  title = 'General', 
  notes = [], 
  onTitleChange,
  onDelete,
  onNoteAdd,
  onNoteEdit,
  onNoteDelete,
  className = ''
}) => {
  const [accordionTitle, setAccordionTitle] = useState(title);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteDescription, setNewNoteDescription] = useState('');

  useEffect(() => {
    setAccordionTitle(title);
  }, [title]);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: collectionId || id,
    data: { type: 'collection' },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: collectionId || id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEditTitle = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveTitle = (newTitle) => {
    setAccordionTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleNoteEdit = (noteId, updatedData) => {
    if (onNoteEdit) {
      onNoteEdit(noteId, updatedData);
    }
  };

  const handleNoteDelete = (noteId) => {
    if (onNoteDelete) {
      onNoteDelete(noteId);
    }
  };

  const handleAddNote = () => {
    setIsAddNoteModalOpen(true);
  };

  const handleCloseAddNoteModal = () => {
    setIsAddNoteModalOpen(false);
    setNewNoteTitle('');
    setNewNoteDescription('');
  };

  const handleSaveNewNote = () => {
    const sanitizedTitle = newNoteTitle.trim().replace(/\s+/g, ' ');
    if (sanitizedTitle && onNoteAdd) {
      onNoteAdd({
        title: sanitizedTitle,
        description: newNoteDescription.trim(),
      });
      handleCloseAddNoteModal();
    }
  };

  const isNoteValid = newNoteTitle.trim().replace(/\s+/g, ' ').trim().length > 0;

  const collectionValueId = collectionId || id;

  return (
    <div className={className} ref={setSortableRef} style={style}>
      <Accordion type="single" collapsible defaultValue={collectionValueId} className='mb-4 bg-background'>
        <AccordionItem value={collectionValueId} className="border rounded-lg px-4">
          <AccordionHeader
            draggableIcon={<GripVertical className='text-gray-400' {...attributes} {...listeners} />}
            title={accordionTitle}
            onEditTitle={handleEditTitle}
            onDelete={handleDelete}
            onAddNote={handleAddNote}
          />

          <AccordionContent>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2 ${
              isOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
            }`} ref={setDroppableRef}>
              {notes.length > 0 ? (
                <SortableContext
                  items={notes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((n) => n.id)}
                  strategy={rectSortingStrategy}
                >
                  {notes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((note) => (
                    <NoteItem 
                      key={note.id} 
                      note={note} 
                      onEdit={handleNoteEdit}
                      onDelete={handleNoteDelete}
                    />
                  ))}
                </SortableContext>
              ) : (
                <div className="col-span-full flex items-center justify-center h-32 text-center">
                  <p className="text-muted-foreground text-sm">
                    Create notes here to organize them
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <EditTitleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentTitle={accordionTitle}
        onSave={handleSaveTitle}
      />

      <Dialog open={isAddNoteModalOpen} onOpenChange={setIsAddNoteModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Create a new note with title and description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note-title">
                Title
              </Label>
              <Input
                id="note-title"
                value={newNoteTitle}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 250) {
                    setNewNoteTitle(value);
                  }
                }}
                placeholder="Enter note title"
                maxLength={250}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isNoteValid) {
                    handleSaveNewNote();
                  } else if (e.key === 'Escape') {
                    handleCloseAddNoteModal();
                  }
                }}
                autoFocus
              />
              <p className="text-xs text-muted-foreground ml-1">
                {newNoteTitle.length}/250 characters
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note-description">
                Description
              </Label>
              <Textarea
                id="note-description"
                value={newNoteDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 5000) {
                    setNewNoteDescription(value);
                  }
                }}
                placeholder="Enter note description (optional)"
                rows={6}
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground ml-1">
                {newNoteDescription.length}/5000 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddNoteModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewNote} disabled={!isNoteValid}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoteCollection;
