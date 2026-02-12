import { createContext } from "react";

export interface Subtask {
  title: string;
  isCompleted: boolean;
}
export interface Task {
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}
export interface Column {
  name: string;
  tasks: Task[];
}
export interface Board {
  name: string;
  columns: Column[];
}
export interface Data {
  boards: Board[];
}

export interface AppContextType {
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
  toggleSidebar: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
