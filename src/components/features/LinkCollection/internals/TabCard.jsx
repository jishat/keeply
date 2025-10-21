import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';


export const TabCard = ({ tab, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative flex flex-col gap-2 rounded-lg bg-[hsl(var(--tab-bg))] p-3
        border border-border transition-all duration-200 min-w-[200px] max-w-[200px]
        ${isCurrentlyDragging ? 'opacity-50 scale-105 shadow-glow z-50' : 'hover:bg-[hsl(var(--tab-hover))] hover:shadow-md'}
      `}
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="text-xl flex-shrink-0">
          {tab.favicon || '🌐'}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground truncate">
          {tab.title}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {tab.url}
        </div>
      </div>
    </div>
  );
};
