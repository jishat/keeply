import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Star, MoreHorizontal } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionHeader } from '../../ui/accordion';
import { EditTitleModal } from '@/components/EditTitleModal';
import Toolbar from "@/components/features/Toolbar";

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
  const [accordionTitle, setAccordionTitle] = useState('My Notes');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditTitle = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveTitle = (newTitle) => {
    setAccordionTitle(newTitle);
  };

  const handleDelete = () => {
    // Add delete functionality here
    console.log('Delete accordion item');
  };

  return (
    <div className='w-full'>
      <Toolbar />
      <div className="flex-1 p-6 bg-background">
        <Accordion type="single" collapsible className='mb-4'>
          <AccordionItem value="item-1" className="border rounded-md px-4">
            <AccordionHeader 
              title={accordionTitle}
              onEditTitle={handleEditTitle}
              onDelete={handleDelete}
            />
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {mockNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-50 border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 ${note.color} rounded-lg flex items-center justify-center`}>
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-card-foreground text-sm">
                          {note.title}
                        </h3>
                        {note.isStarred && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {note.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{note.itemCount} notes</span>
                        <span>Updated {note.lastModified}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <EditTitleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentTitle={accordionTitle}
          onSave={handleSaveTitle}
        />
      </div>
    </div>
  );
}
