import { useEffect, useState } from "react";
import { api } from "./api/client";
import type { BoardSummary, BoardDetail, Subtask, ColumnInput } from "./types";
import { Sidebar, ShowSidebarButton } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Board } from "./components/Board";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { BoardFormModal } from "./components/BoardFormModal";
import { DeleteModal } from "./components/DeleteModal";

function App() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const [boardModal, setBoardModal] = useState<"create" | "edit" | null>(null);
  const [deletingBoard, setDeletingBoard] = useState(false);

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

  return (
    <div className="flex h-screen bg-light-grey">
      {sidebarVisible && (
        <Sidebar
          boards={boards}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onHide={() => setSidebarVisible(false)}
          onCreateBoard={() => setBoardModal("create")}
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          board={selectedSummary}
          sidebarVisible={sidebarVisible}
          onAddTask={() => {}}
          onEditBoard={() => setBoardModal("edit")}
          onDeleteBoard={() => setDeletingBoard(true)}
        />
        <main className="flex-1 overflow-auto p-6">
          <Board board={board} onTaskClick={setOpenTaskId} />
        </main>
      </div>
      {!sidebarVisible && <ShowSidebarButton onShow={() => setSidebarVisible(true)} />}

      {openTask && board && (
        <TaskDetailModal
          task={openTask}
          columns={board.columns}
          onToggleSubtask={handleToggleSubtask}
          onChangeStatus={handleChangeStatus}
          onClose={() => setOpenTaskId(null)}
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