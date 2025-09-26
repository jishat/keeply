import React from 'react';
import { TabsSidebar } from "@/components/features/TabsSidebar";
import Toolbar from "@/components/features/Toolbar";
import LinkCollection from "@/components/features/LinkCollection";

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

export default function Links() {
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

  return (
    <div className='flex'>
      <div className='w-full'>
        <Toolbar />
        <div className="flex-1 p-6 bg-background">
          <LinkCollection
            title="General"
            collections={mockCollections}
            onTitleChange={handleTitleChange}
            onDelete={handleDelete}
            onCollectionClick={handleCollectionClick}
            onItemEdit={handleItemEdit}
            onItemDelete={handleItemDelete}
          />
          <LinkCollection
            title="General"
            collections={mockCollections}
            onTitleChange={handleTitleChange}
            onDelete={handleDelete}
            onCollectionClick={handleCollectionClick}
            onItemEdit={handleItemEdit}
            onItemDelete={handleItemDelete}
          />
        </div>
      </div>
      <TabsSidebar />
    </div>
  );
}
