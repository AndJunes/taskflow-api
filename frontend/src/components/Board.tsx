import { useEffect, useState } from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners,
  type DragStartEvent, type DragOverEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { BoardDetail, Task } from "../types";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";

type Col = BoardDetail["columns"][number];

const COLUMN_COLORS = ["#49C4E5", "#8471F2", "#67E2AE", "#E5A449", "#E54957", "#4592E5"];

interface Props {
  board: BoardDetail | null;
  onTaskClick: (taskId: number) => void;
  onAddColumn: () => void;
  onMoveTask: (taskId: number, columnId: number, position: number) => void;
}

export function Board({ board, onTaskClick, onAddColumn, onMoveTask }: Props) {
  const [cols, setCols] = useState<Col[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    setCols(board?.columns ?? []);
  }, [board]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  if (!board) return null;

  if (board.columns.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <p className="text-heading-l text-medium-grey">
          This board is empty. Create a new column to get started.
        </p>
        <button onClick={onAddColumn} className="rounded-full bg-primary px-6 py-3 text-heading-m text-white hover:bg-primary-hover">
          + Add New Column
        </button>
      </div>
    );
  }

  function findCol(taskId: number) {
    return cols.find((c) => c.tasks.some((t) => t.id === taskId));
  }

  function onDragStart(e: DragStartEvent) {
    const id = Number(String(e.active.id).slice(1));
    setActiveTask(cols.flatMap((c) => c.tasks).find((t) => t.id === id) ?? null);
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeId = Number(String(active.id).slice(1));
    const overStr = String(over.id);
    const fromCol = findCol(activeId);
    if (!fromCol) return;

    let toCol: Col | undefined;
    let overTaskId: number | null = null;
    if (overStr.startsWith("c")) {
      toCol = cols.find((c) => c.id === Number(overStr.slice(1)));
    } else {
      overTaskId = Number(overStr.slice(1));
      toCol = findCol(overTaskId);
    }
    if (!toCol) return;

    setCols((prev) => {
      const next = prev.map((c) => ({ ...c, tasks: [...c.tasks] }));
      const from = next.find((c) => c.id === fromCol.id)!;
      const to = next.find((c) => c.id === toCol!.id)!;
      const oldIndex = from.tasks.findIndex((t) => t.id === activeId);
      if (oldIndex === -1) return prev;
      let newIndex = to.tasks.length;
      if (overTaskId != null) {
        const oi = to.tasks.findIndex((t) => t.id === overTaskId);
        if (oi >= 0) newIndex = oi;
      }
      if (from.id === to.id) {
        if (oldIndex === newIndex) return prev;
        to.tasks = arrayMove(to.tasks, oldIndex, newIndex);
      } else {
        const [moved] = from.tasks.splice(oldIndex, 1);
        to.tasks.splice(newIndex, 0, moved);
      }
      return next;
    });
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveTask(null);
    const activeId = Number(String(e.active.id).slice(1));
    const col = findCol(activeId);
    if (!col) return;
    onMoveTask(activeId, col.id, col.tasks.findIndex((t) => t.id === activeId));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
      <div className="flex h-full gap-4 md:gap-6">
        {cols.map((column, i) => (
          <Column key={column.id} column={column} color={COLUMN_COLORS[i % COLUMN_COLORS.length]} onTaskClick={onTaskClick} />
        ))}
        <button onClick={onAddColumn} className="new-column mt-9 flex w-[280px] shrink-0 items-center justify-center rounded-md text-heading-xl text-medium-grey hover:text-primary">
          + New Column
        </button>
      </div>
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}</DragOverlay>
    </DndContext>
  );
}