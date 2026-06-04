import { useEffect, useState } from "react";
import { api } from "./api/client";
import type { BoardSummary } from "./types";

function App() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getBoards().then(setBoards).catch((err) => setError(String(err)));
  }, []);

  return (
    <div className="min-h-screen bg-light-grey p-8">
      <h1 className="text-heading-xl text-primary">TaskFlow — Boards</h1>
      {error && <p className="text-destructive">Error: {error}</p>}
      <ul className="mt-4 space-y-2">
        {boards.map((board) => (
          <li key={board.id} className="rounded bg-white px-4 py-2 text-body-l text-black">
            {board.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;