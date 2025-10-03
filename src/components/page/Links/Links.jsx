import React, { useState } from 'react';
import { TabsSidebar } from "@/components/features/TabsSidebar";
import Toolbar from "@/components/features/Toolbar";
import LinkCollection from "@/components/features/LinkCollection";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

const mockCollections = [
  {
    id: 1,
    name: 'Web Development',
    description: 'Resources for web development',
    itemCount: 24,
    isStarred: true,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Design Inspiration',
    description: 'UI/UX design references',
    itemCount: 18,
    isStarred: false,
    color: 'bg-purple-500'
  },
  {
    id: 3,
    name: 'JavaScript Tips',
    description: 'Useful JavaScript snippets',
    itemCount: 32,
    isStarred: true,
    color: 'bg-green-500'
  },
  {
    id: 4,
    name: 'React Patterns',
    description: 'Common React patterns and hooks',
    itemCount: 15,
    isStarred: false,
    color: 'bg-cyan-500'
  },
  {
    id: 5,
    name: 'Design Inspiration',
    description: 'Common React patterns and hooks',
    itemCount: 15,
    isStarred: false,
    color: 'bg-orange-500'
  },
  {
    id: 6,
    name: 'System Design',
    description: 'Common React patterns and hooks',
    itemCount: 15,
    isStarred: false,
    color: 'bg-indigo-500'
  }
];

const itemsMock = [{
  id: 'item-1',
  name: 'Item 1',
  description: 'Description 1',
  sortOrder: 1
},
{
  id: 'item-2',
  name: 'Item 2',
  description: 'Description 2',
  sortOrder: 2
}]

export default function Links() {
  const [items, setItems] = useState(itemsMock)
  console.log('items', items)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

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

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const afterSortedItems = arrayMove(items, oldIndex, newIndex);
        
        // Update sortOrder for each item
        const sortingItems = afterSortedItems.map((val, i) => {
          return { ...val, sortOrder: i + 1 }
        });
        
        console.log('Sorted items:', sortingItems);
        return sortingItems;
      });
    }
  }

  return (
    <div className='flex'>
      <div className='w-full'>
        <Toolbar />

        <div className="flex-1 p-6 bg-background">
          <DndContext
            modifiers={[restrictToParentElement]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <LinkCollection
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  collections={mockCollections}
                  onTitleChange={handleTitleChange}
                  onDelete={handleDelete}
                  onCollectionClick={handleCollectionClick}
                  onItemEdit={handleItemEdit}
                  onItemDelete={handleItemDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
          {/* <LinkCollection
            title="General"
            collections={mockCollections}
            onTitleChange={handleTitleChange}
            onDelete={handleDelete}
            onCollectionClick={handleCollectionClick}
            onItemEdit={handleItemEdit}
            onItemDelete={handleItemDelete}
          /> */}
        </div>
      </div>
      <TabsSidebar />
    </div>
  );
}
