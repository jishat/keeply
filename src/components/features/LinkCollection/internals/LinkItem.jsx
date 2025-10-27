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

export default function LinkItem({ tab, isDragging, handleCollectionClick, onEdit, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
      } = useSortable({ id: tab.id });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState(tab.title);
    const [editDescription, setEditDescription] = useState(tab.description);
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };
    
    const isCurrentlyDragging = isDragging || isSortableDragging;
    const getFaviconUrl = (url) => {
        if(url) return url;
    
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="13.5" x2="6" y1="13.5" y2="21"/><line x1="18" x2="21" y1="12" y2="15"/><path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"/><path d="M21 15V5a2 2 0 0 0-2-2H9"/></svg>';
    };

    const truncateTitle = (title) => {
        if (title && title.length > 12) {
            return title.substring(0, 12) + '...';
        }
        return title;
    };
    const truncateDescription = (desc) => {
        if (desc && desc.length > 60) {
            return desc.substring(0, 60) + '...';
        }
        return desc;
    };
    const handleEdit = () => {
        console.log('handleEdit called, opening modal'); // Debug log
        setIsEditModalOpen(true);
        console.log('Modal state set to true'); // Debug log
    };

    const handleSaveEdit = () => {
        if (onEdit) {
            onEdit(tab.id, { name: editTitle, description: editDescription });
        }
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(tab.id);
        }
    };
    
    return (
        <div
            className={`relative bg-gray-50 border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 transition-shadow group ${isCurrentlyDragging ? 'opacity-50 scale-105 shadow-glow z-50' : ''}`}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {/* Draggable area - covers most of the card */}
            <div 
                className="cursor-pointer"
                onClick={() => handleCollectionClick(tab)}
            >
                <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 ${tab.color} rounded-lg flex items-center justify-center`}>
                        <img
                            src={getFaviconUrl(tab?.favIconUrl)}
                            alt=""
                            className="h-auto w-auto"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-card-foreground text-sm">
                            {truncateTitle(tab.title)}
                        </h3>
                    </div>
                    {/* <div className="w-8 h-8"></div> Spacer for dropdown button */}
                </div>
                {tab.description && tab.description !== '' && (
                    <p className="text-xs font-normal text-muted-foreground line-clamp-2 mt-3">
                        {truncateDescription(tab.description)}
                    </p>
                )}
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
