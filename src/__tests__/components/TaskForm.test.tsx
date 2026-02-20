import { describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "../../components/molecules/TaskForm";
import { renderAtRoute } from "../../test/test-utils";
import type { Column } from "../../types/types";

const columns: Column[] = [
  { name: "Todo", tasks: [] },
  { name: "Doing", tasks: [] },
  { name: "Done", tasks: [] },
];

describe("TaskForm", () => {
  test("shows validation summary when submitted empty", async () => {
    const user = userEvent.setup();

    renderAtRoute(
      <TaskForm mode="create" columns={columns} onSubmit={() => {}} />,
    );

    await user.click(screen.getByRole("button", { name: /create task/i }));

    const summary = screen
      .getByText("Please fix the following:")
      .closest("[role='alert']");
    expect(summary).toBeTruthy();
    expect(screen.getAllByText("Can't be empty").length).toBeGreaterThan(0);
  });

  test("submits a valid task", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderAtRoute(
      <TaskForm mode="create" columns={columns} onSubmit={onSubmit} />,
    );

    await user.type(screen.getByLabelText(/title/i), "Write tests");

 
    await user.type(screen.getByPlaceholderText(/make coffee/i), "Subtask 1");
    await user.type(screen.getByPlaceholderText(/drink coffee/i), "Subtask 2");

    await user.click(screen.getByRole("button", { name: /create task/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Write tests",
        status: "Todo",
        subtasks: [
          expect.objectContaining({ title: "Subtask 1" }),
          expect.objectContaining({ title: "Subtask 2" }),
        ],
      }),
    );
  });
});
