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
import LinkCollection from '../../features/LinkCollection';
import Toolbar from '../../features/Toolbar';
import { TabCard, TabsSidebar } from '../../features/TabsSidebar';
import LinkItem from '../../features/LinkCollection/internals/LinkItem';

export default function Links() {
  const { collections, openTabs, addCollection, moveTab, reorderTab, reorderCollection, updateTab, deleteTab, loadCollections } = useTabStore();
  const [activeTab, setActiveTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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

    // Find the tab in collections or open tabs
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

    // Determine if over is a collection or a tab
    const targetCollection = collections.find((c) => c.id === overId);
    
    if (targetCollection) {
      // Dropped on a collection
      moveTab(activeId, sourceCollectionId, targetCollection.id, 0);
    } else if (overId === 'open') {
      // Can't move back to open tabs for now
      return;
    } else {
      // Dropped on another tab - find which collection it belongs to
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

      // If same collection, reorder
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
        // Move to different collection
        if (targetCollectionId !== 'open') {
          moveTab(activeId, sourceCollectionId, targetCollectionId, targetIndex);
        }
      }
    }
  };

  const handleItemEdit = (itemId, collectionId, updatedData) => {
    // Update the tab in the store
    updateTab(itemId, collectionId, updatedData);
  };

  const handleItemDelete = (itemId, collectionId) => {
    // Delete tab from store
    deleteTab(itemId, collectionId);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query.toLowerCase().trim());
  };

  // Filter collections and tabs based on search query
  const filterCollections = () => {
    if (!searchQuery) {
      return collections;
    }

    return collections.map(collection => {
      const collectionNameMatch = collection.title.toLowerCase().includes(searchQuery);
      
      // Filter tabs within the collection
      const filteredTabs = collection.tabs.filter(tab => {
        const titleMatch = tab.title?.toLowerCase().includes(searchQuery);
        const descriptionMatch = tab.description?.toLowerCase().includes(searchQuery);
        const urlMatch = tab.url?.toLowerCase().includes(searchQuery);
        return titleMatch || descriptionMatch || urlMatch;
      });

      // Include collection if name matches or if it has matching tabs
      if (collectionNameMatch || filteredTabs.length > 0) {
        return {
          ...collection,
          tabs: collectionNameMatch ? collection.tabs : filteredTabs
        };
      }

      return null;
    }).filter(Boolean); // Remove null entries
  };

  const filteredCollections = filterCollections();


  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className='flex'>
        <div className='w-full'>
          <Toolbar onSearchChange={handleSearchChange} />

          <div className="flex-1 p-6 bg-background">
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
