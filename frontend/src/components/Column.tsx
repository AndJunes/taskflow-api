import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BoardDetail } from "../types";
import { TaskCard } from "./TaskCard";

type Col = BoardDetail["columns"][number];
type TaskItem = Col["tasks"][number];

function SortableTaskCard({ task, onClick }: { task: TaskItem; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `t${task.id}` });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
}

interface Props {
  column: Col;
  color: string;
  onTaskClick: (taskId: number) => void;
}

export function Column({ column, color, onTaskClick }: Props) {
  const { setNodeRef } = useDroppable({ id: `c${column.id}` });

  return (
    <div className="flex w-[280px] shrink-0 flex-col">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
        <h2 className="text-heading-s uppercase text-medium-grey">
          {column.name} ({column.tasks.length})
        </h2>
      </div>
      <SortableContext items={column.tasks.map((t) => `t${t.id}`)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="mt-6 flex flex-1 flex-col gap-5">
          {column.tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}