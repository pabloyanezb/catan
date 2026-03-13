import { BoardSettings, NumberPlacementMode, ResourceBalanceMode } from "@/engine/config/types";
import SegmentedControl from "./SegmentedControl";

interface Props {
  settings: BoardSettings;
  onChange: (settings: BoardSettings) => void;
}

export default function SettingsFields({ settings, onChange }: Props) {
  function update<K extends keyof BoardSettings>(key: K, value: BoardSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <>
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
    </>
  );
}
