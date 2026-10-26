import { useState, useCallback } from "react";

interface CrudDialogState<T> {
  formOpen: boolean;
  deleteOpen: boolean;
  editing: T | null;
  pendingDeleteId: string | null;
}

interface UseCrudDialogReturn<T> {
  formOpen: boolean;
  deleteOpen: boolean;
  editing: T | null;
  pendingDeleteId: string | null;
  openCreate: () => void;
  openEdit: (item: T) => void;
  openDelete: (id: string) => void;
  closeForm: () => void;
  closeDelete: () => void;
}

export function useCrudDialog<T extends { id: string }>(): UseCrudDialogReturn<T> {
  const [state, setState] = useState<CrudDialogState<T>>({
    formOpen: false,
    deleteOpen: false,
    editing: null,
    pendingDeleteId: null,
  });

  const openCreate = useCallback(() => {
    setState({ formOpen: true, deleteOpen: false, editing: null, pendingDeleteId: null });
  }, []);

  const openEdit = useCallback((item: T) => {
    setState({ formOpen: true, deleteOpen: false, editing: item, pendingDeleteId: null });
  }, []);

  const openDelete = useCallback((id: string) => {
    setState({ formOpen: false, deleteOpen: true, editing: null, pendingDeleteId: id });
  }, []);

  const closeForm = useCallback(() => {
    setState((s) => ({ ...s, formOpen: false, editing: null }));
  }, []);

  const closeDelete = useCallback(() => {
    setState((s) => ({ ...s, deleteOpen: false, pendingDeleteId: null }));
  }, []);

  return {
    formOpen: state.formOpen,
    deleteOpen: state.deleteOpen,
    editing: state.editing,
    pendingDeleteId: state.pendingDeleteId,
    openCreate,
    openEdit,
    openDelete,
    closeForm,
    closeDelete,
  };
}
