import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import boardData from "../data/data.json";
import type { Board, Column, Task } from "../types/types";

export type ThemeMode = "light" | "dark";

export type Data = {
  boards: Board[];
};

export type KanbanStoreState = {
  data: Data;
  sidebarVisible: boolean;
  theme: ThemeMode;
  isLoggedIn: boolean;

  setData: (next: Data | ((prev: Data) => Data)) => void;
  setSidebarVisible: (visible: boolean) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;

  login: () => void;
  logout: () => void;

  addBoard: (name: string) => void;
  deleteBoard: (boardIndex: number) => void;
  addColumn: (boardIndex: number, name: string) => void;
  deleteColumn: (boardIndex: number, columnIndex: number) => void;
  addTask: (boardIndex: number, columnIndex: number, task: Task) => void;
  updateTask: (
    boardIndex: number,
    columnIndex: number,
    taskIndex: number,
    patch: Partial<Task>,
  ) => void;
  deleteTask: (
    boardIndex: number,
    columnIndex: number,
    taskIndex: number,
  ) => void;
  moveTask: (input: {
    boardIndex: number;
    fromColumnIndex: number;
    taskIndex: number;
    toColumnIndex: number;
    toTaskIndex?: number;
  }) => void;

  subtaskErrors: string[];
  setSubtaskErrors: (errors: string[]) => void;
  resetSubtaskErrors: () => void;

  getCrossIconClass: (hasError: boolean) => string;
};

function clampIndex(index: number, maxExclusive: number) {
  if (maxExclusive <= 0) return 0;
  return Math.max(0, Math.min(index, maxExclusive - 1));
}

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeToDocument(theme: ThemeMode) {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");

  window.localStorage.setItem("theme", theme);
}

function getInitialIsLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("isLoggedIn") === "true";
}

function applyAuthToStorage(isLoggedIn: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
}

const initialTheme = getInitialTheme();
applyThemeToDocument(initialTheme);

const initialIsLoggedIn = getInitialIsLoggedIn();
applyAuthToStorage(initialIsLoggedIn);

export const useKanbanStore = create<KanbanStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        data: boardData as unknown as Data,
        sidebarVisible: true,
        theme: initialTheme,
        isLoggedIn: initialIsLoggedIn,

        setData: (next) =>
          set(
            (s) => ({
              data:
                typeof next === "function"
                  ? (next as (prev: Data) => Data)(s.data)
                  : next,
            }),
            false,
            "app/setData",
          ),

        setSidebarVisible: (visible) =>
          set({ sidebarVisible: visible }, false, "app/setSidebarVisible"),
        toggleSidebar: () =>
          set(
            (s) => ({ sidebarVisible: !s.sidebarVisible }),
            false,
            "app/toggleSidebar",
          ),
        toggleTheme: () =>
          set(
            (s) => {
              const nextTheme: ThemeMode =
                s.theme === "light" ? "dark" : "light";
              applyThemeToDocument(nextTheme);
              return { theme: nextTheme };
            },
            false,
            "app/toggleTheme",
          ),

        login: () =>
          set(
            () => {
              applyAuthToStorage(true);
              return { isLoggedIn: true };
            },
            false,
            "auth/login",
          ),
        logout: () =>
          set(
            () => {
              applyAuthToStorage(false);
              return { isLoggedIn: false };
            },
            false,
            "auth/logout",
          ),

        addBoard: (name) =>
          set(
            (s) => ({
              data: {
                ...s.data,
                boards: [...s.data.boards, { name, columns: [] }],
              },
            }),
            false,
            "kanban/addBoard",
          ),

        deleteBoard: (boardIndex) =>
          set(
            (s) => ({
              data: {
                ...s.data,
                boards: s.data.boards.filter((_, i) => i !== boardIndex),
              },
            }),
            false,
            "kanban/deleteBoard",
          ),

        addColumn: (boardIndex, name) =>
          set(
            (s) => {
              const bIndex = clampIndex(boardIndex, s.data.boards.length);
              const boards = [...s.data.boards];
              const board = boards[bIndex];
              if (!board) return s;
              boards[bIndex] = {
                ...board,
                columns: [...board.columns, { name, tasks: [] } as Column],
              };
              return { data: { ...s.data, boards } };
            },
            false,
            "kanban/addColumn",
          ),

        deleteColumn: (boardIndex, columnIndex) =>
          set(
            (s) => {
              const bIndex = clampIndex(boardIndex, s.data.boards.length);
              const boards = [...s.data.boards];
              const board = boards[bIndex];
              if (!board) return s;
              boards[bIndex] = {
                ...board,
                columns: board.columns.filter((_, i) => i !== columnIndex),
              };
              return { data: { ...s.data, boards } };
            },
            false,
            "kanban/deleteColumn",
          ),

        addTask: (boardIndex, columnIndex, task) =>
          set(
            (s) => {
              const bIndex = clampIndex(boardIndex, s.data.boards.length);
              const boards = [...s.data.boards];
              const board = boards[bIndex];
              if (!board) return s;

              const cIndex = clampIndex(columnIndex, board.columns.length);
              const columns = [...board.columns];
              const col = columns[cIndex];
              if (!col) return s;
              columns[cIndex] = { ...col, tasks: [...col.tasks, task] };

              boards[bIndex] = { ...board, columns };
              return { data: { ...s.data, boards } };
            },
            false,
            "kanban/addTask",
          ),

        updateTask: (boardIndex, columnIndex, taskIndex, patch) =>
          set(
            (s) => {
              const bIndex = clampIndex(boardIndex, s.data.boards.length);
              const boards = [...s.data.boards];
              const board = boards[bIndex];
              if (!board) return s;

              const cIndex = clampIndex(columnIndex, board.columns.length);
              const columns = [...board.columns];
              const col = columns[cIndex];
              if (!col) return s;

              const tIndex = clampIndex(taskIndex, col.tasks.length);
              const tasks = [...col.tasks];
              const existing = tasks[tIndex];
              if (!existing) return s;
              tasks[tIndex] = { ...existing, ...patch };

              columns[cIndex] = { ...col, tasks };
              boards[bIndex] = { ...board, columns };
              return { data: { ...s.data, boards } };
            },
            false,
            "kanban/updateTask",
          ),

        deleteTask: (boardIndex, columnIndex, taskIndex) =>
          set(
            (s) => {
              const bIndex = clampIndex(boardIndex, s.data.boards.length);
              const boards = [...s.data.boards];
              const board = boards[bIndex];
              if (!board) return s;

              const cIndex = clampIndex(columnIndex, board.columns.length);
              const columns = [...board.columns];
              const col = columns[cIndex];
              if (!col) return s;

              columns[cIndex] = {
                ...col,
                tasks: col.tasks.filter((_, i) => i !== taskIndex),
              };
              boards[bIndex] = { ...board, columns };
              return { data: { ...s.data, boards } };
            },
            false,
            "kanban/deleteTask",
          ),

        moveTask: ({
          boardIndex,
          fromColumnIndex,
          taskIndex,
          toColumnIndex,
          toTaskIndex,
        }) => {
          const state = get();
          const board = state.data.boards[boardIndex];
          if (!board) return;
          const fromCol = board.columns[fromColumnIndex];
          const toCol = board.columns[toColumnIndex];
          if (!fromCol || !toCol) return;
          const task = fromCol.tasks[taskIndex];
          if (!task) return;

          set(
            (s) => {
              const boards = [...s.data.boards];
              const b = boards[boardIndex];
              if (!b) return s;

              const columns = [...b.columns];
              const from = columns[fromColumnIndex];
              const to = columns[toColumnIndex];
              if (!from || !to) return s;

              const nextFromTasks = from.tasks.filter(
                (_, i) => i !== taskIndex,
              );
              const insertAt =
                typeof toTaskIndex === "number"
                  ? Math.max(0, Math.min(toTaskIndex, to.tasks.length))
                  : to.tasks.length;

              const nextToTasks = [...to.tasks];
              nextToTasks.splice(insertAt, 0, { ...task, status: to.name });

              columns[fromColumnIndex] = { ...from, tasks: nextFromTasks };
              columns[toColumnIndex] = { ...to, tasks: nextToTasks };
              boards[boardIndex] = { ...b, columns };

              return { data: { ...s.data, boards } };
            },
            false,
            "kanban/moveTask",
          );
        },

        
        subtaskErrors: ["", ""],
        setSubtaskErrors: (errors) => set({ subtaskErrors: errors }),
        resetSubtaskErrors: () => set({ subtaskErrors: ["", ""] }),

        
        getCrossIconClass: (hasError) =>
          hasError ? "text-danger" : "text-[#828FA3] group-hover:text-danger",
      }),
      {
        name: "kanban-task-manager",
        version: 2,
        partialize: (s) => ({
          data: s.data,
          sidebarVisible: s.sidebarVisible,
          theme: s.theme,
          isLoggedIn: s.isLoggedIn,
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) return;
          applyThemeToDocument(state.theme);
          applyAuthToStorage(state.isLoggedIn);
        },
      },
    ),
  ),
);
