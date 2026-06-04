import { useState } from "react";
import type { BoardDetail, ColumnInput } from "../types";
import { Modal } from "./Modal";
import { CrossIcon } from "./icons";

interface Props {
  board: BoardDetail | null;
  onSubmit: (name: string, columns: ColumnInput[]) => void;
  onClose: () => void;
}

type ColumnField = { key: string; id?: number; name: string };
let counter = 0;
const newKey = () => `c${counter++}`;

export function BoardFormModal({ board, onSubmit, onClose }: Props) {
  const isEdit = board !== null;
  const [name, setName] = useState(board?.name ?? "");
  const [columns, setColumns] = useState<ColumnField[]>(
    board
      ? board.columns.map((c) => ({ key: newKey(), id: c.id, name: c.name }))
      : [{ key: newKey(), name: "Todo" }, { key: newKey(), name: "Doing" }]
  );
  const [error, setError] = useState(false);

  function submit() {
    if (name.trim() === "" || columns.some((c) => c.name.trim() === "")) {
      setError(true);
      return;
    }
    onSubmit(name.trim(), columns.map((c) => ({ id: c.id, name: c.name.trim() })));
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-heading-l text-black">{isEdit ? "Edit Board" : "Add New Board"}</h2>

      <label className="mt-6 block text-body-m text-medium-grey">Board Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Web Design"
        className="mt-2 w-full rounded border border-medium-grey/25 px-4 py-2 text-body-l text-black placeholder:text-black/25"
      />

      <label className="mt-6 block text-body-m text-medium-grey">Board Columns</label>
      <div className="mt-2 flex flex-col gap-3">
        {columns.map((col) => (
          <div key={col.key} className="flex items-center gap-4">
            <input
              value={col.name}
              onChange={(e) =>
                setColumns((cols) => cols.map((c) => (c.key === col.key ? { ...c, name: e.target.value } : c)))
              }
              className="w-full rounded border border-medium-grey/25 px-4 py-2 text-body-l text-black"
            />
            <button
              onClick={() => setColumns((cols) => cols.filter((c) => c.key !== col.key))}
              className="text-medium-grey hover:text-destructive"
              aria-label="Remove column"
            >
              <CrossIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => setColumns((cols) => [...cols, { key: newKey(), name: "" }])}
        className="mt-3 w-full rounded-full bg-primary/10 py-2.5 text-body-m text-primary hover:bg-primary/25"
      >
        + Add New Column
      </button>

      {error && <p className="mt-2 text-body-m text-destructive">All fields are required.</p>}

      <button onClick={submit} className="mt-6 w-full rounded-full bg-primary py-2.5 text-body-m text-white hover:bg-primary-hover">
        {isEdit ? "Save Changes" : "Create New Board"}
      </button>
    </Modal>
  );
}