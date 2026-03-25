"use client";

import { useState } from "react";
import { generateBoard } from "@/engine/logic/generator";
import { MathRandomRNG } from "@/engine/utils/rng";
import { BoardSettings } from "@/engine/config/types";
import BoardView from "./board/BoardView";
import SettingsPanel from "./panel/SettingsPanel";
import BoardCanvas from "./board/BoardCanvas";

export default function BoardClient() {
  const [settings, setSettings] = useState<BoardSettings>({
    numberPlacement: "standard",
    resourceBalance: "balanced",
    portLayout: "fixed",
  });

  const [board, setBoard] = useState<ReturnType<typeof generateBoard> | null>(null);

  function handleGenerate() {
    const rng = new MathRandomRNG();
    setBoard(generateBoard(rng, settings));
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-catan-bg">
      <SettingsPanel
        settings={settings}
        onChange={setSettings}
        onGenerate={handleGenerate}
      />
      <main className="flex-1 flex md:items-center justify-center">
        {board
          ? <BoardCanvas board={board} />
          : <p className="text-xs uppercase tracking-widest text-catan-muted mt-8 md:mt-0">No board generated</p>
        }
      </main>
    </div>
  );
}
