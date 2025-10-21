import { create } from 'zustand';

// Mock data
const mockCollections = [
  {
    id: 'movie',
    name: 'Movie',
    isExpanded: true,
    sortOrder: 1,
    tabs: [
      { id: '1', title: 'HDMovie365', url: 'https://hdmovie365.com', favicon: '🎬', sortOrder: 1 },
      { id: '2', title: 'Netflix', url: 'https://netflix.com', favicon: '🎥', sortOrder: 2 },
      { id: '3', title: 'IMDb', url: 'https://imdb.com', favicon: '⭐', sortOrder: 3 },
      { id: '4', title: 'bilibili', url: 'https://imdb.com', favicon: '⭐', sortOrder: 4 },
      { id: '5', title: 'youtube', url: 'https://imdb.com', favicon: '⭐', sortOrder: 5 },
    ],
  },
  {
    id: 'general',
    name: 'General',
    isExpanded: true,
    sortOrder: 2,
    tabs: [
      { id: '6', title: 'GitHub', url: 'https://github.com', favicon: '🐙', sortOrder: 1 },
      { id: '7', title: 'Stack Overflow', url: 'https://stackoverflow.com', favicon: '📚', sortOrder: 2 },
    ],
  },
];

const mockOpenTabs = [
  { id: '101', title: 'Stripe Docs 2', url: 'https://stripe.com/docs', favicon: '💳', sortOrder: 1 },
  { id: '102', title: 'React Docs', url: 'https://react.dev', favicon: '⚛️', sortOrder: 2 },
  { id: '2102', title: 'Tailwind CSS', url: 'https://tailwindcss.com', favicon: '🎨', sortOrder: 3 },
];

export const useTabStore = create((set) => ({
  collections: mockCollections,
  openTabs: mockOpenTabs,
  
  addCollection: (name) => set((state) => {
    const maxSortOrder = state.collections.length > 0 
      ? Math.max(...state.collections.map(c => c.sortOrder || 0)) 
      : 0;
    return {
      collections: [
        ...state.collections,
        {
          id: `collection-${Date.now()}`,
          name,
          isExpanded: true,
          sortOrder: maxSortOrder + 1,
          tabs: [],
        },
      ],
    };
  }),
  
  removeCollection: (id) => set((state) => ({
    collections: state.collections.filter((c) => c.id !== id),
  })),
  
  toggleCollection: (id) => set((state) => ({
    collections: state.collections.map((c) =>
      c.id === id ? { ...c, isExpanded: !c.isExpanded } : c
    ),
  })),
  
  updateCollectionName: (id, name) => set((state) => ({
    collections: state.collections.map((c) =>
      c.id === id ? { ...c, name } : c
    ),
  })),

  reorderCollection: (oldIndex, newIndex) => set((state) => {
    const newCollections = [...state.collections];
    const [movedCollection] = newCollections.splice(oldIndex, 1);
    newCollections.splice(newIndex, 0, movedCollection);
    
    // Update sortOrder for all collections
    const updatedCollections = newCollections.map((collection, index) => ({
      ...collection,
      sortOrder: index + 1
    }));
    
    return { collections: updatedCollections };
  }),
  
  moveTab: (tabId, sourceCollectionId, targetCollectionId, newIndex) => set((state) => {
    let movedTab;
    let newCollections = [...state.collections];
    let newOpenTabs = [...state.openTabs];
    
    // Remove tab from source
    if (sourceCollectionId === 'open') {
      const tabIndex = newOpenTabs.findIndex((t) => t.id === tabId);
      if (tabIndex !== -1) {
        [movedTab] = newOpenTabs.splice(tabIndex, 1);
      }
    } else {
      newCollections = newCollections.map((c) => {
        if (c.id === sourceCollectionId) {
          const tabIndex = c.tabs.findIndex((t) => t.id === tabId);
          if (tabIndex !== -1) {
            const tabs = [...c.tabs];
            [movedTab] = tabs.splice(tabIndex, 1);
            return { ...c, tabs };
          }
        }
        return c;
      });
    }
    
    // Add tab to target
    if (movedTab) {
      newCollections = newCollections.map((c) => {
        if (c.id === targetCollectionId) {
          const tabs = [...c.tabs];
          tabs.splice(newIndex, 0, movedTab);
          
          // Update sortOrder for all tabs in the target collection
          const updatedTabs = tabs.map((tab, index) => ({
            ...tab,
            sortOrder: index + 1
          }));
          
          return { ...c, tabs: updatedTabs };
        }
        return c;
      });
    }
    
    return {
      collections: newCollections,
      openTabs: newOpenTabs,
    };
  }),
  
  reorderTab: (collectionId, oldIndex, newIndex) => set((state) => {
    if (collectionId === 'open') {
      const newOpenTabs = [...state.openTabs];
      const [movedTab] = newOpenTabs.splice(oldIndex, 1);
      newOpenTabs.splice(newIndex, 0, movedTab);
      
      // Update sortOrder for all open tabs
      const updatedOpenTabs = newOpenTabs.map((tab, index) => ({
        ...tab,
        sortOrder: index + 1
      }));
      
      return { openTabs: updatedOpenTabs };
    }
    
    return {
      collections: state.collections.map((c) => {
        if (c.id === collectionId) {
          const tabs = [...c.tabs];
          const [movedTab] = tabs.splice(oldIndex, 1);
          tabs.splice(newIndex, 0, movedTab);
          
          // Update sortOrder for all tabs in the collection
          const updatedTabs = tabs.map((tab, index) => ({
            ...tab,
            sortOrder: index + 1
          }));
          
          return { ...c, tabs: updatedTabs };
        }
        return c;
      }),
    };
  }),
}));
