'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiStatus } from '@/components/ApiStatus';
import { CalcKeypad } from '@/components/CalcKeypad';
import { ConverterPanel } from '@/components/ConverterPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import type { CalculationRecord } from '@/lib/api';
import { useCalculator } from '@/hooks/useCalculator';

type UiMode = 'standard' | 'scientific' | 'converter';

export function CalculatorApp() {
  const [uiMode, setUiMode] = useState<UiMode>('standard');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  const bumpHistory = useCallback(() => setHistoryKey((k) => k + 1), []);

  const calc = useCalculator(
    uiMode === 'converter' ? 'standard' : uiMode,
    bumpHistory,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (uiMode === 'converter') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (/\d/.test(e.key)) {
        e.preventDefault();
        void calc.handleAction('digit', e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        void calc.handleAction('decimal');
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        e.preventDefault();
        void calc.handleAction('operator', e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        void calc.handleAction('equals');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        calc.clearAll();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [calc, uiMode]);

  const onHistorySelect = (record: CalculationRecord) => {
    calc.setDisplay(record.result.split(' ')[0] ?? record.result);
    calc.setExpression(record.expression);
    setHistoryOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="header">
        <h1 className="title">Multifaceted Calculator</h1>
        <p className="subtitle">Next.js · NestJS · PostgreSQL · Prisma</p>
        <ApiStatus />
      </header>

      <nav className="mode-tabs" role="tablist">
        {(['standard', 'scientific', 'converter'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={uiMode === m}
            className={`mode-tab ${uiMode === m ? 'active' : ''}`}
            onClick={() => setUiMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </nav>

      <div className={`calculator-card ${calc.loading ? 'loading' : ''}`}>
        {uiMode !== 'converter' ? (
          <>
            <div className="display-wrap">
              <div className="expression">{calc.expression}</div>
              <div className={`display ${calc.display === 'Error' ? 'error' : ''}`}>
                {calc.display}
              </div>
            </div>
            <CalcKeypad
              mode={uiMode}
              angleMode={calc.angleMode}
              onAction={(a, v) => void calc.handleAction(a, v)}
              hasMemory={calc.hasMemory}
            />
            <p className="hint">
              Works offline in your browser. Connect the API + PostgreSQL to sync history to the database.
            </p>
          </>
        ) : (
          <ConverterPanel onHistorySaved={bumpHistory} />
        )}
      </div>

      <div className="footer-actions">
        <button type="button" className="link-btn" onClick={() => setHistoryOpen((o) => !o)}>
          {historyOpen ? 'Hide history' : 'History'}
        </button>
      </div>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={onHistorySelect}
        refreshKey={historyKey}
      />
    </div>
  );
}
