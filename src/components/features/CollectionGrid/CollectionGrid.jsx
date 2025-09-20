import React from 'react';
import { Button } from '@/components/ui/button';
import { Folder, Star, MoreHorizontal } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';

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
  }
];

export function CollectionGrid() {
  return (
    <div className="flex-1 p-6 bg-background">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>General</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${collection.color} rounded-lg flex items-center justify-center`}>
                      <Folder className="h-5 w-5 text-white" />
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
                        {collection.name}
                      </h3>
                      {collection.isStarred && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {collection.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{collection.itemCount} items</span>
                      <span>Updated 2h ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
    </div>
  );
}
