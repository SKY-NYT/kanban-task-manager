import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route } from "react-router-dom";
import DeleteTaskModal from "../../components/molecules/DeleteTaskModal";
import { renderAtRoute, resetKanbanStore } from "../../test/test-utils";
import type { Board } from "../../types/types";
import { useKanbanStore } from "../../store/useKanbanStore";

describe("DeleteTaskModal", () => {
  test("deletes the task and navigates back to the board", async () => {
    const user = userEvent.setup();

    const boards: Board[] = [
      {
        name: "Board",
        columns: [
          {
            name: "Todo",
            tasks: [
              {
                title: "To delete",
                description: "",
                status: "Todo",
                subtasks: [],
              },
            ],
          },
        ],
      },
    ];

    resetKanbanStore({ boards });

    renderAtRoute(<DeleteTaskModal />, {
      initialEntries: ["/boards/0/tasks/0/0/delete"],
      path: "/boards/:boardId/tasks/:columnIndex/:taskIndex/delete",
      wrapperRoutes: (
        <Route path="/boards/:boardId" element={<div>Board Page</div>} />
      ),
    });

    expect(screen.getByText(/delete this task\?/i)).toBeInTheDocument();
    expect(screen.getByText(/to delete/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(screen.getByText("Board Page")).toBeInTheDocument();
    expect(
      useKanbanStore.getState().data.boards[0]?.columns[0]?.tasks,
    ).toHaveLength(0);
  });
});
