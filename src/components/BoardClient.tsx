"use client";

import { useState } from "react";
import { generateBoard } from "@/engine/generator";
import { MathRandomRNG } from "@/engine/rng";
import BoardView from "./BoardView";

export default function BoardClient() {
  const [board, setBoard] = useState<ReturnType<typeof generateBoard> | null>(null);

  function handleGenerate() {
    const rng = new MathRandomRNG();
    const newBoard = generateBoard(rng);
    setBoard(newBoard);
  }

  return (
    <div>
      <button onClick={handleGenerate} style={{ marginBottom: 16 }}>
        Generate Board
      </button>

      {board && <BoardView board={board} />}
    </div>
  );
}
