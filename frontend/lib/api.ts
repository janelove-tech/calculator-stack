import { convertLocal, getLocalCategories } from './convert';
import { evaluateLocal } from './evaluate';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type CalculatorMode = 'STANDARD' | 'SCIENTIFIC' | 'CONVERTER';

export interface CalculationRecord {
  id: string;
  mode: CalculatorMode;
  expression: string;
  result: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface SavedConversion {
  id: string;
  label: string | null;
  category: string;
  fromUnit: string;
  toUnit: string;
  createdAt: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string; database: string }>('/health'),

  getHistory: async (limit = 50) => {
    try {
      return await request<CalculationRecord[]>(`/calculations?limit=${limit}`);
    } catch {
      return getLocalHistory();
    }
  },

  saveCalculation: async (data: {
    mode: CalculatorMode;
    expression: string;
    result: string;
    metadata?: Record<string, unknown>;
  }) => {
    try {
      return await request<CalculationRecord>('/calculations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return saveLocalHistory(data);
    }
  },

  clearHistory: async () => {
    try {
      return await request<{ count: number }>('/calculations', {
        method: 'DELETE',
      });
    } catch {
      clearLocalHistory();
      return { count: 0 };
    }
  },

  deleteCalculation: async (id: string) => {
    try {
      return await request<CalculationRecord>(`/calculations/${id}`, {
        method: 'DELETE',
      });
    } catch {
      deleteLocalHistory(id);
      return null;
    }
  },

  evaluate: async (data: {
    operation: string;
    value: number;
    secondValue?: number;
    angleMode?: 'deg' | 'rad';
  }) => {
    try {
      return await request<{ result: number; operation: string }>('/evaluate', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return {
        result: evaluateLocal(
          data.operation,
          data.value,
          data.secondValue,
          data.angleMode ?? 'deg',
        ),
        operation: data.operation,
      };
    }
  },

  convert: async (data: {
    value: number;
    category: string;
    fromUnit: string;
    toUnit: string;
  }) => {
    try {
      return await request<{
        result: number;
        fromUnit: string;
        toUnit: string;
        category: string;
      }>('/conversions/convert', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return {
        ...data,
        result: convertLocal(
          data.value,
          data.category,
          data.fromUnit,
          data.toUnit,
        ),
      };
    }
  },

  getCategories: async () => {
    try {
      return await request<Record<string, string[]>>('/conversions/categories');
    } catch {
      return getLocalCategories();
    }
  },

  getPresets: async () => {
    try {
      return await request<SavedConversion[]>('/conversions/presets');
    } catch {
      return getLocalPresets();
    }
  },

  savePreset: async (data: {
    label?: string;
    category: string;
    fromUnit: string;
    toUnit: string;
  }) => {
    try {
      return await request<SavedConversion>('/conversions/presets', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return saveLocalPreset(data);
    }
  },

  deletePreset: async (id: string) => {
    try {
      return await request<SavedConversion>(`/conversions/presets/${id}`, {
        method: 'DELETE',
      });
    } catch {
      deleteLocalPreset(id);
      return null;
    }
  },
};

const HISTORY_KEY = 'calculator-local-history';
const PRESETS_KEY = 'calculator-local-presets';

function getLocalHistory(): CalculationRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveLocalHistory(data: {
  mode: CalculatorMode;
  expression: string;
  result: string;
  metadata?: Record<string, unknown>;
}): CalculationRecord {
  const entry: CalculationRecord = {
    id: `local-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  const list = [entry, ...getLocalHistory()].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  return entry;
}

function clearLocalHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

function deleteLocalHistory(id: string) {
  const list = getLocalHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

function getLocalPresets(): SavedConversion[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(PRESETS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveLocalPreset(data: {
  label?: string;
  category: string;
  fromUnit: string;
  toUnit: string;
}): SavedConversion {
  const entry: SavedConversion = {
    id: `preset-${Date.now()}`,
    label: data.label ?? null,
    category: data.category,
    fromUnit: data.fromUnit,
    toUnit: data.toUnit,
    createdAt: new Date().toISOString(),
  };
  const list = [entry, ...getLocalPresets()];
  localStorage.setItem(PRESETS_KEY, JSON.stringify(list));
  return entry;
}

function deleteLocalPreset(id: string) {
  const list = getLocalPresets().filter((p) => p.id !== id);
  localStorage.setItem(PRESETS_KEY, JSON.stringify(list));
}
