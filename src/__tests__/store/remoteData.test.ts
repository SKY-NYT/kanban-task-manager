import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../../api/jsonPlaceholderKanban", () => ({
  fetchBoardsFromJsonPlaceholder: vi.fn(),
}));

import { fetchBoardsFromJsonPlaceholder } from "../../api/jsonPlaceholderKanban";
import { useKanbanStore } from "../../store/useKanbanStore";
import type { Board } from "../../types/types";
import { resetKanbanStore } from "../../test/test-utils";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("useKanbanStore remote data", () => {
  beforeEach(() => {
    resetKanbanStore();
    vi.clearAllMocks();
  });

  test("sets loading then stores boards on success", async () => {
    const d = deferred<Board[]>();
    vi.mocked(fetchBoardsFromJsonPlaceholder).mockReturnValueOnce(d.promise);

    const p = useKanbanStore.getState().fetchRemoteData();

    expect(useKanbanStore.getState().remote.isLoading).toBe(true);
    expect(useKanbanStore.getState().remote.error).toBeNull();

    const boards: Board[] = [
      {
        name: "Team A",
        columns: [
          { name: "Todo", tasks: [] },
          { name: "Doing", tasks: [] },
          { name: "Done", tasks: [] },
        ],
      },
    ];

    d.resolve(boards);
    await p;

    const state = useKanbanStore.getState();
    expect(state.remote.isLoading).toBe(false);
    expect(state.remote.error).toBeNull();
    expect(state.remote.hasFetched).toBe(true);
    expect(state.data.boards).toHaveLength(1);
    expect(state.data.boards[0]?.name).toBe("Team A");
  });

  test("stores error and clears loading on failure", async () => {
    vi.mocked(fetchBoardsFromJsonPlaceholder).mockRejectedValueOnce(
      new Error("Network down"),
    );

    await useKanbanStore.getState().fetchRemoteData();

    const state = useKanbanStore.getState();
    expect(state.remote.isLoading).toBe(false);
    expect(state.remote.hasFetched).toBe(false);
    expect(state.remote.error).toBe("Network down");
  });

  test("does not start a second fetch while already loading", async () => {
    const d = deferred<Board[]>();
    vi.mocked(fetchBoardsFromJsonPlaceholder).mockReturnValue(d.promise);

    const p1 = useKanbanStore.getState().fetchRemoteData();
    const p2 = useKanbanStore.getState().fetchRemoteData();

    expect(fetchBoardsFromJsonPlaceholder).toHaveBeenCalledTimes(1);

    d.resolve([]);
    await Promise.all([p1, p2]);
  });
});
