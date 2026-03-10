"use client";

import { useState } from "react";
import { generateBoard } from "@/engine/generator";
import { MathRandomRNG } from "@/engine/rng";
import { BoardSettings } from "@/engine/types";
import BoardView from "./BoardView";
import SettingsPanel from "./SettingsPanel";

export default function BoardClient() {
  const [settings, setSettings] = useState<BoardSettings>({
    numberPlacement: "standard",
    resourceBalance: "balanced",
  });

  const [board, setBoard] = useState<ReturnType<typeof generateBoard> | null>(null);

  function handleGenerate() {
    const rng = new MathRandomRNG();
    setBoard(generateBoard(rng, settings));
  }

  return (
    <div className="p-6">
      <div className="flex items-end gap-4">
        <SettingsPanel settings={settings} onChange={setSettings} />
        <button
          onClick={handleGenerate}
          className="mb-6 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Board
        </button>
      </div>
      {board && <BoardView board={board} />}
    </div>
  );
}
