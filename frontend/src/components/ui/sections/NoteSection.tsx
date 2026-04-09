import { Input } from '../input';
import { Button } from '../button';
import {
  Plus,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Trash2,
} from 'lucide-react';

export function NoteSection({
  noteBlocks,
  setNoteBlocks,
  addNoteBlock,
  moveNoteBlock,
}) {
  return (
    <div className="md:col-span-2 space-y-6">
      <div className="flex justify-between items-center border-b border-primary/20 pb-2">
        <label className="text-xs font-bold uppercase tracking-widest text-primary">
          Bloki Notatki
        </label>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNoteBlock('text')}
            className="h-8 border-primary/30 text-primary"
          >
            <Plus className="w-3 h-3 mr-2" /> Dodaj Tekst
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNoteBlock('image')}
            className="h-8 border-primary/30 text-primary"
          >
            <ImageIcon className="w-3 h-3 mr-2" /> Dodaj Obraz
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {noteBlocks.map((block, idx) => (
          <div
            key={block.id}
            className="relative group bg-primary/5 p-4 rounded border border-primary/10"
          >
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveNoteBlock(idx, 'up')}
                  disabled={idx === 0}
                  className="h-6 w-6 rounded-full bg-background border border-primary/20 text-primary/60 hover:text-primary disabled:opacity-30"
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveNoteBlock(idx, 'down')}
                  disabled={idx === noteBlocks.length - 1}
                  className="h-6 w-6 rounded-full bg-background border border-primary/20 text-primary/60 hover:text-primary disabled:opacity-30"
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </div>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() =>
                  setNoteBlocks(noteBlocks.filter((b) => b.id !== block.id))
                }
                className="h-6 w-6 rounded-full shadow-lg"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {block.type === 'text' ? (
              <textarea
                value={block.content}
                onChange={(e) => {
                  const newBlocks = [...noteBlocks];
                  newBlocks[idx].content = e.target.value;
                  setNoteBlocks(newBlocks);
                }}
                className="w-full min-h-[100px] bg-transparent border-none font-serif italic text-lg focus:ring-0 resize-none"
                placeholder="Wpisz tekst..."
              />
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={block.content}
                    onChange={(e) => {
                      const newBlocks = [...noteBlocks];
                      newBlocks[idx].content = e.target.value;
                      setNoteBlocks(newBlocks);
                    }}
                    placeholder="URL obrazka..."
                    className="bg-background border-primary/30 text-xs"
                  />

                  <Input
                    value={block.width || ''}
                    onChange={(e) => {
                      const newBlocks = [...noteBlocks];
                      newBlocks[idx].width = e.target.value;
                      setNoteBlocks(newBlocks);
                    }}
                    placeholder="Szerokość (np. 100%)"
                    className="w-32 bg-background border-primary/30 text-xs"
                  />
                </div>

                {block.content && (
                  <div className="flex justify-center border border-primary/10 rounded overflow-hidden bg-background/50">
                    <img
                      src={block.content}
                      alt="Podgląd"
                      className="max-h-40 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}