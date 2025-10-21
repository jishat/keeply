import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Collection } from '../../features/LinkCollection/Collection';
import { TabCard } from '../../features/TabsSidebar';
import { useTabStore } from '../../../stores/tabStore';
import { Button } from '../../ui/button';
// import { OpenTabsSidebar } from '@/components/OpenTabsSidebar';
// import { TabCard } from '@/components/TabCard';
// import { useTabStore, Tab } from '@/store/tabStore';
// import { Button } from '@/components/ui/button';

const Tabs = () => {
  const { collections, openTabs, addCollection, moveTab, reorderTab, reorderCollection } = useTabStore();
  const [activeTab, setActiveTab] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

    // Check if we're dragging a collection
    const activeCollection = collections.find((c) => c.id === activeId);
    const overCollection = collections.find((c) => c.id === overId);

    if (activeCollection && overCollection && active.data.current?.type === 'collection') {
      // Reorder collections
      const oldIndex = collections.findIndex((c) => c.id === activeId);
      const newIndex = collections.findIndex((c) => c.id === overId);
      if (oldIndex !== newIndex) {
        reorderCollection(oldIndex, newIndex);
      }
      return;
    }

    // Find source collection for tab
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

  const handleAddCollection = () => {
    if (newCollectionName.trim()) {
      addCollection(newCollectionName.trim());
      setNewCollectionName('');
      setShowAddInput(false);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-background">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Tab Collections</h1>
            <p className="text-muted-foreground">
              Organize and manage your browser tabs with drag and drop
            </p>
          </div>

          {/* Collections */}
          <div className="space-y-4">
            <SortableContext
              items={collections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {collections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((collection) => (
                <Collection key={collection.id} collection={collection} />
              ))}
            </SortableContext>
          </div>

          {/* Add Collection */}
          <div className="mt-6">
            {showAddInput ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Collection name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCollection();
                    if (e.key === 'Escape') {
                      setShowAddInput(false);
                      setNewCollectionName('');
                    }
                  }}
                  className="flex-1 bg-card border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <Button onClick={handleAddCollection} variant="default">
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setShowAddInput(false);
                    setNewCollectionName('');
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowAddInput(true)}
                variant="outline"
                className="w-full border-dashed hover:border-primary hover:text-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Collection
              </Button>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        {/* <OpenTabsSidebar /> */}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTab ? <TabCard tab={activeTab} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Tabs;
