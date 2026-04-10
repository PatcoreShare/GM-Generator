import { CharacterArmourItem } from '../../../../../types';

export function split2<T>(arr: T[] = []) {
  return {
    left: arr.filter((_, i) => i % 2 === 0),
    right: arr.filter((_, i) => i % 2 === 1),
  };
}

export function getArmourTotals(armour: CharacterArmourItem[]) {
  return armour.reduce(
    (acc, item) => ({
      head: acc.head + (Number(item.head) || 0),
      body: acc.body + (Number(item.body) || 0),
      arms: acc.arms + (Number(item.arms) || 0),
      legs: acc.legs + (Number(item.legs) || 0),
    }),
    { head: 0, body: 0, arms: 0, legs: 0 }
  );
}