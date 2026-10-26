import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DeleteDialog } from "@/components/crud/delete-dialog";

describe("DeleteDialog", () => {
  it("renders when open and displays title and description", () => {
    render(
      <DeleteDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Test Item?"
        description="This will be permanently removed."
      />,
    );

    expect(screen.getByText("Delete Test Item?")).toBeInTheDocument();
    expect(screen.getByText("This will be permanently removed.")).toBeInTheDocument();
  });

  it("calls onConfirm and closes dialog on successful deletion", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();

    render(
      <DeleteDialog
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        confirmLabel="Confirm Delete"
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: "Confirm Delete" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("keeps dialog open when onConfirm fails", async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error("Network error"));
    const onOpenChange = vi.fn();

    render(
      <DeleteDialog
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        confirmLabel="Confirm Delete"
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: "Confirm Delete" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    // onOpenChange(false) must NOT be called on failure so user is aware deletion failed
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
