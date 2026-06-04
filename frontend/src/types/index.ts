export interface Subtask {
  id: number;
  title: string;
  is_completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  column_id: number;
  position: number;
  subtasks: Subtask[];
}

export interface Column {
  id: number;
  name: string;
  position: number;
  tasks: Task[];
}

export interface BoardSummary {
  id: number;
  name: string;
  owner_id: number;
}

export interface BoardDetail {
  id: number;
  name: string;
  owner_id: number;
  columns: Column[];
}