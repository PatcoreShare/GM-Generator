import React, { useState, useEffect } from 'react';
import { ArchiveItem, User, RandomTable } from './types';
import { GeneratorList } from './components/GeneratorList';
import { GeneratorForm } from './components/GeneratorForm';
import { ImportExport } from './components/ImportExport';
import { Auth } from './components/Auth';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Toaster } from './components/ui/sonner';
import {
  Plus,
  ChevronLeft,
  Skull,
  ShieldAlert,
  LogOut,
  User as UserIcon,
  FileText,
  Users,
  Table as TableIcon,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('wfrp-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Wszystkie');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [createType, setCreateType] = useState<'table' | 'note' | 'character'>('table');
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/generators?userId=${user.id}&role=${user.role}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast.error('Nie udało się załadować archiwów');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('wfrp-user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wfrp-user');
    toast.info('Wylogowano');
  };

  const handleSave = async (item: ArchiveItem) => {
    if (!user) return;

    try {
      const itemWithOwnership = {
        ...item,
        ownerId: item.ownerId || user.id,
        ownerName: item.ownerName || user.username,
      };

      const response = await fetch('/api/generators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemWithOwnership),
      });

      if (response.ok) {
        toast.success(view === 'create' ? 'Archiwum utworzone' : 'Archiwum zaktualizowane');
        fetchItems();
        setView('list');
        setSelectedItem(null);
      }
    } catch (error) {
      toast.error('Nie udało się zapisać archiwum');
    }
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/generators/${itemToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Archiwum zostało usunięte');
        fetchItems();
      }
    } catch (error) {
      toast.error('Nie udało się usunąć archiwum');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleEdit = (item: ArchiveItem) => {
    setSelectedItem(item);
    setCreateType(item.type);
    setView('edit');
  };

  // Kategorie
  const categories: string[] = ['Wszystkie'];

  if (user?.role === 'admin') {
    categories.push('Użytkownicy');
  }

  const allTags = Array.from(new Set(items.flatMap((g) => g.tags || []))) as string[];
  categories.push(...allTags.sort());

  const filteredItems = items.filter((g) => {
    // ukryte generatory – nie pokazujemy ich na liście zwykłemu użytkownikowi
    const hiddenForUser = user?.role !== 'admin' && g.isVisible === false;
    if (hiddenForUser) return false;

    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCategory = activeCategory === 'Wszystkie';
    if (!matchesCategory) {
      if (activeCategory === 'Użytkownicy') {
        if (selectedOwnerId) {
          matchesCategory = g.ownerId === selectedOwnerId;
        } else {
          return false;
        }
      } else {
        matchesCategory = (g.tags || []).includes(activeCategory);
      }
    }

    return matchesSearch && matchesCategory;
  });

  const uniqueUsers = Array.from(
    new Map(items.filter((g) => !g.isBuiltIn).map((g) => [g.ownerId, g.ownerName])).entries()
  ).map(([id, name]) => ({ id, name }));

  if (!user) {
    return (
      <>
        <Auth onLogin={handleLogin} />
        <Toaster position="bottom-right" theme="light" richColors />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="border-b-4 border-double border-primary/40 bg-background/80 sticky top-0 z-10 backdrop-blur-md shadow-sm">
        <div className="max-w-full mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('list')}>
            <div className="bg-primary p-2 rounded shadow-inner border border-primary-foreground/20">
              <Skull className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter fancy-heading uppercase leading-none">
                Archiwum WFRP
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">
                Repozytorium Imperialne
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4 border-r border-primary/10 pr-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                  Zalogowany jako:
                </p>
                <p className="text-xs font-black text-primary uppercase">
                  {user.username} {user.role === 'admin' && '(ADMIN)'}
                </p>
              </div>
              <div className="bg-primary/10 p-2 rounded">
                <UserIcon className="w-4 h-4 text-primary" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-primary/40 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {view === 'list' && (
              <>
                <ImportExport onImport={fetchItems} currentUser={user} />
                <Button onClick={() => setShowTypeSelector(true)} className="wfrp-button">
                  <Plus className="w-4 h-4 mr-2" /> Nowy Wpis
                </Button>
              </>
            )}
            {view !== 'list' && (
              <Button
                variant="ghost"
                onClick={() => setView('list')}
                className="text-primary/60 hover:text-primary font-bold uppercase text-xs tracking-widest"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Powrót do Archiwum
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ShieldAlert className="w-16 h-16 text-primary/20 animate-pulse" />
            <p className="text-primary/40 italic font-serif">
              Konsultowanie starożytnych zwojów...
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {view === 'list' && (
              <>
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col gap-4 border-b border-primary/10 pb-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <h2 className="text-2xl font-bold fancy-heading uppercase tracking-tight">
                        Imperialne Archiwa
                      </h2>
                      <div className="w-full sm:w-64">
                        <Input
                          placeholder="Szukaj..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-background border-primary/30 h-9"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setActiveCategory(category);
                            setSelectedOwnerId(null);
                          }}
                          className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                            activeCategory === category
                              ? 'border-primary text-primary bg-primary/5'
                              : 'border-transparent text-primary/40 hover:text-primary/60 hover:bg-primary/5'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeCategory === 'Użytkownicy' && !selectedOwnerId ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uniqueUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => setSelectedOwnerId(u.id)}
                          className="parchment-card p-6 flex flex-col items-center gap-3 hover:border-primary transition-all group"
                        >
                          <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20">
                            <UserIcon className="w-6 h-6 text-primary" />
                          </div>
                          <span className="font-bold uppercase tracking-widest text-xs text-primary">
                            {u.name || 'Anonimowy Skryba'}
                          </span>
                          <span className="text-[10px] text-primary/40 font-mono">
                            {items.filter((g) => g.ownerId === u.id).length} WPISÓW
                          </span>
                        </button>
                      ))}
                      {uniqueUsers.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-primary/10 rounded">
                          <p className="text-primary/40 italic">
                            Brak wpisów stworzonych przez użytkowników.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {selectedOwnerId && (
                        <div className="flex items-center gap-2 mb-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOwnerId(null)}
                            className="text-primary/60 hover:text-primary text-[10px] font-bold uppercase"
                          >
                            <ChevronLeft className="w-3 h-3 mr-1" /> Powrót do listy skrybów
                          </Button>
                          <div className="h-4 w-px bg-primary/20 mx-2" />
                          <span className="text-xs font-bold uppercase tracking-widest text-primary/40">
                            Wpisy użytkownika:{' '}
                            <span className="text-primary">
                              {uniqueUsers.find((u) => u.id === selectedOwnerId)?.name}
                            </span>
                          </span>
                        </div>
                      )}
                      <GeneratorList
                        generators={filteredItems as RandomTable[]}
                        allTables={items.filter((i) => i.type === 'table') as RandomTable[]}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        currentUser={user}
                      />
                    </>
                  )}
                </div>
              </>
            )}

            {(view === 'create' || view === 'edit') && (
              <div className="flex-1 max-w-4xl mx-auto">
                <GeneratorForm
                  initialData={selectedItem as RandomTable}
                  allTables={items.filter((i) => i.type === 'table') as RandomTable[]}
                  onSave={handleSave}
                  onCancel={() => setView('list')}
                  currentUser={user}
                  type={createType}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t-4 border-double border-primary/20 py-12 mt-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-6 opacity-30">
            <Skull className="w-6 h-6" />
            <ShieldAlert className="w-6 h-6" />
            <Skull className="w-6 h-6" />
          </div>
          <p className="text-primary/40 text-xs uppercase tracking-[0.4em] font-bold">
            Narzędzie do Warhammer Fantasy Roleplay • Sigmar Chroni
          </p>
          <p className="text-primary/20 text-[10px] font-mono">
            ARCHIVE_PROTOCOL_v2.0.0_STABLE
          </p>
        </div>
      </footer>

      <Toaster position="bottom-right" theme="light" richColors />

      {showTypeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="parchment-card max-w-2xl w-full p-8 space-y-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-primary/20 pb-4">
              <h2 className="text-2xl font-black fancy-heading uppercase tracking-tight text-primary">
                Wybierz Typ Archiwum
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTypeSelector(false)}
                className="text-primary/40 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setCreateType('table');
                  setView('create');
                  setShowTypeSelector(false);
                }}
                className="parchment-card p-8 flex flex-col items-center gap-4 hover:border-primary transition-all group bg-primary/5"
              >
                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                  <TableIcon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <span className="block font-black uppercase tracking-widest text-sm text-primary">
                    Tabela
                  </span>
                  <span className="text-[10px] text-primary/40 uppercase font-bold">
                    Losowe wyniki
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedItem(null);
                  setCreateType('note');
                  setView('create');
                  setShowTypeSelector(false);
                }}
                className="parchment-card p-8 flex flex-col items-center gap-4 hover:border-primary transition-all group bg-primary/5"
              >
                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <span className="block font-black uppercase tracking-widest text-sm text-primary">
                    Notatka
                  </span>
                  <span className="text-[10px] text-primary/40 uppercase font-bold">
                    Zapiski i obrazy
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedItem(null);
                  setCreateType('character');
                  setView('create');
                  setShowTypeSelector(false);
                }}
                className="parchment-card p-8 flex flex-col items-center gap-4 hover:border-primary transition-all group bg-primary/5"
              >
                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <span className="block font-black uppercase tracking-widest text-sm text-primary">
                    Postać
                  </span>
                  <span className="text-[10px] text-primary/40 uppercase font-bold">
                    Karta bohatera
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="parchment-card max-w-md w-full p-8 space-y-6 shadow-2xl border-2 border-destructive animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-destructive/10 p-4 rounded-full">
                <Skull className="w-12 h-12 text-destructive" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-primary">
                Potwierdź Usunięcie
              </h2>
              <p className="text-sm text-primary/60 italic">
                Czy na pewno chcesz usunąć te dane? Ta operacja jest nieodwracalna i zostanie
                odnotowana w kronikach Imperium.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="ghost"
                onClick={() => setItemToDelete(null)}
                className="flex-1 font-bold uppercase tracking-widest text-xs border border-primary/20"
              >
                Anuluj
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-black uppercase tracking-widest text-xs"
              >
                Usuń na zawsze
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}