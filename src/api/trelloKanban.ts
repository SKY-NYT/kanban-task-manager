import axios from "axios";

import type { Board } from "../types/types";

type TrelloList = {
  id: string;
  name: string;
  closed?: boolean;
};

type TrelloCard = {
  id: string;
  idList: string;
  name: string;
  desc?: string;
  closed?: boolean;
};

type TrelloBoardResponse = {
  id: string;
  name: string;
  lists?: TrelloList[];
  cards?: TrelloCard[];
};

const api = axios.create({
  baseURL: "https://api.trello.com/1",
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

function parseBoardIdsFromEnv(): string[] {
  const idsRaw = import.meta.env.VITE_TRELLO_BOARD_IDS;
  if (typeof idsRaw === "string" && idsRaw.trim().length > 0) {
    return idsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const idSingle = import.meta.env.VITE_TRELLO_BOARD_ID;
  if (typeof idSingle === "string" && idSingle.trim().length > 0) {
    return [idSingle.trim()];
  }

  return [];
}

async function fetchTrelloBoard(boardId: string): Promise<Board> {
  const delayMs = getApiDelayMs();

  const key = import.meta.env.VITE_TRELLO_KEY;
  const token = import.meta.env.VITE_TRELLO_TOKEN;
  if (!key || !token) {
    throw new Error(
      "Missing Trello credentials. Set VITE_TRELLO_KEY and VITE_TRELLO_TOKEN in your env.",
    );
  }

  const res = await api.get<TrelloBoardResponse>(`/boards/${boardId}`, {
    params: {
      key,
      token,
      lists: "open",
      cards: "open",
      list_fields: "name",
      card_fields: "name,desc,idList",
    },
  });

  if (delayMs > 0) {
    await sleep(delayMs);
  }

  const data = res.data;
  const lists = data.lists ?? [];
  const cards = data.cards ?? [];

  return {
    name: data.name,
    columns: lists
      .filter((l) => !l.closed)
      .map((list) => ({
        name: list.name,
        tasks: cards
          .filter((card) => card.idList === list.id && !card.closed)
          .map((card) => ({
            title: card.name,
            description: card.desc ?? "",
            status: list.name,
            subtasks: [],
          })),
      })),
  };
}

export async function fetchBoardsFromTrello(): Promise<Board[]> {
  const boardIds = parseBoardIdsFromEnv();
  if (boardIds.length === 0) {
    throw new Error(
      "Missing Trello board id. Set VITE_TRELLO_BOARD_ID (single) or VITE_TRELLO_BOARD_IDS (comma-separated).",
    );
  }

  const boards = await Promise.all(boardIds.map((id) => fetchTrelloBoard(id)));
  return boards;
}
