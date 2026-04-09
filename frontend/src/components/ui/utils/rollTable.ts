import { RandomTable, TableOption } from '../../../types';

interface PerformRollArgs {
  table: RandomTable;
  allTables: RandomTable[];
  activeVariants: Record<string, string[]>;
  selectedVariantIds: string[];
}

export const formatResultForClipboard = (res: any, indent = 0): string => {
  const space = '  '.repeat(indent);

  if (typeof res === 'string') return res;

  if (res.type === 'note') {
    return `${space}Notatka: ${res.name}\n${space}${res.content}`;
  }

  if (res.type === 'character') {
    return `${space}Postać: ${res.name}\n${space}${res.race} • ${res.profession}`;
  }

  if (res.text !== undefined && res.nested !== undefined) {
    const nestedTitle = res.nestedTableName
      ? `\n${space}Z generatora: ${res.nestedTableName}`
      : '';
    const ownText = res.text ? `${space}${res.text}\n` : '';

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
    const activeFields = activeVariants[table.id] || table.fields.map((f) => f.source);

    table.fields.forEach((field) => {
      if (!activeFields.includes(field.source)) return;

      const options = table.multiTables?.[field.source] || [];

      if (options.length === 0) {
        result[field.label] = 'Brak danych';
        return;
      }

      const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
      let random = Math.random() * totalWeight;

      for (const option of options) {
        random -= option.weight;

        if (random <= 0) {
          if (option.nestedTableId) {
            const nestedTable = allTables.find((t) => t.id === option.nestedTableId);

            if (nestedTable) {
              const nestedRes = performRoll({
                table: nestedTable,
                allTables,
                activeVariants,
                selectedVariantIds: [],
              });

              result[field.label] = {
                text: option.text,
                nested: nestedRes,
                nestedTableId: nestedTable.id,
                nestedTableName: nestedTable.name,
              };
              break;
            }
          }

          result[field.label] = option.text;
          break;
        }
      }
    });

    return result;
  }

  let optionsToUse: TableOption[] = Array.isArray(table.options) ? [...table.options] : [];

  if (selectedVariantIds.length > 0) {
    selectedVariantIds.forEach((vId) => {
      const variant = table.variants?.find((v) => v.id === vId);
      if (variant) {
        optionsToUse.push(...variant.options);
      }
    });
  }

  const totalWeight = optionsToUse.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * totalWeight;

  for (const option of optionsToUse) {
    random -= option.weight;

    if (random <= 0) {
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
            text: option.text,
            nested: nestedRes,
            nestedTableId: nestedTable.id,
            nestedTableName: nestedTable.name,
          };
        }
      }

      return option.text;
    }
  }

  return optionsToUse[0]?.text || 'Błąd rzutu';
}