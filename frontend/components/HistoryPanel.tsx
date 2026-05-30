'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, type CalculationRecord } from '@/lib/api';

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  onSelect: (record: CalculationRecord) => void;
  refreshKey?: number;
}

export function HistoryPanel({ open, onClose, onSelect, refreshKey = 0 }: HistoryPanelProps) {
  const [items, setItems] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load, refreshKey]);

  const clearAll = async () => {
    try {
      await api.clearHistory();
      setItems([]);
    } catch {
      /* ignore */
    }
  };

  const remove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteCalculation(id);
      setItems((list) => list.filter((i) => i.id !== id));
    } catch {
      /* ignore */
    }
  };

  if (!open) return null;

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>History</h2>
        <button type="button" className="link-btn" onClick={clearAll}>
          Clear all
        </button>
      </div>
      {loading && <p className="history-empty">Loading…</p>}
      {!loading && items.length === 0 && (
        <p className="history-empty">No saved calculations yet.</p>
      )}
      <ul className="history-list">
        {items.map((item) => (
          <li key={item.id} onClick={() => onSelect(item)}>
            <div>
              <span className="hist-meta">{item.mode.toLowerCase()}</span>
              <span className="hist-expr">{item.expression}</span>
              <span className="hist-result">{item.result}</span>
            </div>
            <button
              type="button"
              className="delete-btn"
              aria-label="Delete"
              onClick={(e) => remove(item.id, e)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div style={{ textAlign: 'center', padding: '0.5rem' }}>
        <button type="button" className="link-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
