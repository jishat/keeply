import { Folder, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function LinkItem({ item, handleCollectionClick }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      };
    
    return (
        <div
            className={`bg-gray-50 border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group ${isDragging ? 'shadow-lg' : ''}`}
            onClick={() => handleCollectionClick(item)}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                <Folder className="h-5 w-5 text-white" />
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                <h3 className="font-semibold text-card-foreground text-sm">
                    {item.name}
                </h3>
                {item.isStarred && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.itemCount} items</span>
                <span>Updated 2h ago</span>
                </div>
            </div>
        </div>
    );
}
