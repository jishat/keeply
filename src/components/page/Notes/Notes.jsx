import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Toolbar from "@/components/features/Toolbar";
import NoteCollection from '@/components/features/NoteCollection';
import { useNotesStore } from '@/stores/notesStore';
import NoteItem from '@/components/features/NoteCollection/internals/NoteItem';

export default function Notes() {
  const { 
    noteCollections, 
    loadNoteCollections, 
    updateNoteCollectionTitle, 
    removeNoteCollection,
    updateNote,
    deleteNote,
    addNote,
    moveNote,
    reorderNotes,
    reorderNoteCollections
  } = useNotesStore();
  const [activeNote, setActiveNote] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadNoteCollections();
  }, [loadNoteCollections]);

  const handleTitleChange = (collectionId, newTitle) => {
    updateNoteCollectionTitle(collectionId, newTitle);
  };

  const handleDelete = (collectionId) => {
    removeNoteCollection(collectionId);
  };

  const handleNoteEdit = (collectionId, noteId, updatedData) => {
    updateNote(collectionId, noteId, updatedData);
  };

  const handleNoteDelete = (collectionId, noteId) => {
    deleteNote(collectionId, noteId);
  };

  const handleNoteAdd = (collectionId, note) => {
    addNote(collectionId, note);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const noteId = active.id;

    // Find the note in collections
    let foundNote;
    for (const collection of noteCollections) {
      foundNote = collection.notes.find((n) => n.id === noteId);
      if (foundNote) break;
    }
    setActiveNote(foundNote || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveNote(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if it's a collection being reordered
    const activeCollection = noteCollections.find((c) => c.id === activeId);
    const overCollection = noteCollections.find((c) => c.id === overId);

    if (activeCollection && overCollection && active.data.current?.type === 'collection') {
      const oldIndex = noteCollections.findIndex((c) => c.id === activeId);
      const newIndex = noteCollections.findIndex((c) => c.id === overId);
      if (oldIndex !== newIndex) {
        reorderNoteCollections(oldIndex, newIndex);
      }
      return;
    }

    // Handle note reordering within collections
    let sourceCollectionId = null;
    for (const collection of noteCollections) {
      if (collection.notes.some((n) => n.id === activeId)) {
        sourceCollectionId = collection.id;
        break;
      }
    }

    if (sourceCollectionId) {
      // Check if dropped on a collection (droppable area)
      const targetCollection = noteCollections.find((c) => c.id === overId);
      
      if (targetCollection && sourceCollectionId !== targetCollection.id) {
        // Moving note to different collection - add at the beginning
        moveNote(activeId, sourceCollectionId, targetCollection.id, 0);
        return;
      } else if (!targetCollection) {
        // Dropped on another note - find which collection it belongs to
        let targetCollectionId = null;
        let targetIndex = 0;

        for (const collection of noteCollections) {
          const index = collection.notes.findIndex((n) => n.id === overId);
          if (index !== -1) {
            targetCollectionId = collection.id;
            targetIndex = index;
            break;
          }
        }

        // If same collection, reorder
        if (sourceCollectionId === targetCollectionId && targetCollectionId) {
          const collection = noteCollections.find((c) => c.id === sourceCollectionId);
          if (collection) {
            const oldIndex = collection.notes.findIndex((n) => n.id === activeId);
            const newIndex = collection.notes.findIndex((n) => n.id === overId);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
              reorderNotes(sourceCollectionId, oldIndex, newIndex);
            }
          }
        } else if (targetCollectionId && sourceCollectionId !== targetCollectionId) {
          // Moving note to different collection at specific index
          moveNote(activeId, sourceCollectionId, targetCollectionId, targetIndex);
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Toolbar />

          <div className="flex-1 overflow-y-auto p-6 bg-background">
            <SortableContext
              items={noteCollections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {noteCollections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((collection) => (
                <NoteCollection
                  key={collection.id}
                  id={collection.id}
                  collectionId={collection.id}
                  title={collection.title}
                  notes={collection.notes}
                  onTitleChange={(newTitle) => handleTitleChange(collection.id, newTitle)}
                  onDelete={() => handleDelete(collection.id)}
                  onNoteAdd={(note) => handleNoteAdd(collection.id, note)}
                  onNoteEdit={(noteId, updatedData) => handleNoteEdit(collection.id, noteId, updatedData)}
                  onNoteDelete={(noteId) => handleNoteDelete(collection.id, noteId)}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeNote ? <NoteItem note={activeNote} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
