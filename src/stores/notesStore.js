import { create } from 'zustand';

export const useNotesStore = create((set) => ({
  noteCollections: [],
  
  loadNoteCollections: () => {
    try {
      chrome.storage?.local?.get(['noteCollections'], (result) => {
        if (result && Array.isArray(result.noteCollections)) {
          set({ noteCollections: result.noteCollections });
        } else {
          const defaultCollection = {
            id: `note-collection-${Date.now()}`,
            title: 'General',
            notes: [],
            isExpanded: true,
            sortOrder: 1,
          };
          set({ noteCollections: [defaultCollection] });
        }
      });
    } catch {
      const defaultCollection = {
        id: `note-collection-${Date.now()}`,
        title: 'General',
        notes: [],
        isExpanded: true,
        sortOrder: 1,
      };
      set({ noteCollections: [defaultCollection] });
    }
  },

  addNoteCollection: (title) => set((state) => {
    const maxSortOrder = state.noteCollections.length > 0 
      ? Math.max(...state.noteCollections.map(c => c.sortOrder || 0)) 
      : 0;
    const noteCollections = [
      ...state.noteCollections,
      {
        id: `note-collection-${Date.now()}`,
        title,
        isExpanded: true,
        sortOrder: maxSortOrder + 1,
        notes: [],
      },
    ];
    try { chrome.storage?.local?.set({ noteCollections }); } catch {}
    return { noteCollections };
  }),

  removeNoteCollection: (id) => set((state) => {
    const noteCollections = state.noteCollections.filter((c) => c.id !== id);
    try { chrome.storage?.local?.set({ noteCollections }); } catch {}
    return { noteCollections };
  }),

  updateNoteCollectionTitle: (id, title) => set((state) => {
    const noteCollections = state.noteCollections.map((c) =>
      c.id === id ? { ...c, title } : c
    );
    try { chrome.storage?.local?.set({ noteCollections }); } catch {}
    return { noteCollections };
  }),

  addNote: (collectionId, note) => set((state) => {
    const noteCollections = state.noteCollections.map((collection) => {
      if (collection.id === collectionId) {
        const maxSortOrder = collection.notes.length > 0 
          ? Math.max(...collection.notes.map(n => n.sortOrder || 0)) 
          : 0;
        const newNote = {
          id: `note-${Date.now()}`,
          title: note.title || 'Untitled Note',
          description: note.description || '',
          lastModified: new Date().toISOString(),
          sortOrder: maxSortOrder + 1,
        };
        return {
          ...collection,
          notes: [...collection.notes, newNote],
        };
      }
      return collection;
    });
    try { chrome.storage?.local?.set({ noteCollections }); } catch {}
    return { noteCollections };
  }),

  updateNote: (collectionId, noteId, updates) => set((state) => {
    const noteCollections = state.noteCollections.map((collection) => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          notes: collection.notes.map((note) =>
            note.id === noteId ? { ...note, ...updates, lastModified: new Date().toISOString() } : note
          ),
        };
      }
      return collection;
    });
    try { chrome.storage?.local?.set({ noteCollections }); } catch {}
    return { noteCollections };
  }),

  deleteNote: (collectionId, noteId) => set((state) => {
    const noteCollections = state.noteCollections.map((collection) => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          notes: collection.notes.filter((note) => note.id !== noteId),
        };
      }
      return collection;
    });
    try { chrome.storage?.local?.set({ noteCollections }); } catch {}
    return { noteCollections };
  }),

  moveNote: (noteId, sourceCollectionId, targetCollectionId, newIndex) => set((state) => {
    let movedNote;
    let noteCollections = [...state.noteCollections];

    noteCollections = noteCollections.map((collection) => {
      if (collection.id === sourceCollectionId) {
        const noteIndex = collection.notes.findIndex((n) => n.id === noteId);
        if (noteIndex !== -1) {
          const notes = [...collection.notes];
          [movedNote] = notes.splice(noteIndex, 1);
          return { ...collection, notes };
        }
      }
      return collection;
    });

    if (movedNote) {
      noteCollections = noteCollections.map((collection) => {
        if (collection.id === targetCollectionId) {
          const notes = [...collection.notes];
          const updatedNote = {
            ...movedNote,
            lastModified: new Date().toISOString(),
          };
          notes.splice(newIndex, 0, updatedNote);

          const updatedNotes = notes.map((note, index) => ({
            ...note,
            sortOrder: index + 1
          }));

          return { ...collection, notes: updatedNotes };
        }
        return collection;
      });
    }

    try { chrome.storage?.local?.set({ noteCollections }); } catch {}
    return { noteCollections };
  }),

  reorderNotes: (collectionId, oldIndex, newIndex) => set((state) => {
    const noteCollections = state.noteCollections.map((collection) => {
      if (collection.id === collectionId) {
        const notes = [...collection.notes];
        const [movedNote] = notes.splice(oldIndex, 1);
        notes.splice(newIndex, 0, movedNote);
        
        const updatedNotes = notes.map((note, index) => ({
          ...note,
          sortOrder: index + 1
        }));
        
        return { ...collection, notes: updatedNotes };
      }
      return collection;
    });
    try { chrome.storage?.local?.set({ noteCollections }); } catch {}
    return { noteCollections };
  }),

  reorderNoteCollections: (oldIndex, newIndex) => set((state) => {
    const newCollections = [...state.noteCollections];
    const [movedCollection] = newCollections.splice(oldIndex, 1);
    newCollections.splice(newIndex, 0, movedCollection);
    
    const updatedCollections = newCollections.map((collection, index) => ({
      ...collection,
      sortOrder: index + 1
    }));
    try { chrome.storage?.local?.set({ noteCollections: updatedCollections }); } catch {}
    return { noteCollections: updatedCollections };
  }),
}));

