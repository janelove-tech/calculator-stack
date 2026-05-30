'use client';

import { useCallback, useState } from 'react';
import { api, type CalculatorMode } from '@/lib/api';
import { formatNumber } from '@/lib/format';

type UiMode = 'standard' | 'scientific' | 'converter';

const modeMap: Record<UiMode, CalculatorMode> = {
  standard: 'STANDARD',
  scientific: 'SCIENTIFIC',
  converter: 'CONVERTER',
};

export function useCalculator(uiMode: UiMode, onSaved?: () => void) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [hasMemory, setHasMemory] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [lastOperator, setLastOperator] = useState<string | null>(null);
  const [accumulated, setAccumulated] = useState<number | null>(null);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [powBase, setPowBase] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getValue = useCallback(() => {
    const v = parseFloat(display);
    return Number.isFinite(v) ? v : 0;
  }, [display]);

  const persist = useCallback(
    async (expr: string, result: string, metadata?: Record<string, unknown>) => {
      if (uiMode === 'converter') return;
      try {
        await api.saveCalculation({
          mode: modeMap[uiMode],
          expression: expr,
          result,
          metadata,
        });
        onSaved?.();
      } catch {
        /* offline — history refresh will show local gap */
      }
    },
    [uiMode, onSaved],
  );

  const setResult = useCallback((val: number, expr?: string) => {
    const formatted = formatNumber(val);
    setDisplay(formatted);
    if (expr) setExpression(expr);
    setWaitingForOperand(true);
    return formatted;
  }, []);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setWaitingForOperand(false);
    setLastOperator(null);
    setAccumulated(null);
    setPowBase(null);
  }, []);

  const applyOperator = useCallback(
    (op: string, nextVal: number) => {
      let acc = accumulated;
      if (acc === null) {
        acc = nextVal;
      } else if (!waitingForOperand) {
        let r: number;
        switch (op) {
          case '+':
            r = acc + nextVal;
            break;
          case '-':
            r = acc - nextVal;
            break;
          case '*':
            r = acc * nextVal;
            break;
          case '/':
            r = nextVal === 0 ? NaN : acc / nextVal;
            break;
          default:
            r = nextVal;
        }
        acc = r;
      }
      setAccumulated(acc);
      setLastOperator(op);
      setWaitingForOperand(true);
      const symbols: Record<string, string> = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
      };
      setExpression(`${formatNumber(acc)} ${symbols[op] ?? op}`);
      setDisplay(formatNumber(acc));
    },
    [accumulated, waitingForOperand],
  );

  const calculate = useCallback(async () => {
    if (lastOperator === null || accumulated === null) return;
    const nextVal = getValue();
    const a = accumulated;
    const op = lastOperator;
    let r: number;
    switch (op) {
      case '+':
        r = a + nextVal;
        break;
      case '-':
        r = a - nextVal;
        break;
      case '*':
        r = a * nextVal;
        break;
      case '/':
        r = nextVal === 0 ? NaN : a / nextVal;
        break;
      default:
        return;
    }
    const symbols: Record<string, string> = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷',
    };
    const expr = `${formatNumber(a)} ${symbols[op]} ${formatNumber(nextVal)}`;
    if (!Number.isFinite(r)) {
      setDisplay('Error');
      setExpression(expr);
      return;
    }
    const formatted = setResult(r, `${expr} =`);
    await persist(expr, formatted);
    setAccumulated(null);
    setLastOperator(null);
  }, [accumulated, getValue, lastOperator, persist, setResult]);

  const FN_LABELS: Record<string, string> = {
    pow2: 'x²',
    tenpow: '10ˣ',
    exp: 'eˣ',
    sqrt: '√',
    abs: '|x|',
    factorial: 'n!',
  };

  const runUnary = useCallback(
    async (operation: string) => {
      const label = FN_LABELS[operation] ?? operation;
      setLoading(true);
      try {
        const value = getValue();
        const { result } = await api.evaluate({ operation, value, angleMode });
        const formatted = setResult(result, `${label}(${formatNumber(value)}) =`);
        await persist(`${label}(${formatNumber(value)})`, formatted, {
          operation,
          angleMode,
        });
      } catch {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    },
    [angleMode, getValue, persist, setResult],
  );

  const runBinaryOp = useCallback(
    async (operation: string, base: number, exp: number, expr: string) => {
      setLoading(true);
      try {
        const { result } = await api.evaluate({
          operation,
          value: base,
          secondValue: exp,
          angleMode,
        });
        const formatted = setResult(result, `${expr} =`);
        await persist(expr, formatted);
        setPowBase(null);
      } catch {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    },
    [angleMode, persist, setResult],
  );

  const handleAction = useCallback(
    async (action: string, value?: string) => {
      if (display === 'Error' && action !== 'clear') clearAll();

      switch (action) {
        case 'digit':
          if (waitingForOperand) setDisplay(value ?? '0');
          else setDisplay(display === '0' ? (value ?? '0') : display + value);
          setWaitingForOperand(false);
          break;
        case 'decimal':
          if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
          } else if (!display.includes('.')) setDisplay(display + '.');
          break;
        case 'clear':
          clearAll();
          break;
        case 'toggle-sign':
          if (display !== '0' && display !== 'Error') {
            setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
          }
          break;
        case 'percent': {
          setLoading(true);
          try {
            const { result } = await api.evaluate({
              operation: 'percent',
              value: getValue(),
            });
            setResult(result);
          } catch {
            setDisplay('Error');
          } finally {
            setLoading(false);
          }
          break;
        }
        case 'operator':
          if (powBase !== null) {
            const base = parseFloat(powBase);
            const exp = getValue();
            await runBinaryOp('pow', base, exp, `${formatNumber(base)} ^ ${formatNumber(exp)}`);
            return;
          }
          applyOperator(value ?? '+', getValue());
          break;
        case 'equals':
          if (powBase !== null) {
            const base = parseFloat(powBase);
            const exp = getValue();
            await runBinaryOp('pow', base, exp, `${formatNumber(base)} ^ ${formatNumber(exp)}`);
          } else {
            await calculate();
          }
          break;
        case 'function':
          await runUnary(value ?? 'sqrt');
          break;
        case 'constant':
          if (value === 'pi') setResult(Math.PI);
          if (value === 'e') setResult(Math.E);
          break;
        case 'pow':
          setPowBase(display);
          setExpression(`${display} ^ `);
          setWaitingForOperand(true);
          break;
        case 'angle-mode':
          setAngleMode((m) => (m === 'deg' ? 'rad' : 'deg'));
          break;
        case 'mc':
          setMemory(0);
          setHasMemory(false);
          break;
        case 'mr':
          if (hasMemory) {
            setDisplay(formatNumber(memory));
            setWaitingForOperand(true);
          }
          break;
        case 'm-plus':
          setMemory((m) => m + getValue());
          setHasMemory(true);
          break;
        case 'm-minus':
          setMemory((m) => m - getValue());
          setHasMemory(true);
          break;
        default:
          break;
      }
    },
    [
      applyOperator,
      calculate,
      clearAll,
      display,
      getValue,
      hasMemory,
      memory,
      powBase,
      runBinaryOp,
      runUnary,
      setResult,
      waitingForOperand,
    ],
  );

  return {
    display,
    expression,
    hasMemory,
    angleMode,
    loading,
    handleAction,
    clearAll,
    setDisplay,
    setExpression,
  };
}
