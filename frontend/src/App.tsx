import { useEffect, useState } from "react";
import { api } from "./api/client";
import type { BoardSummary } from "./types";
import { Sidebar, ShowSidebarButton } from "./components/Sidebar";
import { Header } from "./components/Header";

function App() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    api.getBoards().then((data) => {
      setBoards(data);
      if (data.length > 0) setSelectedId(data[0].id);
    });
  }, []);

  const selectedBoard = boards.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="flex h-screen bg-light-grey">
      {sidebarVisible && (
        <Sidebar
          boards={boards}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onHide={() => setSidebarVisible(false)}
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header board={selectedBoard} sidebarVisible={sidebarVisible} />
        <main className="flex-1 overflow-auto p-6">
          {/* F3: acá van las columnas y las tarjetas */}
        </main>
      </div>
      {!sidebarVisible && <ShowSidebarButton onShow={() => setSidebarVisible(true)} />}
    </div>
  );
}

export default App;