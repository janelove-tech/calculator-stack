'use client';

import { useConverter } from '@/hooks/useConverter';
import { UNIT_LABELS } from '@/lib/units';

interface ConverterPanelProps {
  onHistorySaved?: () => void;
}

export function ConverterPanel({ onHistorySaved }: ConverterPanelProps) {
  const c = useConverter(() => onHistorySaved?.());

  const label = (unit: string) =>
    UNIT_LABELS[c.category]?.[unit] ?? unit;

  const appendDigit = (d: string) => {
    c.setValue((v) => (v === '0' ? d : v + d));
  };

  return (
    <div className={c.loading ? 'loading' : ''}>
      <div className="display-wrap">
        <input
          className="converter-input"
          value={c.value}
          onChange={(e) => c.setValue(e.target.value)}
          inputMode="decimal"
          aria-label="Value to convert"
        />
        <div className="converter-result">{c.result}</div>
      </div>

      <div className="converter-controls">
        <label className="converter-label">
          Category
          <select
            className="converter-select"
            value={c.category}
            onChange={(e) => c.setCategory(e.target.value)}
          >
            {Object.keys(UNIT_LABELS).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <div className="converter-units">
          <label className="converter-label">
            From
            <select
              className="converter-select"
              value={c.fromUnit}
              onChange={(e) => c.setFromUnit(e.target.value)}
            >
              {c.units.map((u) => (
                <option key={u} value={u}>
                  {label(u)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="swap-btn" onClick={c.swapUnits} aria-label="Swap units">
            ⇄
          </button>
          <label className="converter-label">
            To
            <select
              className="converter-select"
              value={c.toUnit}
              onChange={(e) => c.setToUnit(e.target.value)}
            >
              {c.units.map((u) => (
                <option key={u} value={u}>
                  {label(u)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="button" className="action-btn" onClick={c.savePreset}>
          Save unit pair preset
        </button>

        {c.presets.length > 0 && (
          <div className="preset-row">
            {c.presets.map((p) => (
              <button
                key={p.id}
                type="button"
                className="preset-chip"
                onClick={() => c.applyPreset(p)}
              >
                {p.label ?? `${p.fromUnit}→${p.toUnit}`}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="keypad-grid">
        <button type="button" className="key key-fn" onClick={() => c.setValue('0')}>
          C
        </button>
        <button
          type="button"
          className="key key-fn"
          onClick={() =>
            c.setValue((v) => (v.length <= 1 ? '0' : v.slice(0, -1)))
          }
        >
          ⌫
        </button>
        {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((d) => (
          <button key={d} type="button" className="key" onClick={() => appendDigit(d)}>
            {d}
          </button>
        ))}
        <button type="button" className="key key-wide" onClick={() => appendDigit('0')}>
          0
        </button>
        <button
          type="button"
          className="key"
          onClick={() => c.setValue((v) => (v.includes('.') ? v : v + (v === '' ? '0.' : '.')))}
        >
          .
        </button>
        <button
          type="button"
          className="key key-fn"
          onClick={() =>
            c.setValue((v) =>
              v.startsWith('-') ? v.slice(1) || '0' : v === '0' ? '-0' : '-' + v,
            )
          }
        >
          ±
        </button>
      </div>
    </div>
  );
}
