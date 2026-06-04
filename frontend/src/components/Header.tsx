import { useState } from "react";
import type { BoardSummary } from "../types";
import { Logo, EllipsisIcon } from "./icons";

interface HeaderProps {
  board: BoardSummary | null;
  sidebarVisible: boolean;
  onAddTask: () => void;
  onEditBoard: () => void;
  onDeleteBoard: () => void;
}

export function Header({ board, sidebarVisible, onAddTask, onEditBoard, onDeleteBoard }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-20 items-center border-b border-lines-light bg-white dark:border-lines-dark dark:bg-dark-grey">
      {!sidebarVisible && (
        <div className="flex h-full items-center border-r border-lines-light px-8 dark:border-lines-dark">
          <Logo />
        </div>
      )}
      <div className="flex flex-1 items-center justify-between px-6">
        <h1 className="text-heading-xl text-black dark:text-white">{board?.name ?? "No board selected"}</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={onAddTask}
            disabled={!board}
            className="rounded-full bg-primary px-6 py-3 text-heading-m text-white hover:bg-primary-hover disabled:opacity-25"
          >
            + Add New Task
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen((o) => !o)} className="px-2 text-medium-grey" aria-label="Board options">
              <EllipsisIcon className="h-5 w-5" />
            </button>
            {menuOpen && (
              <>
                <button className="fixed inset-0 z-0 cursor-default" onClick={() => setMenuOpen(false)} tabIndex={-1} aria-hidden="true" />
                <div className="absolute right-0 top-10 z-10 w-48 rounded-lg bg-white p-4 shadow-lg dark:bg-very-dark-grey">
                  <button onClick={() => { setMenuOpen(false); onEditBoard(); }} className="block w-full text-left text-body-l text-medium-grey hover:text-primary">
                    Edit Board
                  </button>
                  <button onClick={() => { setMenuOpen(false); onDeleteBoard(); }} className="mt-4 block w-full text-left text-body-l text-destructive">
                    Delete Board
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}