import { create } from 'zustand';

export const useTabStore = create((set, get) => ({
  collections: [],
  openTabs: [],
  
  addCollection: (title) => set((state) => {
    const maxSortOrder = state.collections.length > 0 
      ? Math.max(...state.collections.map(c => c.sortOrder || 0)) 
      : 0;
    const collections = [
      ...state.collections,
      {
        id: `collection-${Date.now()}`,
        title,
        isExpanded: true,
        sortOrder: maxSortOrder + 1,
        tabs: [],
      },
    ];
    try { chrome.storage?.local?.set({ collections }); } catch {}
    return { collections };
  }),
  
  removeCollection: (id) => set((state) => {
    const collections = state.collections.filter((c) => c.id !== id);
    try { chrome.storage?.local?.set({ collections }); } catch {}
    return { collections };
  }),
  
  toggleCollection: (id) => set((state) => {
    const collections = state.collections.map((c) =>
      c.id === id ? { ...c, isExpanded: !c.isExpanded } : c
    );
    try { chrome.storage?.local?.set({ collections }); } catch {}
    return { collections };
  }),
  
  updateCollectionName: (id, title) => set((state) => {
    const collections = state.collections.map((c) =>
      c.id === id ? { ...c, title } : c
    );
    try { chrome.storage?.local?.set({ collections }); } catch {}
    return { collections };
  }),

  reorderCollection: (oldIndex, newIndex) => set((state) => {
    const newCollections = [...state.collections];
    const [movedCollection] = newCollections.splice(oldIndex, 1);
    newCollections.splice(newIndex, 0, movedCollection);
    
    // Update sortOrder for all collections
    const updatedCollections = newCollections.map((collection, index) => ({
      ...collection,
      sortOrder: index + 1
    }));
    try { chrome.storage?.local?.set({ collections: updatedCollections }); } catch {}
    return { collections: updatedCollections };
  }),
  
  moveTab: (tabId, sourceCollectionId, targetCollectionId, newIndex) => set((state) => {
    let movedTab;
    let newCollections = [...state.collections];
    let newOpenTabs = [...state.openTabs];

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
          const newTab = { 
            id: `${movedTab.id}`,  
            type: 'link',
            title: movedTab.title,
            description: '',
            url: movedTab.url,
            favIconUrl: movedTab.favIconUrl,
          };
          tabs.splice(newIndex, 0, {...newTab, type: 'link'});

          const updatedTabs = tabs.map((tab, index) => ({
            ...tab,
            sortOrder: index + 1
          }));
          
          return { ...c, tabs: updatedTabs };
        }
        return c;
      });
    }
    
    try { chrome.storage?.local?.set({ collections: newCollections }); } catch {}
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
 
    const collections = state.collections.map((c) => {
      if (c.id === collectionId) {
        const tabs = [...c.tabs];
        const [movedTab] = tabs.splice(oldIndex, 1);
        tabs.splice(newIndex, 0, movedTab);
        
        const updatedTabs = tabs.map((tab, index) => ({
          ...tab,
          sortOrder: index + 1
        }));
        
        return { ...c, tabs: updatedTabs };
      }
      return c;
    });
    try { chrome.storage?.local?.set({ collections }); } catch {}
    return { collections };
  }),

  setOpenTabs: (tabs) => set((state) => {
    // Ensure tabs have proper sortOrder
    const updatedTabs = tabs.map((tab, index) => ({
      ...tab,
      sortOrder: index + 1
    }));
    
    return { openTabs: updatedTabs };
  }),

  updateTab: (tabId, collectionId, updates) => set((state) => {
    if (collectionId === 'open') {
      return {
        openTabs: state.openTabs.map((tab) =>
          tab.id === tabId ? { ...tab, ...updates } : tab
        ),
      };
    }

    const collections = state.collections.map((collection) => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          tabs: collection.tabs.map((tab) =>
            tab.id === tabId ? { ...tab, ...updates } : tab
          ),
        };
      }
      return collection;
    });
    try { chrome.storage?.local?.set({ collections }); } catch {}
    return { collections };
  }),

  deleteTab: (tabId, collectionId) => set((state) => {
    if (collectionId === 'open') {
      return {
        openTabs: state.openTabs.filter((tab) => tab.id !== tabId),
      };
    }
    
    const collections = state.collections.map((collection) => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          tabs: collection.tabs.filter((tab) => tab.id !== tabId),
        };
      }
      return collection;
    });
    try { chrome.storage?.local?.set({ collections }); } catch {}
    return { collections };
  }),

  // Load saved collections from storage
  loadCollections: () => {
    try {
      chrome.storage?.local?.get(['collections'], (result) => {
        if (result && Array.isArray(result.collections)) {
          set({ collections: result.collections });
        } else {
          // Initialize with default collection if none exists
          const defaultCollection = {
            id: `collection-${Date.now()}`,
            title: 'General',
            isExpanded: true,
            sortOrder: 1,
            tabs: [],
          };
          set({ collections: [defaultCollection] });
        }
      });
    } catch {
      // Initialize with default collection if storage fails
      const defaultCollection = {
        id: `collection-${Date.now()}`,
        title: 'General',
        isExpanded: true,
        sortOrder: 1,
        tabs: [],
      };
      set({ collections: [defaultCollection] });
    }
  },
}));
