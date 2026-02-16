import { describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import { renderAtRoute, resetKanbanStore } from "../../test/test-utils";
import type { Board } from "../../types/types";
import { useKanbanStore } from "../../store/useKanbanStore";
import type { KanbanStoreState } from "../../store/useKanbanStore";

describe("Dashboard remote states", () => {
  test("shows a loading message when fetching boards", () => {
    resetKanbanStore({ remote: { isLoading: true } });

    renderAtRoute(<Dashboard />, { initialEntries: ["/"] });

    expect(screen.getByRole("status")).toHaveTextContent("Loading boards...");
  });

  test("shows an error and retries", async () => {
    const user = userEvent.setup();
    resetKanbanStore({ remote: { error: "Boom" } });

    const retry: KanbanStoreState["fetchRemoteData"] = vi.fn(async () => {});
    useKanbanStore.setState({ fetchRemoteData: retry });

    renderAtRoute(<Dashboard />, { initialEntries: ["/"] });

    expect(screen.getByRole("alert")).toHaveTextContent("Boom");
    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  test("renders boards on success", () => {
    const boards: Board[] = [
      { name: "A", columns: [] },
      { name: "B", columns: [] },
    ];
    resetKanbanStore({ boards, remote: { hasFetched: true } });

    renderAtRoute(<Dashboard />, {
      initialEntries: ["/"],
      wrapperRoutes: <Route path="/boards/:boardId" element={<div />} />,
    });

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
