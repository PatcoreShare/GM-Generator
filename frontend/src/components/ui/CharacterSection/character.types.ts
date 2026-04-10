export type CharacterEdition = '2ed' | '4ed';

export interface SystemCharacterSectionProps {
  race: string;
  setRace: (value: string) => void;

  stats: Record<string, number>;
  setStats: (
    value:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>)
  ) => void;

  secondaryStats: Record<string, number>;
  setSecondaryStats: (
    value:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>)
  ) => void;
}