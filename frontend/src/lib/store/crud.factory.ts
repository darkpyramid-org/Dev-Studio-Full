import { toast } from "sonner";
import type { ForgeState } from "./types";

type SetState = (partial: Partial<ForgeState> | ((s: ForgeState) => Partial<ForgeState>)) => void;
type GetState = () => ForgeState;

interface CrudConfig<T extends { id: string }, Payload = T> {
  label: string;
  getList: (state: ForgeState) => T[];
  setList: (list: T[]) => Partial<ForgeState>;
  apiUpsert: (item: Payload) => Promise<T>;
  apiDelete: (id: string) => Promise<void>;
  toPayload?: (item: T) => Payload;
}

export function createCrudActions<T extends { id: string }, Payload = T>(
  set: SetState,
  get: GetState,
  config: CrudConfig<T, Payload>,
) {
  const { label, getList, setList, apiUpsert, apiDelete, toPayload } = config;

  async function upsert(item: T): Promise<void> {
    const previous = getList(get());
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
      if (saved?.id && saved.id !== item.id) {
        set((s) =>
          setList(getList(s).map((x) => (x.id === item.id ? { ...x, id: saved.id } : x))),
        );
      }
      toast.success(`${label} saved!`);
    } catch (err: unknown) {
      set(setList(previous));
      toast.error(`Failed to save: ${(err as Error).message}`);
    }
  }

  async function remove(id: string): Promise<void> {
    const previous = getList(get());
    set((s) => setList(getList(s).filter((x) => x.id !== id)));
    try {
      await toast.promise(apiDelete(id), {
        loading: `Deleting ${label.toLowerCase()}...`,
        success: `${label} deleted!`,
        error: (err) => `Failed to delete: ${(err as Error).message}`,
      });
    } catch {
      set(setList(previous));
    }
  }

  return { upsert, remove };
}
