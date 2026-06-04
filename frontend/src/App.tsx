import { useEffect, useState } from "react";
import { api } from "./api/client";
import type { BoardSummary, BoardDetail, Subtask, ColumnInput, SubtaskInput } from "./types";
import { useTheme } from "./hooks/useTheme";
import { Sidebar, ShowSidebarButton } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Board } from "./components/Board";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { TaskFormModal } from "./components/TaskFormModal";
import { BoardFormModal } from "./components/BoardFormModal";
import { DeleteModal } from "./components/DeleteModal";

function App() {
  const { theme, toggle } = useTheme();
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const [boardModal, setBoardModal] = useState<"create" | "edit" | null>(null);
  const [deletingBoard, setDeletingBoard] = useState(false);
  const [taskModal, setTaskModal] = useState<"create" | "edit" | null>(null);
  const [deletingTask, setDeletingTask] = useState(false);

  useEffect(() => {
    api.getBoards().then((data) => {
      setBoards(data);
      if (data.length > 0) setSelectedId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedId == null) {
      setBoard(null);
      return;
    }
    api.getBoard(selectedId).then(setBoard);
  }, [selectedId]);

  const selectedSummary = boards.find((b) => b.id === selectedId) ?? null;
  const openTask = board?.columns.flatMap((c) => c.tasks).find((t) => t.id === openTaskId) ?? null;

  async function refresh() {
    if (selectedId != null) setBoard(await api.getBoard(selectedId));
  }

  async function handleToggleSubtask(subtask: Subtask) {
    await api.toggleSubtask(subtask.id, !subtask.is_completed);
    await refresh();
  }

  async function handleChangeStatus(columnId: number) {
    if (!openTask) return;
    await api.moveTask(openTask.id, columnId);
    await refresh();
  }

  async function handleBoardSubmit(name: string, columns: ColumnInput[]) {
    if (boardModal === "edit" && board) {
      await api.updateBoard(board.id, { name, columns });
      setBoards(await api.getBoards());
      await refresh();
    } else {
      const created = await api.createBoard({ name, columns: columns.map((c) => ({ name: c.name })) });
      setBoards(await api.getBoards());
      setSelectedId(created.id);
    }
    setBoardModal(null);
  }

  async function handleDeleteBoard() {
    if (!board) return;
    await api.deleteBoard(board.id);
    setDeletingBoard(false);
    const list = await api.getBoards();
    setBoards(list);
    setSelectedId(list.length > 0 ? list[0].id : null);
  }

  async function handleTaskSubmit(data: {
    title: string; description: string; columnId: number; subtasks: SubtaskInput[];
  }) {
    if (taskModal === "edit" && openTask) {
      await api.updateTask(openTask.id, {
        title: data.title, description: data.description, subtasks: data.subtasks,
      });
      if (data.columnId !== openTask.column_id) {
        await api.moveTask(openTask.id, data.columnId);
      }
    } else {
      await api.createTask({
        title: data.title, description: data.description,
        column_id: data.columnId, subtasks: data.subtasks.map((s) => ({ title: s.title })),
      });
    }
    setTaskModal(null);
    setOpenTaskId(null);
    await refresh();
  }

  async function handleDeleteTask() {
    if (!openTask) return;
    await api.deleteTask(openTask.id);
    setDeletingTask(false);
    setOpenTaskId(null);
    await refresh();
  }

  return (
    <div className="flex h-screen bg-light-grey dark:bg-very-dark-grey">
      {sidebarVisible && (
        <Sidebar
          boards={boards}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onHide={() => setSidebarVisible(false)}
          onCreateBoard={() => setBoardModal("create")}
          theme={theme}
          onToggleTheme={toggle}
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          board={selectedSummary}
          boards={boards}
          selectedId={selectedId}
          sidebarVisible={sidebarVisible}
          onSelectBoard={setSelectedId}
          onCreateBoard={() => setBoardModal("create")}
          onAddTask={() => { if (board && board.columns.length > 0) setTaskModal("create"); }}
          onEditBoard={() => setBoardModal("edit")}
          onDeleteBoard={() => setDeletingBoard(true)}
          theme={theme}
          onToggleTheme={toggle}
        />
        <main className="flex-1 overflow-auto p-6">
          <Board board={board} onTaskClick={setOpenTaskId} onAddColumn={() => setBoardModal("edit")} />
        </main>
      </div>
      {!sidebarVisible && <ShowSidebarButton onShow={() => setSidebarVisible(true)} />}

      {openTask && board && !taskModal && !deletingTask && (
        <TaskDetailModal
          task={openTask}
          columns={board.columns}
          onToggleSubtask={handleToggleSubtask}
          onChangeStatus={handleChangeStatus}
          onEdit={() => setTaskModal("edit")}
          onDelete={() => setDeletingTask(true)}
          onClose={() => setOpenTaskId(null)}
        />
      )}

      {taskModal && board && (
        <TaskFormModal
          task={taskModal === "edit" ? openTask : null}
          columns={board.columns}
          defaultColumnId={board.columns[0]?.id ?? 0}
          onSubmit={handleTaskSubmit}
          onClose={() => setTaskModal(null)}
        />
      )}

      {deletingTask && openTask && (
        <DeleteModal
          title="Delete this task?"
          message={`Are you sure you want to delete the '${openTask.title}' task and its subtasks? This action cannot be reversed.`}
          onConfirm={handleDeleteTask}
          onClose={() => setDeletingTask(false)}
        />
      )}

      {boardModal && (
        <BoardFormModal
          board={boardModal === "edit" ? board : null}
          onSubmit={handleBoardSubmit}
          onClose={() => setBoardModal(null)}
        />
      )}

      {deletingBoard && board && (
        <DeleteModal
          title="Delete this board?"
          message={`Are you sure you want to delete the '${board.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
          onConfirm={handleDeleteBoard}
          onClose={() => setDeletingBoard(false)}
        />
      )}
    </div>
  );
}

export default App;