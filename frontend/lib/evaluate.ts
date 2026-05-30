/** Client-side math (used when API is unavailable). Mirrors backend EvaluateService. */

export function evaluateLocal(
  operation: string,
  value: number,
  secondValue?: number,
  angleMode: 'deg' | 'rad' = 'deg',
): number {
  const toRad = (x: number) => (angleMode === 'deg' ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (angleMode === 'deg' ? (x * 180) / Math.PI : x);

  switch (operation) {
    case 'add':
      if (secondValue === undefined) throw new Error('secondValue required');
      return value + secondValue;
    case 'subtract':
      if (secondValue === undefined) throw new Error('secondValue required');
      return value - secondValue;
    case 'multiply':
      if (secondValue === undefined) throw new Error('secondValue required');
      return value * secondValue;
    case 'divide':
      if (secondValue === undefined) throw new Error('secondValue required');
      if (secondValue === 0) throw new Error('Division by zero');
      return value / secondValue;
    case 'percent':
      return value / 100;
    case 'sin':
      return Math.sin(toRad(value));
    case 'cos':
      return Math.cos(toRad(value));
    case 'tan':
      return Math.tan(toRad(value));
    case 'asin':
      return fromRad(Math.asin(value));
    case 'acos':
      return fromRad(Math.acos(value));
    case 'atan':
      return fromRad(Math.atan(value));
    case 'log':
      if (value <= 0) throw new Error('Invalid domain');
      return Math.log10(value);
    case 'ln':
      if (value <= 0) throw new Error('Invalid domain');
      return Math.log(value);
    case 'sqrt':
      if (value < 0) throw new Error('Invalid domain');
      return Math.sqrt(value);
    case 'pow2':
      return value * value;
    case 'pow':
      if (secondValue === undefined) throw new Error('secondValue required');
      return Math.pow(value, secondValue);
    case 'exp':
      return Math.exp(value);
    case 'tenpow':
      return Math.pow(10, value);
    case 'abs':
      return Math.abs(value);
    case 'factorial': {
      const n = Math.round(value);
      if (n < 0 || !Number.isInteger(n) || n > 170) throw new Error('Invalid factorial');
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    }
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
