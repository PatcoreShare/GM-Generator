import { RandomTable, TableOption } from '../../../types';
import { rollDice } from './rollDice';

interface PerformRollArgs {
  table: RandomTable;
  allTables: RandomTable[];
  activeVariants: Record<string, string[]>;
  selectedVariantIds: string[];
}

const isDiceFormula = (value?: string): boolean => {
  if (!value) return false;

  const normalized = value.replace(/\s+/g, '').toLowerCase();

  if (!/[dk]/.test(normalized)) return false;

  return /^[0-9dkx×*+\-]+$/.test(normalized);
};

const pickWeightedOption = (options: TableOption[]): TableOption | null => {
  if (!options.length) return null;

  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * totalWeight;

  for (const option of options) {
    random -= option.weight;
    if (random <= 0) return option;
  }

  return options[0] ?? null;
};

const resolveTextOrDice = (text?: string) => {
  if (!text) return '';

  if (isDiceFormula(text)) {
    const rolled = rollDice(text);

    return {
      type: 'dice',
      formula: text,
      total: rolled.total,
      rolls: rolled.rolls,
      modifier: rolled.modifier,
      terms: rolled.terms,
    };
  }

  return text;
};

const resolveOptionResult = (
  option: TableOption,
  allTables: RandomTable[],
  activeVariants: Record<string, string[]>
): any => {
  if (option.nestedTableId) {
    const nestedTable = allTables.find((t) => t.id === option.nestedTableId);

    if (nestedTable) {
      const nestedRes = performRoll({
        table: nestedTable,
        allTables,
        activeVariants,
        selectedVariantIds: [],
      });

      return {
        text: option.text ?? '',
        nested: nestedRes,
        nestedTableId: nestedTable.id,
        nestedTableName: nestedTable.name,
        nestedIsVisible: nestedTable.isVisible !== false,
      };
    }
  }

  return resolveTextOrDice(option.text);
};

export const formatResultForClipboard = (res: any, indent = 0): string => {
  const space = '  '.repeat(indent);

  if (typeof res === 'string' || typeof res === 'number') {
    return String(res);
  }

  if (res?.type === 'dice') {
    return res.formula ? `${res.total} (${res.formula})` : `${res.total}`;
  }

  if (res?.type === 'note') {
    return `${space}Notatka: ${res.name}\n${space}${res.content}`;
  }

  if (res?.type === 'character') {
    return `${space}Postać: ${res.name}\n${space}${res.race} • ${res.profession}`;
  }

  if (res?.text !== undefined && res?.nested !== undefined) {
    const shouldShowNestedTitle =
      res.nestedTableName && res.nestedIsVisible !== false;

    const nestedTitle = shouldShowNestedTitle
      ? `\n${space}Z generatora: ${res.nestedTableName}`
      : '';

    const ownText =
      typeof res.text === 'string' && res.text.trim()
        ? `${space}${res.text}\n`
        : '';

    return `${ownText}${nestedTitle}\n${formatResultForClipboard(
      res.nested,
      indent + 1
    )}`.trim();
  }

  return Object.entries(res)
    .map(([k, v]) => `${space}${k}: ${formatResultForClipboard(v, indent + 1)}`)
    .join('\n');
};

export function performRoll({
  table,
  allTables,
  activeVariants,
  selectedVariantIds,
}: PerformRollArgs): any {
  if (table.subType === 'complex' && table.fields && table.multiTables) {
    const result: Record<string, any> = {};
    const activeFields =
      activeVariants[table.id] || table.fields.map((f) => f.source);

    table.fields.forEach((field) => {
      if (!activeFields.includes(field.source)) return;

      const options = table.multiTables?.[field.source] || [];

      if (options.length === 0) {
        result[field.label] = 'Brak danych';
        return;
      }

      const picked = pickWeightedOption(options);

      if (!picked) {
        result[field.label] = 'Brak danych';
        return;
      }

      result[field.label] = resolveOptionResult(
        picked,
        allTables,
        activeVariants
      );
    });

    return result;
  }

  let optionsToUse: TableOption[] = Array.isArray(table.options)
    ? [...table.options]
    : [];

  if (selectedVariantIds.length > 0) {
    selectedVariantIds.forEach((vId) => {
      const variant = table.variants?.find((v) => v.id === vId);
      if (variant) {
        optionsToUse.push(...variant.options);
      }
    });
  }

  const picked = pickWeightedOption(optionsToUse);

  if (!picked) {
    return 'Błąd rzutu';
  }

  return resolveOptionResult(picked, allTables, activeVariants);
}