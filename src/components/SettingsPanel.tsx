"use client";

import { BoardSettings, NumberPlacementMode, ResourceBalanceMode } from "@/engine/types";

interface Props {
  settings: BoardSettings;
  onChange: (settings: BoardSettings) => void;
}

export default function SettingsPanel({ settings, onChange }: Props) {
  function update<K extends keyof BoardSettings>(key: K, value: BoardSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="flex items-center gap-6 mb-6">

      {/* NUMBER PLACEMENT */}
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        Number placement
        <select
          value={settings.numberPlacement}
          onChange={(e) => update("numberPlacement", e.target.value as NumberPlacementMode)}
          className="mt-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="standard">Standard</option>
          <option value="random">Random</option>
        </select>
      </label>

      {/* RESOURCE BALANCE */}
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        Resource balance
        <select
          value={settings.resourceBalance}
          onChange={(e) => update("resourceBalance", e.target.value as ResourceBalanceMode)}
          className="mt-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="balanced">Balanced</option>
          <option value="random">Random</option>
        </select>
      </label>

    </div>
  );
}
