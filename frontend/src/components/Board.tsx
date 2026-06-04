import type { BoardDetail } from "../types";
import { Column } from "./Column";

const COLUMN_COLORS = ["#49C4E5", "#8471F2", "#67E2AE", "#E5A449", "#E54957", "#4592E5"];

interface Props {
  board: BoardDetail | null;
  onTaskClick: (taskId: number) => void;
  onAddColumn: () => void;
}

export function Board({ board, onTaskClick, onAddColumn }: Props) {
  if (!board) return null;

  if (board.columns.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <p className="text-heading-l text-medium-grey">
          This board is empty. Create a new column to get started.
        </p>
        <button
          onClick={onAddColumn}
          className="rounded-full bg-primary px-6 py-3 text-heading-m text-white hover:bg-primary-hover"
        >
          + Add New Column
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 md:gap-6">
      {board.columns.map((column, i) => (
        <Column
          key={column.id}
          column={column}
          color={COLUMN_COLORS[i % COLUMN_COLORS.length]}
          onTaskClick={onTaskClick}
        />
      ))}
      <button
        onClick={onAddColumn}
        className="new-column mt-9 flex w-[280px] shrink-0 items-center justify-center rounded-md text-heading-xl text-medium-grey hover:text-primary"
      >
        + New Column
      </button>
    </div>
  );
}