import { Folder, MoreHorizontal, Star, Edit, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function LinkItem({ item, handleCollectionClick, onEdit, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState(item.name);
    const [editDescription, setEditDescription] = useState(item.description);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      };

    const handleEdit = () => {
        console.log('handleEdit called, opening modal'); // Debug log
        setIsEditModalOpen(true);
        console.log('Modal state set to true'); // Debug log
    };

    const handleSaveEdit = () => {
        if (onEdit) {
            onEdit(item.id, { name: editTitle, description: editDescription });
        }
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(item.id);
        }
    };
    
    return (
        <div
            className={`relative bg-gray-50 border border-border rounded-lg p-4 hover:shadow-md transition-shadow group ${isDragging ? 'shadow-lg' : ''}`}
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            {/* Draggable area - covers most of the card */}
            <div 
                className="cursor-pointer"
                onClick={() => handleCollectionClick(item)}
                {...listeners}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                        <Folder className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-8 h-8"></div> {/* Spacer for dropdown button */}
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-card-foreground text-sm">
                            {item.name}
                        </h3>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                    </p>
                </div>
            </div>

            {/* Non-draggable dropdown area - positioned absolutely */}
            <div className="absolute top-4 right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Edit clicked'); // Debug log
                                handleEdit();
                            }}
                            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Delete clicked'); // Debug log
                                handleDelete();
                            }}
                            className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Collection</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Title
                            </label>
                            <Input
                                id="title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Enter collection title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Enter collection description"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
