import type { BoardSummary } from "../types";
import { Logo, EllipsisIcon } from "./icons";

interface HeaderProps {
  board: BoardSummary | null;
  sidebarVisible: boolean;
}

export function Header({ board, sidebarVisible }: HeaderProps) {
  return (
    <header className="flex h-20 items-center border-b border-lines-light bg-white">
      {!sidebarVisible && (
        <div className="flex h-full items-center border-r border-lines-light px-8">
          <Logo />
        </div>
      )}
      <div className="flex flex-1 items-center justify-between px-6">
        <h1 className="text-heading-xl text-black">
          {board?.name ?? "No board selected"}
        </h1>
        <div className="flex items-center gap-4">
          <button className="rounded-full bg-primary px-6 py-3 text-heading-m text-white hover:bg-primary-hover">
            + Add New Task
          </button>
          <button className="px-2 text-medium-grey" aria-label="Board options">
            <EllipsisIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}