'use client';

import { BoardSettings, NumberPlacementMode, PortLayoutMode, ResourceBalanceMode } from '@/engine/config/types';
import SegmentedControl from './SegmentedControl';

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
        <label className="text-xs tracking-widest text-catan-muted uppercase">
          Number placement
        </label>
        <SegmentedControl
          options={['standard', 'random'] as NumberPlacementMode[]}
          value={settings.numberPlacement}
          onChange={(v) => update('numberPlacement', v)}
          labels={{ standard: 'Standard', random: 'Random' }}
        />
      </div>

      {/* Resource balance */}
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-widest text-catan-muted uppercase">
          Resources
        </label>
        <SegmentedControl
          options={['balanced', 'random'] as ResourceBalanceMode[]}
          value={settings.resourceBalance}
          onChange={(v) => update('resourceBalance', v)}
          labels={{ balanced: 'Balanced', random: 'Random' }}
        />
      </div>

      {/* Port layout */}
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-widest text-catan-muted uppercase">
          Ports
        </label>
        <SegmentedControl
          options={['fixed', 'random'] as PortLayoutMode[]}
          value={settings.portLayout}
          onChange={(v) => update('portLayout', v)}
          labels={{ fixed: 'Fixed', random: 'Random' }}
        />
      </div>
    </>
  );
}
