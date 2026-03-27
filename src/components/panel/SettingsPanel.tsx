"use client";

import { useState } from "react";
import clsx from "clsx";
import { BoardSettings } from "@/engine/config/types";
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

  return (
    <aside
      className={clsx(
        "w-full md:w-64",
        "min-h-0 md:min-h-screen",
        "flex flex-row md:flex-col",
        "items-center md:items-stretch",
        "p-4 md:p-5 gap-4 md:gap-8",
        "border-b md:border-b-0 md:border-r",
        "bg-catan-bg border-catan-border",
        "z-10"
      )}
    >

      {/* Header */}
      <div className="md:pb-4 md:border-b border-catan-border shrink-0">
        <p className="text-xs uppercase tracking-widest mb-1 text-catan-muted">
          Catan
        </p>
        <h1 className="text-xl font-bold text-catan-text">
          Board Generator
        </h1>
      </div>

      {/* Board Settings — desktop only */}
      <div className="hidden md:flex flex-col gap-3 flex-1">
        <button
          onClick={() => setShowBoardSettings(prev => !prev)}
          className={clsx(
            "text-left px-1 py-1",
            "text-xs uppercase tracking-widest",
            "rounded cursor-pointer",
            "transition-colors hover:bg-catan-surface",
            showBoardSettings ? "text-catan-parchment" : "text-catan-muted"
          )}
        >
          <span className="flex items-center gap-2">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="shrink-0"
            >
              <line
                x1="0" y1="5" x2="10" y2="5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="5" y1="0" x2="5" y2="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={clsx(
                  "transition-all duration-300 origin-center",
                  showBoardSettings ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                )}
              />
            </svg>
            Board Settings
          </span>
        </button>

        <div
          className={clsx(
            "flex flex-col gap-5",
            "overflow-hidden transition-all duration-300",
            showBoardSettings ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-5 pb-6 border-b border-catan-border">
            <SettingsFields settings={settings} onChange={onChange} />
          </div>
        </div>
      </div>

      {/* Generate — desktop */}
      <div className="hidden md:block md:mt-auto shrink-0">
        <button
          onClick={onGenerate}
          className={clsx(
            "w-full py-3",
            "font-bold text-sm uppercase tracking-widest",
            "rounded cursor-pointer transition-colors",
            "bg-catan-umber hover:bg-catan-umber-hover text-catan-text"
          )}
        >
          Generate
        </button>
      </div>

      {/* Generate + panel — mobile */}
      <div className="md:hidden ml-auto relative">

        {/* Backdrop */}
        {showMobilePanel && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMobilePanel(false)}
          />
        )}

        {/* Panel flotante — hacia abajo */}
        {showMobilePanel && (
          <div
            className={clsx(
              "absolute right-0 top-full mt-2 z-50",
              "flex flex-col gap-4 w-64 p-4",
              "bg-catan-bg border border-catan-border",
              "rounded-lg shadow-xl"
            )}
          >
            {/* Flecha apuntando al botón */}
            <div
              className={clsx(
                "absolute -top-2 right-4",
                "w-4 h-4 rotate-45",
                "bg-catan-bg border-l border-t border-catan-border"
              )}
            />

            <SettingsFields settings={settings} onChange={onChange} />

            {/* Confirm */}
            <button
              onClick={handleGenerate}
              className={clsx(
                "w-full pt-2 text-right",
                "text-sm tracking-widest",
                "cursor-pointer transition-colors",
                "text-catan-parchment hover:text-catan-sand"
              )}
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
            className={clsx(
              "px-4 py-2.5",
              "font-bold text-sm uppercase tracking-widest",
              "cursor-pointer transition-colors",
              "bg-catan-umber hover:bg-catan-umber-hover text-catan-text"
            )}
          >
            Generate
          </button>

          {/* Divisor + chevron — abre panel */}
          <button
            onClick={() => setShowMobilePanel(prev => !prev)}
            className={clsx(
              "px-3 flex items-center",
              "cursor-pointer transition-colors",
              "border-l border-catan-umber-hover",
              "bg-catan-umber hover:bg-catan-umber-hover text-catan-text"
            )}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={clsx(
                "transition-transform duration-200",
                showMobilePanel ? "rotate-180" : "rotate-0"
              )}
            >
              <path
                d="M2 4L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

        </div>
      </div>

    </aside>
  );
}
