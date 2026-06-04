import { useState } from "react";
import type { BoardDetail, Task, SubtaskInput } from "../types";
import { Modal } from "./Modal";
import { CrossIcon } from "./icons";

interface Props {
  task: Task | null;
  columns: BoardDetail["columns"];
  defaultColumnId: number;
  onSubmit: (data: { title: string; description: string; columnId: number; subtasks: SubtaskInput[] }) => void;
  onClose: () => void;
}

type SubtaskField = { key: string; id?: number; title: string };
let counter = 0;
const newKey = () => `s${counter++}`;

const inputClass =
  "w-full rounded border border-medium-grey/25 bg-white px-4 py-2 text-body-l text-black placeholder:text-black/25 dark:border-lines-dark dark:bg-dark-grey dark:text-white dark:placeholder:text-white/25";

export function TaskFormModal({ task, columns, defaultColumnId, onSubmit, onClose }: Props) {
  const isEdit = task !== null;
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [columnId, setColumnId] = useState(task?.column_id ?? defaultColumnId);
  const [subtasks, setSubtasks] = useState<SubtaskField[]>(
    task
      ? task.subtasks.map((s) => ({ key: newKey(), id: s.id, title: s.title }))
      : [{ key: newKey(), title: "" }, { key: newKey(), title: "" }]
  );
  const [error, setError] = useState(false);

  function submit() {
    if (title.trim() === "" || subtasks.some((s) => s.title.trim() === "")) {
      setError(true);
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      columnId,
      subtasks: subtasks.map((s) => ({ id: s.id, title: s.title.trim() })),
    });
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-heading-l text-black dark:text-white">{isEdit ? "Edit Task" : "Add New Task"}</h2>

      <label className="mt-6 block text-body-m text-medium-grey">Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Take coffee break" className={`mt-2 ${inputClass}`} />

      <label className="mt-6 block text-body-m text-medium-grey">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
        rows={4}
        className={`mt-2 resize-none ${inputClass}`}
      />

      <label className="mt-6 block text-body-m text-medium-grey">Subtasks</label>
      <div className="mt-2 flex flex-col gap-3">
        {subtasks.map((sub) => (
          <div key={sub.key} className="flex items-center gap-4">
            <input
              value={sub.title}
              onChange={(e) => setSubtasks((subs) => subs.map((s) => (s.key === sub.key ? { ...s, title: e.target.value } : s)))}
              placeholder="e.g. Make coffee"
              className={inputClass}
            />
            <button onClick={() => setSubtasks((subs) => subs.filter((s) => s.key !== sub.key))} className="text-medium-grey hover:text-destructive" aria-label="Remove subtask">
              <CrossIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => setSubtasks((subs) => [...subs, { key: newKey(), title: "" }])}
        className="mt-3 w-full rounded-full bg-primary/10 py-2.5 text-body-m text-primary hover:bg-primary/25 dark:bg-white dark:hover:bg-white"
      >
        + Add New Subtask
      </button>

      <label className="mt-6 block text-body-m text-medium-grey">Status</label>
      <select value={columnId} onChange={(e) => setColumnId(Number(e.target.value))} className={`mt-2 ${inputClass}`}>
        {columns.map((col) => (
          <option key={col.id} value={col.id}>{col.name}</option>
        ))}
      </select>

      {error && <p className="mt-2 text-body-m text-destructive">All fields are required.</p>}

      <button onClick={submit} className="mt-6 w-full rounded-full bg-primary py-2.5 text-body-m text-white hover:bg-primary-hover">
        {isEdit ? "Save Changes" : "Create Task"}
      </button>
    </Modal>
  );
}