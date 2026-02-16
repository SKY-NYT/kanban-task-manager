import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, useParams } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import { renderAtRoute, resetKanbanStore } from "../../test/test-utils";
import type { Board } from "../../types/types";

function BoardRoute() {
  const { boardId } = useParams();
  return <div>Board Route {boardId}</div>;
}

describe("Dashboard navigation", () => {
  test("navigates to a board when clicking a board card", async () => {
    const user = userEvent.setup();

    const boards: Board[] = [
      { name: "First", columns: [] },
      { name: "Second", columns: [] },
    ];

    resetKanbanStore({ boards, remote: { hasFetched: true } });

    renderAtRoute(<Dashboard />, {
      initialEntries: ["/"],
      wrapperRoutes: <Route path="/boards/:boardId" element={<BoardRoute />} />,
    });

    await user.click(screen.getByText("Second"));

    expect(screen.getByText("Board Route 1")).toBeInTheDocument();
  });
});
