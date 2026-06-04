import { useState } from "react";
import type { BoardDetail, Task, Subtask } from "../types";
import { Modal } from "./Modal";
import { EllipsisIcon, CheckIcon } from "./icons";

interface Props {
  task: Task;
  columns: BoardDetail["columns"];
  onToggleSubtask: (subtask: Subtask) => void;
  onChangeStatus: (columnId: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function TaskDetailModal({
  task, columns, onToggleSubtask, onChangeStatus, onEdit, onDelete, onClose,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const done = task.subtasks.filter((s) => s.is_completed).length;
  const total = task.subtasks.length;

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-heading-l text-black dark:text-white">{task.title}</h2>
        <div className="relative">
          <button onClick={() => setMenuOpen((o) => !o)} className="px-2 text-medium-grey" aria-label="Task options">
            <EllipsisIcon className="h-5 w-5" />
          </button>
          {menuOpen && (
            <>
              <button className="fixed inset-0 z-0 cursor-default" onClick={() => setMenuOpen(false)} tabIndex={-1} aria-hidden="true" />
              <div className="absolute right-0 top-10 z-10 w-48 rounded-lg bg-white p-4 shadow-lg dark:bg-very-dark-grey">
                <button onClick={() => { setMenuOpen(false); onEdit(); }} className="block w-full text-left text-body-l text-medium-grey hover:text-primary">
                  Edit Task
                </button>
                <button onClick={() => { setMenuOpen(false); onDelete(); }} className="mt-4 block w-full text-left text-body-l text-destructive">
                  Delete Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {task.description && (
        <p className="mt-6 text-body-l text-medium-grey">{task.description}</p>
      )}

      <h3 className="mt-6 text-body-m text-medium-grey">Subtasks ({done} of {total})</h3>
      <ul className="mt-4 flex flex-col gap-2">
        {task.subtasks.map((subtask) => (
          <li key={subtask.id}>
            <button
              onClick={() => onToggleSubtask(subtask)}
              className="flex w-full items-center gap-4 rounded bg-light-grey p-3 text-left hover:bg-primary/25 dark:bg-very-dark-grey"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                  subtask.is_completed ? "border-primary bg-primary" : "border-medium-grey/25 bg-white dark:bg-dark-grey"
                }`}
              >
                {subtask.is_completed && <CheckIcon className="h-2.5 w-2.5 text-white" />}
              </span>
              <span
                className={`text-body-m ${
                  subtask.is_completed ? "text-black/50 line-through dark:text-white/50" : "text-black dark:text-white"
                }`}
              >
                {subtask.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-body-m text-medium-grey">Current Status</h3>
      <select
        value={task.column_id}
        onChange={(e) => onChangeStatus(Number(e.target.value))}
        className="mt-2 w-full rounded border border-medium-grey/25 bg-white px-4 py-2 text-body-l text-black dark:border-lines-dark dark:bg-dark-grey dark:text-white"
      >
        {columns.map((col) => (
          <option key={col.id} value={col.id}>{col.name}</option>
        ))}
      </select>
    </Modal>
  );
}