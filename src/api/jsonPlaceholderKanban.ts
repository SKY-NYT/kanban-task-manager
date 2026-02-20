import axios from "axios";

import type { Board, Column, Task } from "../types/types";

type JsonPlaceholderUser = {
  id: number;
  name: string;
};

type JsonPlaceholderTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 15000,
});

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function getApiDelayMs(): number {
  const raw = import.meta.env.VITE_API_DELAY_MS;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const COLUMN_NAMES = ["Todo", "Doing", "Done"] as const;

type ColumnName = (typeof COLUMN_NAMES)[number];

function statusForTodo(todo: JsonPlaceholderTodo): ColumnName {
  if (todo.completed) return "Done";
  return todo.id % 2 === 0 ? "Doing" : "Todo";
}

export async function fetchBoardsFromJsonPlaceholder(): Promise<Board[]> {
  const delayMs = getApiDelayMs();

  const [usersRes, todosRes] = await Promise.all([
    api.get<JsonPlaceholderUser[]>("/users"),
    api.get<JsonPlaceholderTodo[]>("/todos"),
  ]);

  if (delayMs > 0) {
    await sleep(delayMs);
  }

  const users = usersRes.data ?? [];
  const todos = todosRes.data ?? [];

  const todosByUserId = new Map<number, JsonPlaceholderTodo[]>();
  for (const todo of todos) {
    const arr = todosByUserId.get(todo.userId) ?? [];
    arr.push(todo);
    todosByUserId.set(todo.userId, arr);
  }

  const boards: Board[] = users.map((u) => {
    const userTodos = todosByUserId.get(u.id) ?? [];

    const tasksByStatus: Record<ColumnName, Task[]> = {
      Todo: [],
      Doing: [],
      Done: [],
    };

    for (const t of userTodos) {
      const status = statusForTodo(t);
      tasksByStatus[status].push({
        title: t.title,
        description: "",
        status,
        subtasks: [],
      });
    }

    const columns: Column[] = COLUMN_NAMES.map((name) => ({
      name,
      tasks: tasksByStatus[name],
    }));

    return {
      name: u.name,
      columns,
    };
  });

  return boards;
}
