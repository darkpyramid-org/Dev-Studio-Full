import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CrudDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSave: () => void | Promise<void>;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  saving?: boolean;
  /** onSave owns error reporting; the dialog closes after it resolves when closeOnSuccess is true. */
  closeOnSuccess?: boolean;
  children: React.ReactNode;
}

export function CrudDialog({
  open,
  onOpenChange,
  title,
  onSave,
  onCancel,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  saving = false,
  closeOnSuccess = true,
  children,
}: CrudDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleSave = async () => {
    await onSave();
    if (closeOnSuccess) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
            {cancelLabel}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
