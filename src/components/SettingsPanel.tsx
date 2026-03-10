"use client";

import { useState } from "react";
import { BoardSettings, NumberPlacementMode, ResourceBalanceMode } from "@/engine/types";
import SegmentedControl from "./SegmentedControl";

interface Props {
  settings: BoardSettings;
  onChange: (settings: BoardSettings) => void;
  onGenerate: () => void;
}

export default function SettingsPanel({ settings, onChange, onGenerate }: Props) {
  const [showBoardSettings, setShowBoardSettings] = useState(true);

  function update<K extends keyof BoardSettings>(key: K, value: BoardSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col p-5 gap-8 border-r bg-catan-bg border-catan-border">

      {/* Header */}
      <div className="pb-4 border-b border-catan-border">
        <p className="text-xs uppercase tracking-widest mb-1 text-catan-muted">Catan</p>
        <h1 className="text-xl font-bold text-catan-sand">Board Generator</h1>
      </div>

      {/* Board Settings toggle */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setShowBoardSettings(prev => !prev)}
          className={`
            text-xs uppercase tracking-widest text-left px-1 py-1 rounded
            cursor-pointer transition-colors hover:bg-catan-surface
            ${showBoardSettings ? "text-catan-parchment" : "text-catan-muted"}
          `}
        >
          {showBoardSettings ? "— Board Settings" : "+ Board Settings"}
        </button>

        {/* Settings */}
        <div className={`
          flex flex-col gap-5 overflow-hidden transition-all duration-300
          ${showBoardSettings ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}>
          <div className="flex flex-col gap-5 pb-6 border-b border-catan-border">

            {/* Number placement */}
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest text-catan-muted">
                Number placement
              </label>
              <SegmentedControl
                options={["standard", "random"] as NumberPlacementMode[]}
                value={settings.numberPlacement}
                onChange={(v) => update("numberPlacement", v)}
                labels={{ standard: "Standard", random: "Random" }}
              />
            </div>

            {/* Resource balance */}
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest text-catan-muted">
                Resource balance
              </label>
              <SegmentedControl
                options={["balanced", "random"] as ResourceBalanceMode[]}
                value={settings.resourceBalance}
                onChange={(v) => update("resourceBalance", v)}
                labels={{ balanced: "Balanced", random: "Random" }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Generate button */}
      <div className="mt-auto">
        <button
          onClick={onGenerate}
          className="w-full py-3 font-bold text-sm uppercase tracking-widest rounded cursor-pointer transition-colors bg-catan-umber hover:bg-catan-umber-hover text-catan-text"
        >
          Generate
        </button>
      </div>

    </aside>
  );
}
