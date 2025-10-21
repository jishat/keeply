import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Folder, Star, MoreHorizontal, GripVertical } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionHeader } from '@/components/ui/accordion';
import { EditTitleModal } from '@/components/EditTitleModal';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LinkItem from './internals/LinkItem';
import { useTabStore } from '../../../stores/tabStore';

const LinkCollection = ({ 
  id,
  title = 'General', 
  collection, 
  onTitleChange,
  onDelete,
  onCollectionClick,
  onItemEdit,
  onItemDelete,
  className = ''
}) => {
  const { toggleCollection, removeCollection, updateCollectionName } = useTabStore();
  console.log('collection', collection);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(collection.name);

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


  const [accordionTitle, setAccordionTitle] = useState(title);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  // const style = {
  //   transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  //   transition: transition || 'none'
  // }
  

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

  const handleItemEdit = (itemId, updatedData) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, ...updatedData }
          : item
      )
    );
    if (onItemEdit) {
      onItemEdit(itemId, updatedData);
    }
  };

  const handleItemDelete = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    if (onItemDelete) {
      onItemDelete(itemId);
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
    <div className={className} ref={setSortableRef} style={style} >
      <Accordion type="single" collapsible className='mb-4 bg-background'>
        <AccordionItem value="item-1" className="border rounded-lg px-4">
          <AccordionHeader
            draggableIcon={<GripVertical className='text-gray-400' {...attributes} {...listeners} />}
            title={accordionTitle}
            onEditTitle={handleEditTitle}
            onDelete={handleDelete}
          />

          <AccordionContent>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${
            isOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
          }`} ref={setDroppableRef}>

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

export default LinkCollection;
