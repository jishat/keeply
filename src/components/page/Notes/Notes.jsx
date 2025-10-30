import React from 'react';
import Toolbar from "@/components/features/Toolbar";
import NoteCollection from '@/components/features/NoteCollection';

const mockNotes = [
  {
    id: 1,
    title: 'Meeting Notes',
    content: 'Discussion about project timeline and deliverables...',
    itemCount: 5,
    isStarred: true,
    color: 'bg-yellow-500',
    lastModified: '1h ago'
  },
  {
    id: 2,
    title: 'Ideas & Brainstorming',
    content: 'Random thoughts and creative ideas for the next project...',
    itemCount: 12,
    isStarred: false,
    color: 'bg-pink-500',
    lastModified: '3h ago'
  },
  {
    id: 3,
    title: 'Daily Journal',
    content: 'Today was productive, completed several tasks...',
    itemCount: 8,
    isStarred: true,
    color: 'bg-indigo-500',
    lastModified: '5h ago'
  },
  {
    id: 4,
    title: 'Learning Notes',
    content: 'Key concepts from React and TypeScript tutorials...',
    itemCount: 20,
    isStarred: false,
    color: 'bg-teal-500',
    lastModified: '1d ago'
  }
];

export default function Notes() {
  const handleTitleChange = (newTitle) => {
    // Title change handler
  };

  const handleDelete = () => {
    // Delete handler
  };

  const handleCollectionClick = (collection) => {
    // Collection click handler
  };

  const handleItemEdit = (itemId, updatedData) => {
    // Item edit handler
  };

  const handleItemDelete = (itemId) => {
    // Item delete handler
  };

  return (
    <div className='w-full'>
      <Toolbar />
      <div className="flex-1 p-6 bg-background">
        <NoteCollection
          title="General"
          collections={mockNotes}
          onTitleChange={handleTitleChange}
          onDelete={handleDelete}
          onCollectionClick={handleCollectionClick}
          onItemEdit={handleItemEdit}
          onItemDelete={handleItemDelete}
        />
      </div>
    </div>
  );
}
