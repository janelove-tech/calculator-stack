/** Client-side unit conversion when API is unavailable. */

const UNIT_TABLES: Record<string, Record<string, number>> = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.344,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.028349523125,
    t: 1000,
  },
  volume: {
    L: 1,
    mL: 0.001,
    gal: 3.785411784,
    qt: 0.946352946,
    pt: 0.473176473,
    cup: 0.2365882365,
    floz: 0.0295735295625,
  },
  area: {
    'm²': 1,
    'km²': 1e6,
    'cm²': 0.0001,
    'ft²': 0.09290304,
    'in²': 0.00064516,
    acre: 4046.8564224,
    ha: 10000,
  },
  time: {
    s: 1,
    ms: 0.001,
    min: 60,
    h: 3600,
    d: 86400,
    wk: 604800,
  },
};

function convertTemperature(value: number, from: string, to: string): number {
  let c: number;
  if (from === 'C') c = value;
  else if (from === 'F') c = ((value - 32) * 5) / 9;
  else c = value - 273.15;

  if (to === 'C') return c;
  if (to === 'F') return (c * 9) / 5 + 32;
  return c + 273.15;
}

export function convertLocal(
  value: number,
  category: string,
  fromUnit: string,
  toUnit: string,
): number {
  if (category === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }
  const table = UNIT_TABLES[category];
  if (!table || !(fromUnit in table) || !(toUnit in table)) {
    throw new Error('Invalid unit');
  }
  return (value * table[fromUnit]) / table[toUnit];
}

export function getLocalCategories(): Record<string, string[]> {
  return {
    ...Object.fromEntries(
      Object.entries(UNIT_TABLES).map(([k, v]) => [k, Object.keys(v)]),
    ),
    temperature: ['C', 'F', 'K'],
  };
}
