interface ResultRendererProps {
  data: any;
  isNested?: boolean;
}

export function ResultRenderer({
  data,
  isNested = false,
}: ResultRendererProps) {
  if (typeof data === 'string' || typeof data === 'number') {
    return (
      <span
        className={`${
          isNested ? 'text-sm' : 'text-base'
        } text-primary font-serif italic whitespace-pre-wrap`}
      >
        {String(data)}
      </span>
    );
  }

  if (!data) {
    return null;
  }

  if (data.type === 'note') {
    return (
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-black text-primary/40 block">
          Notatka: {data.name}
        </span>
        <p className="text-sm line-clamp-3">{data.content}</p>
      </div>
    );
  }

  if (data.type === 'character') {
    return (
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-black text-primary/40 block">
          Postać: {data.name}
        </span>
        <p className="text-sm">
          {data.race} • {data.profession}
        </p>
      </div>
    );
  }

  if (data.type === 'dice') {
    const hasName = Boolean(data.name);

    return (
      <div className="space-y-1">
        {hasName && (
          <span className="text-[10px] uppercase font-black text-primary/40 block">
            Kości: {data.name}
          </span>
        )}

        <div className="text-primary font-serif italic text-base">
          {data.total}
        </div>

        {data.formula && (
          <div className="inline-flex items-center px-2 py-1 rounded border border-primary/20 bg-primary/5 text-[10px] uppercase font-black tracking-widest text-primary/50 font-mono">
            {data.formula}
          </div>
        )}

        {Array.isArray(data.rolls) && data.rolls.length > 0 && (
          <p className="text-xs text-primary/60">
            Rzuty: <span className="font-bold">{data.rolls.join(', ')}</span>
          </p>
        )}

        {hasName && typeof data.modifier === 'number' && (
          <p className="text-xs text-primary/60">
            Modyfikator:{' '}
            <span className="font-bold">
              {data.modifier > 0 ? `+${data.modifier}` : data.modifier}
            </span>
          </p>
        )}

        {hasName && data.description && (
          <p className="text-xs italic text-primary/50">{data.description}</p>
        )}
      </div>
    );
  }

  if (data.text !== undefined && data.nested !== undefined) {
    return (
      <div className="space-y-2">
        {data.text && (
          <div className="text-primary font-serif italic text-base">
            {data.text}
          </div>
        )}

        <div className="pl-4 border-l-2 border-primary/10">
          <ResultRenderer data={data.nested} isNested={true} />
        </div>
      </div>
    );
  }

  const entries = Object.entries(data);

  if (isNested && entries.length === 1) {
    return <ResultRenderer data={entries[0][1]} isNested={true} />;
  }

  return (
    <div className="space-y-3 not-italic font-sans">
      {entries.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col border-l-2 border-primary/20 pl-3"
        >
          <span className="text-[10px] uppercase font-black text-primary/40 tracking-tighter leading-none mb-1">
            {label}
          </span>
          <ResultRenderer data={value} isNested={true} />
        </div>
      ))}
    </div>
  );
}