const MAX_DISPLAY = 16;

export function formatNumber(num: number): string {
  if (!Number.isFinite(num)) return 'Error';
  if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(8).replace(/\.?0+e/, 'e');
  }
  const str = parseFloat(num.toPrecision(MAX_DISPLAY)).toString();
  return str.length > MAX_DISPLAY ? num.toExponential(6) : str;
}
