import { rollDice } from './rollDice';

const isDiceFormula = (value?: string): boolean => {
  if (!value) return false;

  const normalized = value.replace(/\s+/g, '').toLowerCase();

  if (!/[dk]/.test(normalized)) return false;

  return /^[0-9dkx×*+\-]+$/.test(normalized);
};

export function rollFromTable(table) {
  const totalWeight = table.options.reduce((sum, o) => sum + o.weight, 0);
  let random = Math.random() * totalWeight;

  for (const opt of table.options) {
    random -= opt.weight;

    if (random <= 0) {
      if (isDiceFormula(opt.text)) {
        return rollDice(opt.text).total;
      }

      return opt.text ?? '';
    }
  }

  return '';
}