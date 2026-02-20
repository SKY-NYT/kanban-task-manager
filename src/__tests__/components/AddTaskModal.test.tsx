import { describe, expect, test, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route } from "react-router-dom";
import AddTaskModal from "../../components/molecules/AddTaskModal";
import { renderAtRoute, resetKanbanStore } from "../../test/test-utils";
import type { Board } from "../../types/types";
import { useKanbanStore } from "../../store/useKanbanStore";

describe("AddTaskModal", () => {
  test("creates a task and navigates back to the board", async () => {
    const user = userEvent.setup();

    const boards: Board[] = [
      {
        name: "Board 1",
        columns: [
          { name: "Todo", tasks: [] },
          { name: "Doing", tasks: [] },
          { name: "Done", tasks: [] },
        ],
      },
    ];

    resetKanbanStore({ boards });

    renderAtRoute(<AddTaskModal />, {
      initialEntries: ["/boards/0/tasks/new"],
      path: "/boards/:boardId/tasks/new",
      wrapperRoutes: (
        <>
          <Route path="/boards/:boardId" element={<div>Board Page</div>} />
        </>
      ),
    });

    await user.type(screen.getByLabelText(/title/i), "Ship Vitest");
    await user.type(screen.getByPlaceholderText(/make coffee/i), "One");
    await user.type(screen.getByPlaceholderText(/drink coffee/i), "Two");

    let scheduled: (() => void) | null = null;
    const timeoutSpy = vi
      .spyOn(window, "setTimeout")
      .mockImplementation((handler: TimerHandler) => {
        if (typeof handler === "function") {
          scheduled = handler as unknown as () => void;
        }
        return 0;
      });

    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Task created.");

    expect(scheduled).toBeTypeOf("function");
    act(() => {
      scheduled?.();
    });

    timeoutSpy.mockRestore();

    expect(screen.getByText("Board Page")).toBeInTheDocument();

    const state = useKanbanStore.getState();
    expect(state.data.boards[0]?.columns[0]?.tasks[0]?.title).toBe(
      "Ship Vitest",
    );
  });
});
