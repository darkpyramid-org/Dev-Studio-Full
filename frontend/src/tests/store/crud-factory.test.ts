import { describe, it, expect, vi } from "vitest";
import { createCrudActions } from "@/lib/store/crud.factory";

interface TestItem {
  id: string;
  name: string;
}

interface TestState {
  items: TestItem[];
}

describe("createCrudActions factory", () => {
  it("rolls back state and throws when remove API fails", async () => {
    let state: TestState = {
      items: [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ],
    };

    const get = () => state;
    const set = (updater: any) => {
      state = typeof updater === "function" ? { ...state, ...updater(state) } : { ...state, ...updater };
    };

    const apiDelete = vi.fn().mockRejectedValue(new Error("API Delete Failed"));
    const apiUpsert = vi.fn();

    const actions = createCrudActions<TestItem, TestItem, TestState>(set, get, {
      label: "Item",
      getList: (s) => s.items,
      setList: (items) => ({ items }),
      apiUpsert,
      apiDelete,
    });

    await expect(actions.remove("1")).rejects.toThrow("API Delete Failed");

    // Must restore previous state on failure
    expect(state.items).toEqual([
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ]);
  });

  it("updates state and calls apiDelete on success", async () => {
    let state: TestState = {
      items: [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ],
    };

    const get = () => state;
    const set = (updater: any) => {
      state = typeof updater === "function" ? { ...state, ...updater(state) } : { ...state, ...updater };
    };

    const apiDelete = vi.fn().mockResolvedValue(undefined);
    const apiUpsert = vi.fn();

    const actions = createCrudActions<TestItem, TestItem, TestState>(set, get, {
      label: "Item",
      getList: (s) => s.items,
      setList: (items) => ({ items }),
      apiUpsert,
      apiDelete,
    });

    await actions.remove("1");

    expect(state.items).toEqual([{ id: "2", name: "Item 2" }]);
    expect(apiDelete).toHaveBeenCalledWith("1");
  });
});
