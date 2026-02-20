import { describe, test, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { useKanbanStore } from "../../store/useKanbanStore";

vi.mock("axios");


const mockedGet = vi.mocked(axios.get);

describe("KanbanStore Remote Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useKanbanStore.setState({
      data: { boards: [] },
      remote: { isLoading: false, error: null, hasFetched: false }
    });
  });

  test("successfully fetches and normalizes board data", async () => {
    const mockApiResponse = {
      data: [
        {
          name: "Launch Plan",
          columns: [{ name: "Todo", tasks: [] }]
        }
      ]
    };

    mockedGet.mockResolvedValueOnce(mockApiResponse);

    await useKanbanStore.getState().fetchRemoteData();

    const state = useKanbanStore.getState();
    expect(state.data.boards[0].name).toBe("Launch Plan");
  });

  test("handles API errors gracefully", async () => {

    mockedGet.mockRejectedValueOnce(new Error("Network Error"));

    await useKanbanStore.getState().fetchRemoteData();

    expect(useKanbanStore.getState().remote.error).toBe("Network Error");
  });
});