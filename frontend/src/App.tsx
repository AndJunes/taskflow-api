import { useEffect, useState } from "react";

interface Board {
  id: number;
  name: string;
  owner_id: number;
}

function App() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/boards/")
      .then((res) => res.json())
      .then(setBoards)
      .catch((err) => setError(String(err)));
  }, []);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold text-slate-800">TaskFlow — Boards</h1>
      {error && <p className="text-red-600">Error: {error}</p>}
      <ul className="mt-4 space-y-2">
        {boards.map((board) => (
          <li key={board.id} className="rounded bg-slate-100 px-4 py-2">
            {board.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;