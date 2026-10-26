import { toast } from "sonner";
import type { ForgeState } from "./types";

/**
 * Configuration options for generating standardized CRUD actions.
 *
 * @template S - The Zustand store state type.
 * @template T - The entity item type (must contain an `id: string` field).
 * @template Payload - The API payload type sent to the upsert endpoint (defaults to T).
 */
interface CrudConfig<S, T extends { id: string }, Payload = T> {
  /** Human-readable label representing the entity (e.g., "Agent", "Prompt", "Item") used in notifications. */
  label: string;
  /** Selector function to retrieve the entity array from the store state. */
  getList: (state: S) => T[];
  /** Reducer helper returning a state partial with the updated entity array. */
  setList: (list: T[]) => Partial<S>;
  /** Async function to persist or update the entity on the backend. */
  apiUpsert: (item: Payload) => Promise<T>;
  /** Async function to delete the entity from the backend by ID. */
  apiDelete: (id: string) => Promise<void>;
  /** Optional transformation function mapping the store entity to the backend API payload. */
  toPayload?: (item: T) => Payload;
}

/**
 * Factory creating reusable, optimistic CRUD operations for Zustand stores.
 *
 * Features:
 * - Optimistic store updates before network latency.
 * - Automatic state rollback to previous snapshot on network or server error.
 * - Sonner toast notifications for user feedback on success and failure.
 * - Direct error rethrow to allow caller components to handle specific failure flows.
 *
 * @param set - Zustand state setter function.
 * @param get - Zustand state getter function.
 * @param config - Configuration mapping store selectors, API calls, and labels.
 */
export function createCrudActions<T extends { id: string }, Payload = T, S = ForgeState>(
  set: (partial: Partial<S> | ((s: S) => Partial<S>)) => void,
  get: () => S,
  config: CrudConfig<S, T, Payload>,
) {
  const { label, getList, setList, apiUpsert, apiDelete, toPayload } = config;

  /**
   * Optimistically inserts or updates an item in the store and synchronizes with the backend.
   *
   * @param item - The entity item to save or update.
   */
  async function upsert(item: T): Promise<void> {
    // Capture snapshot for rollback on failure
    const previous = getList(get());

    // Optimistically update the store state immediately
    set((s) =>
      setList(
        getList(s).some((x) => x.id === item.id)
          ? getList(s).map((x) => (x.id === item.id ? item : x))
          : [item, ...getList(s)],
      ),
    );

    try {
      const payload = toPayload ? toPayload(item) : (item as unknown as Payload);
      const saved = await apiUpsert(payload);

      // If backend assigns a permanent ID replacing a temporary client ID, reconcile it
      if (saved?.id && saved.id !== item.id) {
        set((s) =>
          setList(getList(s).map((x) => (x.id === item.id ? { ...x, id: saved.id } : x))),
        );
      }

      toast.success(`${label} saved!`);
    } catch (err: unknown) {
      // Rollback to pre-upsert state
      set(setList(previous));
      toast.error(`Failed to save: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Optimistically deletes an item by ID from the store and synchronizes with the backend.
   *
   * @param id - Unique identifier of the entity to remove.
   */
  async function remove(id: string): Promise<void> {
    // Capture snapshot for rollback on failure
    const previous = getList(get());

    // Optimistically remove from state
    set((s) => setList(getList(s).filter((x) => x.id !== id)));

    try {
      await apiDelete(id);
      toast.success(`${label} deleted!`);
    } catch (err) {
      // Rollback to pre-deletion state
      set(setList(previous));
      toast.error(`Failed to delete: ${(err as Error).message}`);
      throw err;
    }
  }

  return { upsert, remove };
}
