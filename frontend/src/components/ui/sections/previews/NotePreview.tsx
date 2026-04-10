import { NoteArchive } from '../../../../types';

interface NotePreviewProps {
  previewItem: NoteArchive;
}

export function NotePreview({ previewItem }: NotePreviewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-4">
        {previewItem.blocks.map((block) => (
          <div key={block.id}>
            {block.type === 'text' ? (
              <p className="font-serif italic text-xl text-primary leading-relaxed whitespace-pre-wrap">
                {block.content}
              </p>
            ) : (
              <div className="flex justify-center py-4">
                <img
                  src={block.content}
                  alt="Obraz w notatce"
                  style={{ width: block.width || '100%' }}
                  className="rounded shadow-lg border-4 border-double border-primary/20"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}