import type { BoardSummary } from "../types";
import { Logo, BoardIcon, EyeSlashIcon, SunIcon, MoonIcon } from "./icons";

interface SidebarProps {
  boards: BoardSummary[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onHide: () => void;
  onCreateBoard: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Sidebar({
  boards, selectedId, onSelect, onHide, onCreateBoard, theme, onToggleTheme,
}: SidebarProps) {
  return (
    <aside className="hidden w-[300px] flex-col border-r border-lines-light bg-white md:flex dark:border-lines-dark dark:bg-dark-grey">
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
                  : "text-medium-grey hover:bg-primary/10 hover:text-primary dark:hover:bg-white"
              }`}
            >
              <BoardIcon className="h-4 w-4 shrink-0" />
              {board.name}
            </button>
          );
        })}
        <button
          onClick={onCreateBoard}
          className="flex w-full items-center gap-3 rounded-r-full py-3.5 pl-8 text-left text-heading-m text-primary hover:bg-primary/10 dark:hover:bg-white"
        >
          <BoardIcon className="h-4 w-4 shrink-0" />
          + Create New Board
        </button>
      </nav>

      <div className="mt-auto px-6 pb-8">
        <button
          onClick={onToggleTheme}
          className="flex w-full items-center justify-center gap-6 rounded-md bg-light-grey py-3.5 dark:bg-very-dark-grey"
          aria-label="Toggle theme"
        >
          <SunIcon className="h-5 w-5 text-medium-grey" />
          <span className="flex h-5 w-10 items-center rounded-full bg-primary px-1">
            <span
              className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                theme === "dark" ? "translate-x-[18px]" : ""
              }`}
            />
          </span>
          <MoonIcon className="h-5 w-5 text-medium-grey" />
        </button>
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
      className="fixed bottom-8 left-0 hidden h-12 w-14 items-center justify-center rounded-r-full bg-primary text-white hover:bg-primary-hover md:flex"
      aria-label="Show sidebar"
    >
      <EyeSlashIcon className="h-4 w-5" />
    </button>
  );
}