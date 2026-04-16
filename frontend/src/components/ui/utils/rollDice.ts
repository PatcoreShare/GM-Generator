export interface DiceTermResult {
  type: 'dice' | 'modifier';
  sign: 1 | -1;
  formula: string;
  rolls: number[];
  subtotal: number;
}

export interface RollDiceResult {
  total: number;
  rolls: number[];
  modifier: number;
  terms: DiceTermResult[];
}

interface ParsedDicePart {
  total: number;
  rolls: number[];
  modifier: number;
  terms: DiceTermResult[];
}

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const normalizeFormula = (formula: string) =>
  formula
    .replace(/\s+/g, '')
    .toLowerCase()
    .replace(/×/g, '*')
    .replace(/x/g, '*')
    .replace(/k/g, 'd');

const parseAdditiveDice = (formula: string): ParsedDicePart => {
  if (!formula) {
    throw new Error('Nieprawidłowa formuła kości.');
  }

  const prepared =
    formula.startsWith('+') || formula.startsWith('-') ? formula : `+${formula}`;

  const tokens = prepared.match(/[+-][^+-]+/g);

  if (!tokens || tokens.length === 0) {
    throw new Error('Nieprawidłowa formuła kości.');
  }

  const allRolls: number[] = [];
  const terms: DiceTermResult[] = [];
  let total = 0;
  let modifier = 0;

  for (const token of tokens) {
    const sign: 1 | -1 = token.startsWith('-') ? -1 : 1;
    const body = token.slice(1);

    const diceMatch = body.match(/^(\d*)d(\d+)$/);

    if (diceMatch) {
      const count = diceMatch[1] ? parseInt(diceMatch[1], 10) : 1;
      const sides = parseInt(diceMatch[2], 10);

      if (count <= 0 || sides <= 0) {
        throw new Error(`Nieprawidłowy segment kości: ${token}`);
      }

      const rolls: number[] = [];
      let subtotal = 0;

      for (let i = 0; i < count; i++) {
        const roll = randomInt(1, sides);
        rolls.push(roll);
        allRolls.push(sign === 1 ? roll : -roll);
        subtotal += roll;
      }

      total += sign * subtotal;

      terms.push({
        type: 'dice',
        sign,
        formula: `${count}d${sides}`,
        rolls,
        subtotal: sign * subtotal,
      });

      continue;
    }

    const numberMatch = body.match(/^\d+$/);

    if (numberMatch) {
      const value = parseInt(body, 10);
      modifier += sign * value;
      total += sign * value;

      terms.push({
        type: 'modifier',
        sign,
        formula: body,
        rolls: [],
        subtotal: sign * value,
      });

      continue;
    }

    throw new Error(`Nieprawidłowy segment formuły: ${token}`);
  }

  return { total, rolls: allRolls, modifier, terms };
};

export const rollDice = (formula: string): RollDiceResult => {
  const normalized = normalizeFormula(formula);

  if (!normalized) {
    throw new Error('Nieprawidłowa formuła kości.');
  }

  const factors = normalized.split('*').filter(Boolean);

  if (factors.length === 0) {
    throw new Error('Nieprawidłowa formuła kości.');
  }

  if (factors.length === 1) {
    return parseAdditiveDice(factors[0]);
  }

  let total = 1;
  let modifier = 0;
  const rolls: number[] = [];
  const terms: DiceTermResult[] = [];

  for (const factor of factors) {
    const parsed = parseAdditiveDice(factor);
    total *= parsed.total;
    modifier += parsed.modifier;
    rolls.push(...parsed.rolls);
    terms.push(...parsed.terms);
  }

  return { total, rolls, modifier, terms };
};