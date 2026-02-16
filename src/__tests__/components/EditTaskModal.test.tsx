import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { Route } from "react-router-dom";
import EditTaskModal from "../../components/molecules/EditTaskModal";
import { useKanbanStore } from "../../store/useKanbanStore";
import { renderAtRoute, resetKanbanStore } from "../../test/test-utils";
import type { Board } from "../../types/types";

describe("EditTaskModal", () => {
  test("edits a task title and navigates back to the board", async () => {
    const user = userEvent.setup();

    const boards: Board[] = [
      {
        name: "Board",
        columns: [
          {
            name: "Todo",
            tasks: [
              {
                title: "Old title",
                description: "",
                status: "Todo",
                subtasks: [
                  { title: "Sub 1", isCompleted: false },
                  { title: "Sub 2", isCompleted: false },
                ],
              },
            ],
          },
          { name: "Doing", tasks: [] },
          { name: "Done", tasks: [] },
        ],
      },
    ];

    resetKanbanStore({ boards });

    renderAtRoute(<EditTaskModal />, {
      initialEntries: ["/boards/0/tasks/0/0/edit"],
      path: "/boards/:boardId/tasks/:columnIndex/:taskIndex/edit",
      wrapperRoutes: (
        <Route path="/boards/:boardId" element={<div>Board Page</div>} />
      ),
    });

    // Change title
    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "New title");

    let scheduled: (() => void) | null = null;
    const timeoutSpy = vi
      .spyOn(window, "setTimeout")
      .mockImplementation((handler: TimerHandler) => {
        if (typeof handler === "function") {
          scheduled = handler as unknown as () => void;
        }
        return 0;
      });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Changes saved.");

    // Run the scheduled navigation
    expect(scheduled).toBeTypeOf("function");
    act(() => {
      scheduled?.();
    });

    timeoutSpy.mockRestore();

    expect(screen.getByText("Board Page")).toBeInTheDocument();

    const state = useKanbanStore.getState();
    expect(state.data.boards[0]?.columns[0]?.tasks[0]?.title).toBe("New title");
  });
});
