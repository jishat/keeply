import { create } from 'zustand';

export const useTabStore = create((set) => ({
  collections: [
    {
      id: 'general',
      name: 'General',
      isExpanded: true,
      sortOrder: 1,
      tabs: [{
        id: '1',
        title: 'Google',
        description: '',
        url: 'https://www.google.com',
        type: 'link',
        sortOrder: 1,
        favIconUrl: "https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico"
      }],
    },
  ],
  openTabs: [],
  
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
      console.log('movedTab', movedTab)
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
          console.log('movedTab tabs', tabs)
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
    
    return {
      collections: state.collections.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            tabs: collection.tabs.map((tab) =>
              tab.id === tabId ? { ...tab, ...updates } : tab
            ),
          };
        }
        return collection;
      }),
    };
  }),

  deleteTab: (tabId, collectionId) => set((state) => {
    if (collectionId === 'open') {
      return {
        openTabs: state.openTabs.filter((tab) => tab.id !== tabId),
      };
    }
    
    return {
      collections: state.collections.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            tabs: collection.tabs.filter((tab) => tab.id !== tabId),
          };
        }
        return collection;
      }),
    };
  }),
}));
