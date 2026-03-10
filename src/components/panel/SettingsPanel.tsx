"use client";

import { useState } from "react";
import { BoardSettings } from "@/engine/types";
import SettingsFields from "./SettingsFields";

interface Props {
  settings: BoardSettings;
  onChange: (settings: BoardSettings) => void;
  onGenerate: () => void;
}

export default function SettingsPanel({ settings, onChange, onGenerate }: Props) {
  const [showBoardSettings, setShowBoardSettings] = useState(true);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  function handleGenerate() {
    setShowMobilePanel(false);
    onGenerate();
  }

  const toggleClass = showBoardSettings
    ? "text-xs uppercase tracking-widest text-left px-1 py-1 rounded cursor-pointer transition-colors hover:bg-catan-surface text-catan-parchment"
    : "text-xs uppercase tracking-widest text-left px-1 py-1 rounded cursor-pointer transition-colors hover:bg-catan-surface text-catan-muted";

  const accordionClass = showBoardSettings
    ? "flex flex-col gap-5 overflow-hidden transition-all duration-300 max-h-96 opacity-100"
    : "flex flex-col gap-5 overflow-hidden transition-all duration-300 max-h-0 opacity-0";

  const chevronClass = showMobilePanel
    ? "transition-transform duration-200 text-lg leading-none -rotate-90"
    : "transition-transform duration-200 text-lg leading-none rotate-90";

  return (
    <aside className="w-full md:w-64 min-h-0 md:min-h-screen flex flex-row md:flex-col items-center md:items-stretch p-4 md:p-5 gap-4 md:gap-8 border-b md:border-b-0 md:border-r bg-catan-bg border-catan-border">

      {/* Header */}
      <div className="md:pb-4 md:border-b border-catan-border shrink-0">
        <p className="text-xs uppercase tracking-widest mb-1 text-catan-muted">Catan</p>
        <h1 className="text-xl font-bold text-catan-text">Board Generator</h1>
      </div>

      {/* Board Settings — desktop only */}
      <div className="hidden md:flex flex-col gap-3 flex-1">
        <button onClick={() => setShowBoardSettings(prev => !prev)} className={toggleClass}>
          {showBoardSettings ? "— Board Settings" : "+ Board Settings"}
        </button>

        <div className={accordionClass}>
          <div className="flex flex-col gap-5 pb-6 border-b border-catan-border">
            <SettingsFields settings={settings} onChange={onChange} />
          </div>
        </div>
      </div>

      {/* Generate — desktop */}
      <div className="hidden md:block md:mt-auto shrink-0">
        <button
          onClick={onGenerate}
          className="w-full py-3 rounded cursor-pointer font-bold text-sm uppercase tracking-widest transition-colors bg-catan-umber hover:bg-catan-umber-hover text-catan-text"
        >
          Generate
        </button>
      </div>

      {/* Generate + panel — mobile */}
      <div className="md:hidden ml-auto relative">

        {/* Backdrop */}
        {showMobilePanel && (
          <div className="fixed inset-0 z-40" onClick={() => setShowMobilePanel(false)} />
        )}

        {/* Panel flotante — hacia abajo */}
        {showMobilePanel && (
          <div className="absolute right-0 top-full mt-2 z-50 bg-catan-bg border border-catan-border rounded-lg p-4 flex flex-col gap-4 w-64 shadow-xl">

            {/* Flecha apuntando al botón */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-catan-bg border-l border-t border-catan-border rotate-45" />

            <SettingsFields settings={settings} onChange={onChange} />

            {/* Confirm */}
            <button
              onClick={handleGenerate}
              className="w-full pt-2 text-sm tracking-widest text-catan-parchment cursor-pointer hover:text-catan-sand transition-colors text-right"
            >
              Confirm →
            </button>
          </div>
        )}

        {/* Botón con chevron — divisor interno */}
        <div className="flex rounded overflow-hidden">

          {/* Click en Generate — genera directo */}
          <button
            onClick={onGenerate}
            className="px-4 py-2.5 cursor-pointer font-bold text-sm uppercase tracking-widest transition-colors bg-catan-umber hover:bg-catan-umber-hover text-catan-text"
          >
            Generate
          </button>

          {/* Divisor + chevron — abre panel */}
          <button
            onClick={() => setShowMobilePanel(prev => !prev)}
            className="px-3 flex items-center cursor-pointer border-l border-catan-umber-hover transition-colors bg-catan-umber hover:bg-catan-umber-hover text-catan-text"
          >
            <span className={chevronClass}>›</span>
          </button>

        </div>
      </div>

    </aside>
  );
}
