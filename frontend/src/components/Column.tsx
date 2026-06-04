import type { Column as ColumnType } from "../types";
import { TaskCard } from "./TaskCard";

interface Props {
  column: ColumnType;
  color: string;
  onTaskClick: (taskId: number) => void;
}

export function Column({ column, color, onTaskClick }: Props) {
  return (
    <div className="flex w-[280px] shrink-0 flex-col">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
        <h2 className="text-heading-s uppercase text-medium-grey">
          {column.name} ({column.tasks.length})
        </h2>
      </div>
      <div className="mt-6 flex flex-col gap-5">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
        ))}
      </div>
    </div>
  );
}