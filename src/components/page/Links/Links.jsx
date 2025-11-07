import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTabStore } from '../../../stores/tabStore';
import { useSidebar } from '@/contexts/SidebarContext';
import LinkCollection from '../../features/LinkCollection';
import Toolbar from '../../features/Toolbar';
import { TabCard, TabsSidebar } from '../../features/TabsSidebar';
import LinkItem from '../../features/LinkCollection/internals/LinkItem';
import { useDebounce } from '@/hooks/useDebounce';

export default function Links() {
  const { collections, openTabs, addCollection, moveTab, reorderTab, reorderCollection, updateTab, deleteTab, loadCollections } = useTabStore();
  const { isPopupMode, isTabsSidebarOpen } = useSidebar();
  const [activeTab, setActiveTab] = useState(null);
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
    loadCollections?.();
  }, [loadCollections]);

  const handleDragStart = (event) => {
    const { active } = event;
    const tabId = active.id;

    let foundTab;
    for (const collection of collections) {
      foundTab = collection.tabs.find((t) => t.id === tabId);
      if (foundTab) break;
    }
    if (!foundTab) {
      foundTab = openTabs.find((t) => t.id === tabId);
    }
    setActiveTab(foundTab || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTab(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeCollection = collections.find((c) => c.id === activeId);
    const overCollection = collections.find((c) => c.id === overId);

    if (activeCollection && overCollection && active.data.current?.type === 'collection') {
      const oldIndex = collections.findIndex((c) => c.id === activeId);
      const newIndex = collections.findIndex((c) => c.id === overId);
      if (oldIndex !== newIndex) {
        reorderCollection(oldIndex, newIndex);
      }
      return;
    }

    let sourceCollectionId = 'open';
    for (const collection of collections) {
      if (collection.tabs.some((t) => t.id === activeId)) {
        sourceCollectionId = collection.id;
        break;
      }
    }

    const targetCollection = collections.find((c) => c.id === overId);
    
    if (targetCollection) {
      moveTab(activeId, sourceCollectionId, targetCollection.id, 0);
    } else if (overId === 'open') {
      return;
    } else {
      let targetCollectionId = 'open';
      let targetIndex = 0;

      for (const collection of collections) {
        const index = collection.tabs.findIndex((t) => t.id === overId);
        if (index !== -1) {
          targetCollectionId = collection.id;
          targetIndex = index;
          break;
        }
      }

      if (targetCollectionId === 'open') {
        const index = openTabs.findIndex((t) => t.id === overId);
        if (index !== -1) {
          targetIndex = index;
        }
      }

      if (sourceCollectionId === targetCollectionId) {
        const collection = collections.find((c) => c.id === sourceCollectionId);
        if (collection) {
          const oldIndex = collection.tabs.findIndex((t) => t.id === activeId);
          const newIndex = collection.tabs.findIndex((t) => t.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            reorderTab(sourceCollectionId, oldIndex, newIndex);
          }
        } else if (sourceCollectionId === 'open') {
          const oldIndex = openTabs.findIndex((t) => t.id === activeId);
          const newIndex = openTabs.findIndex((t) => t.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            reorderTab('open', oldIndex, newIndex);
          }
        }
      } else {
        if (targetCollectionId !== 'open') {
          moveTab(activeId, sourceCollectionId, targetCollectionId, targetIndex);
        }
      }
    }
  };

  const handleItemEdit = (itemId, collectionId, updatedData) => {
    updateTab(itemId, collectionId, updatedData);
  };

  const handleItemDelete = (itemId, collectionId) => {
    deleteTab(itemId, collectionId);
  };

  const handleSearchChange = (query) => {
    setSearchInput(query);
  };

  const filterCollections = () => {
    if (!searchQuery) {
      return collections;
    }

    return collections.map(collection => {
      const collectionNameMatch = collection.title.toLowerCase().includes(searchQuery);
      
      const filteredTabs = collection.tabs.filter(tab => {
        const titleMatch = tab.title?.toLowerCase().includes(searchQuery);
        const descriptionMatch = tab.description?.toLowerCase().includes(searchQuery);
        const urlMatch = tab.url?.toLowerCase().includes(searchQuery);
        return titleMatch || descriptionMatch || urlMatch;
      });

      if (collectionNameMatch || filteredTabs.length > 0) {
        return {
          ...collection,
          tabs: collectionNameMatch ? collection.tabs : filteredTabs
        };
      }

      return null;
    }).filter(Boolean);
  };

  const filteredCollections = filterCollections();


  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Toolbar onSearchChange={handleSearchChange} />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
            {searchQuery && filteredCollections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground text-lg">
                  No links found matching "{searchInput}"
                </p>
              </div>
            ) : (
              <SortableContext
                items={filteredCollections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredCollections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((collection) => (
                  <LinkCollection
                    key={collection.id}
                    id={collection.id}
                    collection={collection}
                    onItemEdit={handleItemEdit}
                    onItemDelete={handleItemDelete}
                  />
                ))}
              </SortableContext>
            )}
          </div>
        </div>
        <TabsSidebar />
      </div>
      <DragOverlay>
        {activeTab ? activeTab.type === 'link' ? <LinkItem tab={activeTab} isDragging /> : <TabCard tab={activeTab} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
