import type { Task } from "../types";

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const done = task.subtasks.filter((s) => s.is_completed).length;
  const total = task.subtasks.length;

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-lg bg-white px-4 py-6 text-left shadow-[0_4px_6px_rgba(54,78,126,0.1)] dark:bg-dark-grey"
    >
      <h3 className="text-heading-m text-black group-hover:text-primary dark:text-white">{task.title}</h3>
      <p className="mt-2 text-body-m text-medium-grey">
        {done} of {total} subtasks
      </p>
    </button>
  );
}