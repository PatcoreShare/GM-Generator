export const rollDice = (formula: string): { total: number; rolls: number[]; modifier: number } => {
  // Normalize formula: remove spaces, lowercase
  const normalized = formula.replace(/\s+/g, '').toLowerCase();
  
  // Match XdY+Z or XdY-Z or XdY
  const match = normalized.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  
  if (!match) {
    throw new Error("Nieprawidłowa formuła kości. Użyj formatu np. 1d20, 2d6+4");
  }
  
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;
  
  const rolls: number[] = [];
  let total = 0;
  
  for (let i = 0; i < count; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }
  
  total += modifier;
  
  return { total, rolls, modifier };
};
