import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, Trash2, Edit2, Check, X, GripVertical } from 'lucide-react';
import { Collection as CollectionType, useTabStore } from '../../../stores/tabStore';
import { Button } from '../../ui/button';
import LinkItem from './internals/LinkItem';
import { TabCard } from './internals/TabCard';

export const Collection = ({ collection }) => {
  const { toggleCollection, removeCollection, updateCollectionName } = useTabStore();
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

  const handleSave = () => {
    if (editedName.trim()) {
      updateCollectionName(collection.id, editedName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(collection.name);
    setIsEditing(false);
  };

  return (
    <div ref={setSortableRef} style={style} className="group rounded-xl bg-[hsl(var(--collection-bg))] border border-border overflow-hidden shadow-md">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border bg-gradient-card">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing hover:text-primary transition-colors">
          <GripVertical className="h-5 w-5" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleCollection(collection.id)}
          className="h-6 w-6 p-0 hover:bg-[hsl(var(--tab-hover))]"
        >
          {collection.isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-6 w-6 p-0 hover:bg-primary/20"
            >
              <Check className="h-3 w-3 text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0 hover:bg-destructive/20"
            >
              <X className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-foreground flex-1">{collection.name}</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {collection.tabs.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-[hsl(var(--tab-hover))]"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCollection(collection.id)}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/20"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </>
        )}
      </div>

      {/* Tabs */}
      {collection.isExpanded && (
        <div
          ref={setDroppableRef}
          className={`p-4 min-h-[120px] overflow-x-auto transition-colors ${
            isOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
          }`}
        >
          <SortableContext
            items={collection.tabs.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((t) => t.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {collection.tabs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm flex-1">
                  Drop tabs here
                </div>
              ) : (
                collection.tabs.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((tab) => <TabCard key={tab.id} tab={tab} />)
              )}
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  );
};
