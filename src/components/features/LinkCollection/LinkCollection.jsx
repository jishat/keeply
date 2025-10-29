import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionHeader } from '@/components/ui/accordion';
import { EditTitleModal } from '@/components/EditTitleModal';
import { useDroppable } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LinkItem from './internals/LinkItem';
import { useTabStore } from '../../../stores/tabStore';

const LinkCollection = ({ 
  id,
  collection, 
  onTitleChange,
  onDelete,
  onCollectionClick,
  onItemEdit,
  onItemDelete,
  className = ''
}) => {
  const { removeCollection, updateCollectionName, deleteTab } = useTabStore();

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: collection.id,
    data: { type: 'collection' },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: collection.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditTitle = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveTitle = (newTitle) => {
    // Update in the store
    updateCollectionName(collection.id, newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  const handleDelete = () => {
    // Delete collection from store
    removeCollection(collection.id);
    if (onDelete) {
      onDelete(collection.id);
    }
  };

  const handleCollectionClick = (collection) => {
    if (onCollectionClick) {
      onCollectionClick(collection);
    }
  };

  const handleItemEdit = (itemId, updatedData) => {
    if (onItemEdit) {
      onItemEdit(itemId, collection.id, updatedData);
    }
  };

  const handleItemDelete = (itemId) => {
    // Delete tab from store
    deleteTab(itemId, collection.id);
    if (onItemDelete) {
      onItemDelete(itemId, collection.id);
    }
  };

  return (
    <div className={className} ref={setSortableRef} style={style} >
      <Accordion type="single" collapsible defaultValue={id} className='mb-4 bg-background'>
        <AccordionItem value={id} className="border rounded-lg px-4">
          <AccordionHeader
            draggableIcon={<GripVertical className='text-gray-400' {...attributes} {...listeners} />}
            title={collection.title}
            onEditTitle={handleEditTitle}
            onDelete={handleDelete}
          />

          <AccordionContent>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2 ${
            isOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
          }`} ref={setDroppableRef}>

              {collection.tabs.length > 0 ? (
                <SortableContext
                  items={collection.tabs.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((t) => t.id)}
                  strategy={rectSortingStrategy}
                >
                  {collection.tabs.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((tab) => (
                    <LinkItem 
                      key={tab.id} 
                      tab={tab} 
                      handleCollectionClick={handleCollectionClick}
                      onEdit={handleItemEdit}
                      onDelete={handleItemDelete}
                    />
                  ))}
                </SortableContext>
              ) : (
                <div className="col-span-full flex items-center justify-center h-32 text-center">
                  <p className="text-muted-foreground text-sm">
                    Drop tabs here to organize them
                  </p>
                </div>
              )}
              
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <EditTitleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentTitle={collection.title}
        onSave={handleSaveTitle}
      />
    </div>
  );
};

export default LinkCollection;
