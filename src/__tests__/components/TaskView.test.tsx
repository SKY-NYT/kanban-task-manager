import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskView from "../../components/molecules/TaskView";
import { renderAtRoute, resetKanbanStore } from "../../test/test-utils";
import type { Board } from "../../types/types";

describe("TaskView", () => {
  test("toggles a subtask completion and updates the counter", async () => {
    const user = userEvent.setup();

    const boards: Board[] = [
      {
        name: "Board",
        columns: [
          {
            name: "Todo",
            tasks: [
              {
                title: "Task 1",
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

    renderAtRoute(<TaskView />, {
      initialEntries: ["/boards/0/tasks/0/0"],
      path: "/boards/:boardId/tasks/:columnIndex/:taskIndex",
    });

    expect(screen.getByText(/subtasks \(0 of 2\)/i)).toBeInTheDocument();

    await user.click(screen.getByText("Sub 1"));

    expect(screen.getByText(/subtasks \(1 of 2\)/i)).toBeInTheDocument();
  });
});
