'use client';

interface CalcKeypadProps {
  mode: 'standard' | 'scientific';
  angleMode: 'deg' | 'rad';
  onAction: (action: string, value?: string) => void;
  hasMemory: boolean;
}

export function CalcKeypad({ mode, angleMode, onAction, hasMemory }: CalcKeypadProps) {
  const sci = mode === 'scientific';

  return (
    <>
      <div className="memory-bar">
        {(['mc', 'mr', 'm-plus', 'm-minus'] as const).map((a) => (
          <button key={a} type="button" className="mem-btn" onClick={() => onAction(a)}>
            {a === 'm-plus' ? 'M+' : a === 'm-minus' ? 'M−' : a.toUpperCase()}
          </button>
        ))}
        {hasMemory && <span className="mem-indicator">M</span>}
      </div>

      {sci && (
        <div className="keypad-grid">
          {[
            ['function', 'sin', 'sin'],
            ['function', 'cos', 'cos'],
            ['function', 'tan', 'tan'],
            ['function', 'sqrt', '√'],
            ['function', 'log', 'log'],
            ['function', 'ln', 'ln'],
            ['function', 'pow2', 'x²'],
            ['pow', '', 'xʸ'],
            ['constant', 'pi', 'π'],
            ['constant', 'e', 'e'],
            ['function', 'factorial', 'n!'],
            ['function', 'abs', '|x|'],
            ['function', 'asin', 'asin'],
            ['function', 'acos', 'acos'],
            ['function', 'atan', 'atan'],
            ['function', 'exp', 'eˣ'],
            ['function', 'tenpow', '10ˣ'],
          ].map(([action, val, label]) => (
            <button
              key={label}
              type="button"
              className="key key-sci"
              onClick={() => onAction(action, val || undefined)}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className={`key key-sci ${angleMode === 'deg' ? 'active-deg' : 'active-rad'}`}
            onClick={() => onAction('angle-mode')}
          >
            {angleMode === 'deg' ? 'DEG' : 'RAD'}
          </button>
        </div>
      )}

      <div className="keypad-grid">
        <button type="button" className="key key-fn" onClick={() => onAction('clear')}>
          AC
        </button>
        <button type="button" className="key key-fn" onClick={() => onAction('toggle-sign')}>
          ±
        </button>
        <button type="button" className="key key-fn" onClick={() => onAction('percent')}>
          %
        </button>
        <button type="button" className="key key-op" onClick={() => onAction('operator', '/')}>
          ÷
        </button>

        {['7', '8', '9'].map((d) => (
          <button key={d} type="button" className="key" onClick={() => onAction('digit', d)}>
            {d}
          </button>
        ))}
        <button type="button" className="key key-op" onClick={() => onAction('operator', '*')}>
          ×
        </button>

        {['4', '5', '6'].map((d) => (
          <button key={d} type="button" className="key" onClick={() => onAction('digit', d)}>
            {d}
          </button>
        ))}
        <button type="button" className="key key-op" onClick={() => onAction('operator', '-')}>
          −
        </button>

        {['1', '2', '3'].map((d) => (
          <button key={d} type="button" className="key" onClick={() => onAction('digit', d)}>
            {d}
          </button>
        ))}
        <button type="button" className="key key-op" onClick={() => onAction('operator', '+')}>
          +
        </button>

        <button type="button" className="key key-wide" onClick={() => onAction('digit', '0')}>
          0
        </button>
        <button type="button" className="key" onClick={() => onAction('decimal')}>
          .
        </button>
        <button type="button" className="key key-equals" onClick={() => onAction('equals')}>
          =
        </button>
      </div>
    </>
  );
}
