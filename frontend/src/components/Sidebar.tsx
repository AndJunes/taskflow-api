import type { BoardSummary } from "../types";
import { Logo, BoardIcon, EyeSlashIcon, EyeIcon, SunIcon, MoonIcon } from "./icons";

interface SidebarProps {
  boards: BoardSummary[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onHide: () => void;
  onCreateBoard: () => void;
}

export function Sidebar({ boards, selectedId, onSelect, onHide, onCreateBoard }: SidebarProps) {
  return (
    <aside className="flex w-[300px] flex-col border-r border-lines-light bg-white">
      <div className="px-8 pt-8">
        <Logo />
      </div>

      <p className="mt-14 px-8 text-heading-s uppercase text-medium-grey">
        All boards ({boards.length})
      </p>

      <nav className="mt-5 pr-6">
        {boards.map((board) => {
          const active = board.id === selectedId;
          return (
            <button
              key={board.id}
              onClick={() => onSelect(board.id)}
              className={`flex w-full items-center gap-3 rounded-r-full py-3.5 pl-8 text-left text-heading-m ${
                active
                  ? "bg-primary text-white"
                  : "text-medium-grey hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <BoardIcon className="h-4 w-4 shrink-0" />
              {board.name}
            </button>
          );
        })}
        <button onClick={onCreateBoard} className="flex w-full items-center gap-3 rounded-r-full py-3.5 pl-8 text-left text-heading-m text-primary hover:bg-primary/10">
          <BoardIcon className="h-4 w-4 shrink-0" />
          + Create New Board
        </button>
      </nav>

      <div className="mt-auto px-6 pb-8">
        <div className="flex items-center justify-center gap-6 rounded-md bg-light-grey py-3.5">
          <SunIcon className="h-5 w-5 text-medium-grey" />
          <span className="flex h-5 w-10 items-center rounded-full bg-primary px-1">
            <span className="h-3.5 w-3.5 rounded-full bg-white" />
          </span>
          <MoonIcon className="h-5 w-5 text-medium-grey" />
        </div>
        <button
          onClick={onHide}
          className="mt-4 flex items-center gap-3 pl-2 text-heading-m text-medium-grey hover:text-primary"
        >
          <EyeSlashIcon className="h-4 w-4" />
          Hide Sidebar
        </button>
      </div>
    </aside>
  );
}

export function ShowSidebarButton({ onShow }: { onShow: () => void }) {
  return (
    <button
      onClick={onShow}
      className="fixed bottom-8 left-0 flex h-12 w-14 items-center justify-center rounded-r-full bg-primary text-white hover:bg-primary-hover"
      aria-label="Show sidebar"
    >
      <EyeIcon className="h-4 w-5" />
    </button>
  );
}