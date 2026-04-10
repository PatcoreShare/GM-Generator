interface ResultRendererProps {
  data: any;
  isNested?: boolean;
}

export function ResultRenderer({
  data,
  isNested = false,
}: ResultRendererProps) {
  if (typeof data === 'string') {
    return (
      <span
        className={`${isNested ? 'text-sm' : 'text-base'} text-primary font-serif italic whitespace-pre-wrap`}
      >
        {data}
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

  if (data.text !== undefined && data.nested !== undefined) {
    return (
      <div className="space-y-2">
        {data.text && (
          <div className="text-primary font-serif italic text-base">
            {data.text}
          </div>
        )}

        {data.nestedTableName && (
          <div className="inline-flex items-center px-2 py-1 rounded border border-primary/20 bg-primary/5 text-[10px] uppercase font-black tracking-widest text-primary/50">
            Generator: {data.nestedTableName}
          </div>
        )}

        <div className="pl-4 border-l-2 border-primary/10">
          <ResultRenderer data={data.nested} isNested={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 not-italic font-sans">
      {Object.entries(data).map(([label, value]) => (
        <div key={label} className="flex flex-col border-l-2 border-primary/20 pl-3">
          <span className="text-[10px] uppercase font-black text-primary/40 tracking-tighter leading-none mb-1">
            {label}
          </span>
          <ResultRenderer data={value} isNested={true} />
        </div>
      ))}
    </div>
  );
}