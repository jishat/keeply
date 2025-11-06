import { MoreHorizontal, Star, Pencil, Trash2, Clock } from "lucide-react";
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
    const [isEditingInView, setIsEditingInView] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editDescription, setEditDescription] = useState(note.description || '');

    useEffect(() => {
        setEditTitle(note.title);
        setEditDescription(note.description || '');
    }, [note.title, note.description]);

    useEffect(() => {
        if (!isViewModalOpen) {
            setIsEditingInView(false);
            setEditTitle(note.title);
            setEditDescription(note.description || '');
        }
    }, [isViewModalOpen, note.title, note.description]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleNoteClick = () => {
        setIsViewModalOpen(true);
    };

    const handleEdit = () => {
        setIsEditingInView(true);
    };

    const handleCancelEdit = () => {
        setIsEditingInView(false);
        setEditTitle(note.title);
        setEditDescription(note.description || '');
    };

    const handleSaveEdit = () => {
        if (onEdit) {
            onEdit(note.id, { title: editTitle, description: editDescription });
        }
        setIsEditingInView(false);
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

    const truncateTitle = (title) => {
        if (!title) return 'Untitled Note';
        if (title.length > 42) {
            return title.substring(0, 42) + '...';
        }
        return title;
    };

    return (
        <div
            className={`relative bg-gray-50 border border-border rounded-lg p-4 hover:shadow-md transition-shadow group ${isDragging ? 'shadow-lg' : ''}`}
            ref={externalIsDragging ? null : setNodeRef}
            style={style}
            {...(externalIsDragging ? {} : attributes)}
        >
            <div
                className="cursor-pointer"
                onClick={externalIsDragging ? undefined : handleNoteClick}
                {...(externalIsDragging ? {} : listeners)}
            >
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-card-foreground text-sm">
                        {truncateTitle(note.title)}
                    </h3>
                    <div className="w-8 h-8"></div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">

                        {note.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(note.lastModified)}
                        </span>
                    </div>
                </div>
            </div>

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

            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader className="mt-3">
                        {isEditingInView ? (
                            <div>
                                <Input
                                    value={editTitle}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 250) {
                                            setEditTitle(value);
                                        }
                                    }}
                                    placeholder="Enter note title"
                                    className="text-xl font-semibold"
                                    maxLength={250}
                                    autoFocus
                                />
                                <p className="text-xs text-muted-foreground mt-1 ml-1">
                                    {editTitle.length}/250 characters
                                </p>
                            </div>
                        ) : (
                            <DialogTitle className="text-xl">{note.title || 'Untitled Note'}</DialogTitle>
                        )}
                    </DialogHeader>
                    <div className="mb-4">
                        {isEditingInView ? (
                            <div>
                                <Textarea
                                    value={editDescription}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 5000) {
                                            setEditDescription(value);
                                        }
                                    }}
                                    placeholder="Enter note description"
                                    rows={10}
                                    className="resize-none"
                                    maxLength={5000}
                                />
                                <p className="text-xs text-muted-foreground mt-1 ml-1">
                                    {editDescription.length}/5000 characters
                                </p>
                            </div>
                        ) : (
                            <div className="prose max-w-none">
                                {note.description ? <p className="text-foreground whitespace-pre-wrap">
                                   { note.description} </p> : <p className="text-muted-foreground whitespace-pre-wrap">
                                    No description provided. </p>}

                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex items-center justify-between!">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(note.lastModified)}
                        </span>
                        <div className="flex gap-2">
                            {isEditingInView ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveEdit}>
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
