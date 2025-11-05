import { Folder, MoreHorizontal, Star, Pencil, Trash2 } from "lucide-react";
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
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

export default function NoteItem({ note, onEdit, onDelete, isDragging: externalIsDragging }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: note.id });
    
    const isDragging = externalIsDragging || isSortableDragging;

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editDescription, setEditDescription] = useState(note.description || '');

    // Update edit fields when note changes
    useEffect(() => {
        setEditTitle(note.title);
        setEditDescription(note.description || '');
    }, [note.title, note.description]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      };

    const handleNoteClick = () => {
        setIsViewModalOpen(true);
    };

    const handleEdit = () => {
        setIsViewModalOpen(false);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (onEdit) {
            onEdit(note.id, { title: editTitle, description: editDescription });
        }
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(note.id);
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div
            className={`relative bg-gray-50 border border-border rounded-lg p-4 hover:shadow-md transition-shadow group ${isDragging ? 'shadow-lg' : ''}`}
            ref={externalIsDragging ? null : setNodeRef}
            style={style}
            {...(externalIsDragging ? {} : attributes)}
        >
            {/* Draggable area - covers most of the card */}
            <div 
                className="cursor-pointer"
                onClick={externalIsDragging ? undefined : handleNoteClick}
                {...(externalIsDragging ? {} : listeners)}
            >
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-card-foreground text-sm">
                        {note.title || 'Untitled Note'}
                    </h3>
                    <div className="w-8 h-8"></div> {/* Spacer for dropdown button */}
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        
                        {note.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(note.lastModified)}</span>
                    </div>
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

            {/* View Modal - shows title & description */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{note.title || 'Untitled Note'}</DialogTitle>
                        <DialogDescription>
                            {formatDate(note.lastModified)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="prose max-w-none">
                            <p className="text-foreground whitespace-pre-wrap">
                                {note.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsViewModalOpen(false)}
                        >
                            Close
                        </Button>
                        <Button onClick={handleEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal - for editing title & description */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                        <DialogDescription>
                            Update the note title and description.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="edit-title" className="text-sm font-medium">
                                Title
                            </label>
                            <Input
                                id="edit-title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Enter note title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="edit-description" className="text-sm font-medium">
                                Description
                            </label>
                            <Textarea
                                id="edit-description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Enter note description"
                                rows={6}
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
