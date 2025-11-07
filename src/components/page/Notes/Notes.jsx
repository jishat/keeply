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
import { useDebounce } from '@/hooks/useDebounce';

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
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 400);
  const searchQuery = debouncedSearchInput.toLowerCase().trim();

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

  const handleSearchChange = (query) => {
    setSearchInput(query);
  };

  const filterCollections = () => {
    if (!searchQuery) {
      return noteCollections;
    }

    return noteCollections.map(collection => {
      const collectionNameMatch = collection.title.toLowerCase().includes(searchQuery);
      
      const filteredNotes = collection.notes.filter(note => {
        const titleMatch = note.title?.toLowerCase().includes(searchQuery);
        const descriptionMatch = note.description?.toLowerCase().includes(searchQuery);
        return titleMatch || descriptionMatch;
      });

      if (collectionNameMatch || filteredNotes.length > 0) {
        return {
          ...collection,
          notes: collectionNameMatch ? collection.notes : filteredNotes
        };
      }

      return null;
    }).filter(Boolean);
  };

  const filteredCollections = filterCollections();

  const handleDragStart = (event) => {
    const { active } = event;
    const noteId = active.id;

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

    let sourceCollectionId = null;
    for (const collection of noteCollections) {
      if (collection.notes.some((n) => n.id === activeId)) {
        sourceCollectionId = collection.id;
        break;
      }
    }

    if (sourceCollectionId) {
      const targetCollection = noteCollections.find((c) => c.id === overId);
      
      if (targetCollection && sourceCollectionId !== targetCollection.id) {
        moveNote(activeId, sourceCollectionId, targetCollection.id, 0);
        return;
      } else if (!targetCollection) {
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
          moveNote(activeId, sourceCollectionId, targetCollectionId, targetIndex);
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Toolbar onSearchChange={handleSearchChange} />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
            {searchQuery && filteredCollections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground text-lg">
                  No notes found matching "{searchInput}"
                </p>
              </div>
            ) : (
              <SortableContext
                items={filteredCollections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredCollections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((collection) => (
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
            )}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeNote ? <NoteItem note={activeNote} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
