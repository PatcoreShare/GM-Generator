export function rollFromTable(table) {
  const totalWeight = table.options.reduce((sum, o) => sum + o.weight, 0);
  let random = Math.random() * totalWeight;

  for (const opt of table.options) {
    random -= opt.weight;
    if (random <= 0) return opt.text;
  }

  return '';
}