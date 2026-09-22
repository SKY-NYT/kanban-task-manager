import axios from "axios";

import type { Board, Column, Subtask, Task } from "../types/types";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function getApiDelayMs(): number {
  const raw = import.meta.env.VITE_API_DELAY_MS;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function requireEnv(name: string): string {
  const value = (import.meta.env as Record<string, unknown>)[name];
  if (typeof value === "string" && value.trim().length > 0) return value;
  throw new Error(
    `Missing ${name}. Create a .env file in the project root (same folder as package.json), set ${name}=<url>, then restart the dev server. (Vite only exposes vars prefixed with VITE_).`,
  );
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeSubtask(input: unknown): Subtask {
  const obj = (input ?? {}) as Record<string, unknown>;
  return {
    title: asString(obj.title),
    isCompleted: Boolean(obj.isCompleted),
  };
}

function normalizeTask(input: unknown, columnName: string): Task {
  const obj = (input ?? {}) as Record<string, unknown>;
  return {
    title: asString(obj.title, "Untitled task"),
    description: asString(obj.description, ""),
    status: asString(obj.status, columnName),
    subtasks: asArray(obj.subtasks).map(normalizeSubtask),
  };
}

function normalizeColumn(input: unknown): Column {
  const obj = (input ?? {}) as Record<string, unknown>;
  const name = asString(obj.name, "Todo");
  return {
    name,
    tasks: asArray(obj.tasks).map((t) => normalizeTask(t, name)),
  };
}

function normalizeBoard(input: unknown): Board {
  const obj = (input ?? {}) as Record<string, unknown>;
  return {
    name: asString(obj.name, "Untitled board"),
    columns: asArray(obj.columns).map(normalizeColumn),
  };
}

function extractBoardsPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const obj = (payload ?? {}) as Record<string, unknown>;
  if (Array.isArray(obj.boards)) return obj.boards;

  return [];
}

export async function fetchBoardsFromApi(): Promise<Board[]> {
  const boardsUrl = requireEnv("VITE_KANBAN_BOARDS_URL");
  const delayMs = getApiDelayMs();

  if (/YOUR_PROJECT/i.test(boardsUrl)) {
    throw new Error(
      "VITE_KANBAN_BOARDS_URL is still set to the placeholder value. Replace it with your real MockAPI endpoint (it should end with /boards), then restart the dev server.",
    );
  }

  const res = await axios.get<unknown>(boardsUrl, { timeout: 15000 });

  if (delayMs > 0) {
    await sleep(delayMs);
  }

  const rawBoards = extractBoardsPayload(res.data);
  if (rawBoards.length === 0) {
    throw new Error(
      "API response did not include any boards. Expected an array of boards or an object like { boards: [...] }.",
    );
  }

  return rawBoards.map(normalizeBoard);
}
