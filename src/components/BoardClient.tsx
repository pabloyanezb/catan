"use client";

import { useState } from "react";
import { generateBoard } from "@/engine/generator";
import { MathRandomRNG } from "@/engine/rng";
import { BoardSettings } from "@/engine/types";
import BoardView from "./BoardView";

export default function BoardClient() {

const [settings, setSettings] = useState<BoardSettings>({
  adjacencyRule: "strict",
  resourceBalance: "balanced",
});

  const [board, setBoard] =
    useState<ReturnType<typeof generateBoard> | null>(null);

  function handleGenerate() {
    const rng = new MathRandomRNG();

    const newBoard = generateBoard(rng, settings);

    setBoard(newBoard);
  }

  function updateSetting<K extends keyof BoardSettings>(
    key: K,
    value: BoardSettings[K]
  ) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div>

      {/* SETTINGS */}

      <div style={{
        display: "flex",
        gap: 16,
        marginBottom: 16,
        alignItems: "center"
      }}>

        {/* ADJACENCY RULE */}

        <label>
          Number adjacency
          <select
            value={settings.adjacencyRule}
            onChange={(e) =>
              updateSetting("adjacencyRule", e.target.value as BoardSettings["adjacencyRule"])
            }
          >
            <option value="strict">Strict</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </label>

        {/* RESOURCE BALANCE */}

        <label>
          Resource balance
          <select
            value={settings.resourceBalance}
            onChange={(e) =>
              updateSetting("resourceBalance", e.target.value as BoardSettings["resourceBalance"])
            }
          >
            <option value="balanced">Balanced</option>
            <option value="random">Random</option>
          </select>
        </label>

        <button onClick={handleGenerate}>
          Generate Board
        </button>

      </div>

      {board && <BoardView board={board} />}

    </div>
  );
}
