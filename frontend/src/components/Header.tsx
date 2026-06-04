import { useState } from "react";
import type { BoardSummary } from "../types";
import { Logo, LogoMark, EllipsisIcon, ChevronIcon, PlusIcon, BoardIcon, SunIcon, MoonIcon } from "./icons";

interface HeaderProps {
  board: BoardSummary | null;
  boards: BoardSummary[];
  selectedId: number | null;
  sidebarVisible: boolean;
  onSelectBoard: (id: number) => void;
  onCreateBoard: () => void;
  onAddTask: () => void;
  onEditBoard: () => void;
  onDeleteBoard: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({
  board, boards, selectedId, sidebarVisible,
  onSelectBoard, onCreateBoard, onAddTask, onEditBoard, onDeleteBoard,
  theme, onToggleTheme,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);

  const optionsMenu = menuOpen && (
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
  );

  return (
    <header className="flex h-16 items-center bg-white dark:bg-dark-grey md:h-20 md:border-b md:border-lines-light md:dark:border-lines-dark">
      {/* Desktop / tablet */}
      <div className="hidden h-full flex-1 items-center md:flex">
        {!sidebarVisible && (
          <div className="flex h-full items-center border-r border-lines-light px-8 dark:border-lines-dark">
            <Logo />
          </div>
        )}
        <div className="flex flex-1 items-center justify-between px-6">
          <h1 className="text-heading-xl text-black dark:text-white">{board?.name ?? "No board selected"}</h1>
          <div className="flex items-center gap-4">
            <button onClick={onAddTask} disabled={!board} className="rounded-full bg-primary px-6 py-3 text-heading-m text-white hover:bg-primary-hover disabled:opacity-25">
              + Add New Task
            </button>
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="px-2 text-medium-grey" aria-label="Board options">
                <EllipsisIcon className="h-5 w-5" />
              </button>
              {optionsMenu}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-1 items-center gap-4 px-4 md:hidden">
        <LogoMark className="h-6 w-6" />
        <button onClick={() => setBoardMenuOpen((o) => !o)} className="flex items-center gap-2">
          <span className="text-heading-l text-black dark:text-white">{board?.name ?? "Boards"}</span>
          <ChevronIcon className={`h-2 w-3 text-primary transition-transform ${boardMenuOpen ? "rotate-180" : ""}`} />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onAddTask} disabled={!board} className="rounded-full bg-primary px-4 py-2 text-white hover:bg-primary-hover disabled:opacity-25" aria-label="Add task">
            <PlusIcon className="h-3 w-3" />
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen((o) => !o)} className="px-2 text-medium-grey" aria-label="Board options">
              <EllipsisIcon className="h-5 w-5" />
            </button>
            {optionsMenu}
          </div>
        </div>
      </div>

      {/* Mobile board dropdown */}
      {boardMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setBoardMenuOpen(false)}>
          <div className="mx-auto mt-16 w-[264px] rounded-lg bg-white py-4 shadow-lg dark:bg-dark-grey" onClick={(e) => e.stopPropagation()}>
            <p className="px-6 text-heading-s uppercase text-medium-grey">All boards ({boards.length})</p>
            <nav className="mt-5 pr-6">
              {boards.map((b) => {
                const active = b.id === selectedId;
                return (
                  <button
                    key={b.id}
                    onClick={() => { onSelectBoard(b.id); setBoardMenuOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-r-full py-3 pl-6 text-left text-heading-m ${
                      active ? "bg-primary text-white" : "text-medium-grey"
                    }`}
                  >
                    <BoardIcon className="h-4 w-4 shrink-0" />
                    {b.name}
                  </button>
                );
              })}
              <button onClick={() => { onCreateBoard(); setBoardMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-r-full py-3 pl-6 text-left text-heading-m text-primary">
                <BoardIcon className="h-4 w-4 shrink-0" />
                + Create New Board
              </button>
            </nav>
            <div className="mx-4 mt-4 flex items-center justify-center gap-6 rounded-md bg-light-grey py-3.5 dark:bg-very-dark-grey">
              <SunIcon className="h-5 w-5 text-medium-grey" />
              <button onClick={onToggleTheme} className="flex h-5 w-10 items-center rounded-full bg-primary px-1" aria-label="Toggle theme">
                <span className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-[18px]" : ""}`} />
              </button>
              <MoonIcon className="h-5 w-5 text-medium-grey" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}