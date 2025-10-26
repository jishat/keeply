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
import { useTabStore } from '../../../stores/tabStore';
import LinkCollection from '../../features/LinkCollection';
import Toolbar from '../../features/Toolbar';
import { TabCard, TabsSidebar } from '../../features/TabsSidebar';
import LinkItem from '../../features/LinkCollection/internals/LinkItem';

export default function Links() {
  const { collections, openTabs, addCollection, moveTab, reorderTab, reorderCollection } = useTabStore();
  const [activeTab, setActiveTab] = useState(null);
  console.log('collections ----', collections)
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
  // const [items, setItems] = useState(itemsMock)
  // console.log('items', items)
  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates
  //   })
  // )

  const handleTitleChange = (newTitle) => {
    console.log('Title changed to:', newTitle);
  };

  const handleDelete = () => {
    console.log('Delete accordion item');
  };

  const handleCollectionClick = (collection) => {
    console.log('Collection clicked:', collection);
  };

  const handleItemEdit = (itemId, updatedData) => {
    console.log('Item edited:', itemId, updatedData);
  };

  const handleItemDelete = (itemId) => {
    console.log('Item deleted:', itemId);
  };

  // const handleDragEnd = (event) => {
  //   const { active, over } = event

  //   if (over && active.id !== over.id) {
  //     setItems((items) => {
  //       const oldIndex = items.findIndex((item) => item.id === active.id);
  //       const newIndex = items.findIndex((item) => item.id === over?.id);
  //       const afterSortedItems = arrayMove(items, oldIndex, newIndex);
        
  //       // Update sortOrder for each item
  //       const sortingItems = afterSortedItems.map((val, i) => {
  //         return { ...val, sortOrder: i + 1 }
  //       });
        
  //       console.log('Sorted items:', sortingItems);
  //       return sortingItems;
  //     });
  //   }
  // }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className='flex'>
        <div className='w-full'>
          <Toolbar />

          <div className="flex-1 p-6 bg-background">
            <SortableContext
              items={collections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {collections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((collection) => (
                <LinkCollection
                  key={collection.id}
                  id={collection.id}
                  title={collection.name}
                  collection={collection}
                  onTitleChange={handleTitleChange}
                  onDelete={handleDelete}
                  onCollectionClick={handleCollectionClick}
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
