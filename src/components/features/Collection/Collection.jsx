import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Folder, Star, MoreHorizontal } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionHeader } from '../../ui/accordion';
import { EditTitleModal } from '@/components/EditTitleModal';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import LinkItem from './internals/LinkItem';

const Collection = ({ 
  title = 'General', 
  collections, 
  onTitleChange,
  onDelete,
  onCollectionClick,
  className = ''
}) => {
  const [accordionTitle, setAccordionTitle] = useState(title);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [items, setItems] = useState(collections);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  

  const handleEditTitle = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveTitle = (newTitle) => {
    setAccordionTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleCollectionClick = (collection) => {
    if (onCollectionClick) {
      onCollectionClick(collection);
    }
  };

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className={className}>
      <Accordion type="single" collapsible className='mb-4'>
        <AccordionItem value="item-1" className="border rounded-lg px-4">
          <AccordionHeader 
            title={accordionTitle}
            onEditTitle={handleEditTitle}
            onDelete={handleDelete}
          />
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={rectSortingStrategy}>
                {items.map((item) => (
                  <LinkItem key={item.id} item={item} handleCollectionClick={handleCollectionClick} />
                ))}
              </SortableContext>
            </DndContext>
              
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
  );
};

export default Collection;
