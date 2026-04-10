import { ArchiveItem } from '../../../types';
import { Button } from '../button';
import { Download, Edit, FileText, Table as TableIcon, Trash2, Users, User as UserIcon, CopyPlus } from 'lucide-react';

interface GeneratorGridProps {
  generators: ArchiveItem[];
  currentUser: any;
  previewItem: ArchiveItem | null;
  activeVariants: Record<string, string[]>;
  handlePreview: (item: ArchiveItem) => void;
  handleClone: (item: ArchiveItem) => void;
  handleExport: (item: ArchiveItem) => void;
  onEdit: (item: ArchiveItem) => void;
  onDelete: (id: string) => void;
}

export function GeneratorGrid({
  generators,
  currentUser,
  previewItem,
  activeVariants,
  handlePreview,
  handleClone,
  handleExport,
  onEdit,
  onDelete,
}: GeneratorGridProps) {
  return (
    <div className="xl:col-span-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {generators.map((item) => {
          const isOwner = item.ownerId === currentUser.id;
          const isAdmin = currentUser.role === 'admin';
          const canEdit = isOwner || isAdmin;

          return (
            <div
              key={item.id}
              className={`parchment-card group relative aspect-[5/3] flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:border-primary hover:shadow-lg transition-all hover:bg-primary/5 select-none overflow-hidden ${
                previewItem?.id === item.id ? 'border-primary ring-1 ring-primary/20' : ''
              }`}
              onClick={() => handlePreview(item)}
            >
              <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {canEdit && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(item);
                      }}
                      className="h-6 w-6 bg-background/90 border border-primary/20 text-primary/60 hover:text-primary hover:bg-primary/10 shadow-sm"
                      title="Eksportuj do JSON"
                    >
                      <Download className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      className="h-6 w-6 bg-background/90 border border-primary/20 text-primary/60 hover:text-primary hover:bg-primary/10 shadow-sm"
                      title="Edytuj"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="h-6 w-6 bg-background/90 border border-primary/20 text-primary/20 hover:text-destructive hover:bg-destructive/10 shadow-sm"
                      title="Usuń"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )}

                {!isOwner && item.isBuiltIn && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClone(item);
                    }}
                    className="h-6 w-6 bg-background/90 border border-primary/20 text-primary/60 hover:text-primary hover:bg-primary/10 shadow-sm"
                    title="Skopiuj do swoich"
                  >
                    <CopyPlus className="w-3 h-3" />
                  </Button>
                )}
              </div>

              <div className="bg-primary/10 p-1 rounded-full mb-1 group-hover:bg-primary/20 transition-colors">
                {item.type === 'table' && <TableIcon className="w-3 h-3 text-primary" />}
                {item.type === 'note' && <FileText className="w-3 h-3 text-primary" />}
                {item.type === 'character' && <Users className="w-3 h-3 text-primary" />}
              </div>

              <h3 className="font-bold text-primary text-[10px] leading-tight mb-0.5 line-clamp-2 px-1 uppercase tracking-tighter">
                {item.name}
              </h3>

              {item.type === 'table' && activeVariants[item.id]?.length > 0 && (
                <div className="text-[8px] text-primary/40 font-bold uppercase mt-1">
                  +{activeVariants[item.id].length} warianty
                </div>
              )}

              {isAdmin && (
                <div className="flex items-center gap-1 text-[8px] text-primary/40 font-bold uppercase mt-1">
                  <UserIcon className="w-2 h-2" />
                  {item.ownerName || 'Nieznany'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}