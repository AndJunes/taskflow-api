import type {
  BoardSummary, BoardDetail, Subtask, Task, BoardCreateInput, BoardUpdateInput, TaskCreateInput, TaskUpdateInput
} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  if (res.status === 204) return undefined as T;   
  return res.json() as Promise<T>;
}

export const api = {
  getBoards: () => request<BoardSummary[]>("/boards/"),
  getBoard: (id: number) => request<BoardDetail>(`/boards/${id}`),

  createBoard: (data: BoardCreateInput) =>
    request<BoardDetail>("/boards/", { method: "POST", body: JSON.stringify(data) }),
  updateBoard: (id: number, data: BoardUpdateInput) =>
    request<BoardDetail>(`/boards/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBoard: (id: number) =>
    request<void>(`/boards/${id}`, { method: "DELETE" }),

  toggleSubtask: (id: number, isCompleted: boolean) =>
    request<Subtask>(`/subtasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_completed: isCompleted }),
    }),
  moveTask: (id: number, columnId: number, position?: number) =>
    request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ column_id: columnId, position }),
    }),
    createTask: (data: TaskCreateInput) =>
        request<Task>("/tasks/", { method: "POST", body: JSON.stringify(data) }),
  updateTask: (id: number, data: TaskUpdateInput) =>
        request<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTask: (id: number) =>
        request<void>(`/tasks/${id}`, { method: "DELETE" }),
};