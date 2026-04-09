import { ArchiveItem, RandomTable, User } from '../types';
import { useGeneratorList } from './ui/hooks/useGeneratorList';
import { GeneratorGrid } from './ui/sections/GeneratorGrid';
import { PreviewPanel } from './ui/sections/PreviewPanel';

interface GeneratorListProps {
  generators: ArchiveItem[];
  allTables: RandomTable[];
  onEdit: (item: ArchiveItem) => void;
  onDelete: (id: string) => void;
  currentUser: User;
}

export function GeneratorList(props: GeneratorListProps) {
  const list = useGeneratorList(props);

  if (props.generators.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
        <p className="text-primary/60 italic">
          Archiwa są puste. Spisz nową treść, aby zacząć.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
      <GeneratorGrid {...list} />
      <PreviewPanel {...list} />
    </div>
  );
}