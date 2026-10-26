import { useState, type MouseEvent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete item?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
}: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>) => {
    // AlertDialogAction closes itself after click unless its default is prevented.
    event.preventDefault();
    if (deleting) return;
    setDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Keep dialog open on failure so the user knows it failed
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={deleting ? () => {} : onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-sm">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
