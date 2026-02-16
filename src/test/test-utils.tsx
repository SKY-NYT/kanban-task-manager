import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useKanbanStore } from "../store/useKanbanStore";
import type { Board } from "../types/types";

export function resetKanbanStore(input?: {
  boards?: Board[];
  remote?: {
    isLoading?: boolean;
    error?: string | null;
    hasFetched?: boolean;
  };
}) {
  window.localStorage.removeItem("kanban-task-manager-v3");

  useKanbanStore.setState({
    data: { boards: input?.boards ?? [] },
    remote: {
      isLoading: input?.remote?.isLoading ?? false,
      error: input?.remote?.error ?? null,
      hasFetched: input?.remote?.hasFetched ?? false,
    },
  });
}

export function renderAtRoute(
  ui: React.ReactElement,
  options?: {
    initialEntries?: string[];
    path?: string;
    wrapperRoutes?: React.ReactNode;
    renderOptions?: Omit<RenderOptions, "wrapper">;
  },
) {
  const initialEntries = options?.initialEntries ?? ["/"];
  const path = options?.path ?? "/";

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        {options?.wrapperRoutes}
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>,
    options?.renderOptions,
  );
}
