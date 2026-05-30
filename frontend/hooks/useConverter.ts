'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, type SavedConversion } from '@/lib/api';
import { formatNumber } from '@/lib/format';
import { DEFAULT_CATEGORIES } from '@/lib/units';

export function useConverter(onConverted?: (expr: string, result: string) => void) {
  const [value, setValue] = useState('1');
  const [result, setResult] = useState('—');
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [categories, setCategories] = useState<Record<string, string[]>>(DEFAULT_CATEGORIES);
  const [presets, setPresets] = useState<SavedConversion[]>([]);
  const [loading, setLoading] = useState(false);

  const units = categories[category] ?? DEFAULT_CATEGORIES[category] ?? [];

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
    api.getPresets().then(setPresets).catch(() => {});
  }, []);

  useEffect(() => {
    const u = categories[category] ?? DEFAULT_CATEGORIES[category];
    if (u?.length) {
      setFromUnit(u[0]);
      setToUnit(u[1] ?? u[0]);
    }
  }, [category, categories]);

  const convert = useCallback(async () => {
    const num = parseFloat(value);
    if (!Number.isFinite(num)) {
      setResult('—');
      return;
    }
    setLoading(true);
    try {
      const res = await api.convert({
        value: num,
        category,
        fromUnit,
        toUnit,
      });
      const formatted = formatNumber(res.result);
      setResult(`${formatted} ${toUnit}`);
      const expr = `${formatNumber(num)} ${fromUnit} → ${toUnit}`;
      onConverted?.(expr, `${formatted} ${toUnit}`);
      await api.saveCalculation({
        mode: 'CONVERTER',
        expression: expr,
        result: `${formatted} ${toUnit}`,
        metadata: { category, fromUnit, toUnit },
      });
    } catch {
      setResult('Error');
    } finally {
      setLoading(false);
    }
  }, [category, fromUnit, onConverted, toUnit, value]);

  useEffect(() => {
    const t = setTimeout(() => void convert(), 300);
    return () => clearTimeout(t);
  }, [convert]);

  const swapUnits = useCallback(() => {
    const match = result.match(/^([\d.eE+\-]+)\s+(\S+)$/);
    if (match) setValue(match[1]);
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, result, toUnit]);

  const savePreset = useCallback(async () => {
    try {
      const preset = await api.savePreset({ category, fromUnit, toUnit });
      setPresets((p) => [preset, ...p]);
    } catch {
      /* ignore */
    }
  }, [category, fromUnit, toUnit]);

  const applyPreset = useCallback((p: SavedConversion) => {
    setCategory(p.category);
    setFromUnit(p.fromUnit);
    setToUnit(p.toUnit);
  }, []);

  return {
    value,
    setValue,
    result,
    category,
    setCategory,
    fromUnit,
    setFromUnit,
    toUnit,
    setToUnit,
    units,
    presets,
    loading,
    swapUnits,
    savePreset,
    applyPreset,
    convert,
  };
}
