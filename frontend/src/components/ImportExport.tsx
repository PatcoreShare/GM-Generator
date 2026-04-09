import React from 'react';
import { RandomTable, User } from '../types';
import { Button } from './ui/button';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImportExportProps {
  onImport: () => void;
  currentUser: User;
}

export function ImportExport({ onImport, currentUser }: ImportExportProps) {
  const handleDownloadSample = () => {
    const sampleData = {
      generators: [
        {
          id: "tabela-prosta-przyklad",
          name: "Przykładowa Tabela Prosta",
          description: "Podstawowy generator z wariantami.",
          type: "table",
          subType: "simple",
          options: [
            { id: "opt-1", text: "Zwykły miecz", weight: 5 },
            { id: "opt-2", text: "Zardzewiały sztylet", weight: 3 }
          ],
          variants: [
            {
              id: "var-elf",
              name: "Elfia Jakość",
              options: [
                { id: "opt-elf-1", text: "Doskonały łuk", weight: 1 }
              ]
            }
          ],
          tags: ["Przykład", "Broń"],
          createdAt: new Date().toISOString()
        },
        {
          id: "tabela-zlozona-przyklad",
          name: "Przykładowa Tabela Złożona",
          description: "Generator generujący wiele pól jednocześnie.",
          type: "table",
          subType: "complex",
          fields: [
            { label: "Imię", source: "imiona" },
            { label: "Profesja", source: "profesje" }
          ],
          multiTables: {
            "imiona": [
              { id: "n1", text: "Hans", weight: 1 },
              { id: "n2", text: "Karl", weight: 1 }
            ],
            "profesje": [
              { id: "p1", text: "Szczurołap", weight: 1 },
              { id: "p2", text: "Strażnik Dróg", weight: 1 }
            ]
          },
          tags: ["Przykład", "NPC"],
          createdAt: new Date().toISOString()
        },
        {
          id: "notatka-przyklad",
          name: "Przykładowa Notatka",
          type: "note",
          blocks: [
            { id: "b1", type: "text", content: "To jest przykładowa notatka z opisem świata." },
            { id: "b2", type: "image", content: "https://picsum.photos/seed/wfrp/800/400", width: "100%" }
          ],
          tags: ["Przykład", "Lore"],
          createdAt: new Date().toISOString()
        },
        {
          id: "postac-przyklad",
          name: "Przykładowa Postać",
          type: "character",
          edition: "4ed",
          race: "Człowiek",
          profession: "Mieszczanin",
          description: "Wysoki, chudy, o przenikliwym spojrzeniu.",
          stats: { "WW": 30, "US": 30, "S": 30, "Wt": 30, "I": 30, "Zw": 30, "Zr": 30, "Int": 30, "SW": 30, "Og": 30 },
          skills: ["Mocna Głowa", "Targowanie"],
          talents: ["Błyskotliwość"],
          equipment: ["Ubranie podróżne", "Sakiewka"],
          notes: "Urodzony w Altdorfie.",
          tags: ["Przykład", "Bohater"],
          createdAt: new Date().toISOString()
        }
      ]
    };
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "wfrp-przyklad-generatorow.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.info("Pobrano przykładowy plik JSON. Możesz go edytować i zaimportować ponownie.");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        let payload = data;

        // Detect complex generator format
        if (data.fields && data.tables && !Array.isArray(data.tables)) {
          const complexTable = {
            id: data.id || crypto.randomUUID(),
            name: data.title || data.name || 'Importowany Generator',
            description: data.description || '',
            type: 'table',
            subType: 'complex',
            fields: data.fields,
            multiTables: data.tables,
            options: [],
            variants: [],
            tags: ['Importowany'],
            ownerId: currentUser.id,
            ownerName: currentUser.username,
            createdAt: data.createdAt || new Date().toISOString()
          };
          payload = { generators: [complexTable] };
        }

        const response = await fetch('/api/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success("Generatory zaimportowane pomyślnie");
          onImport();
        } else {
          toast.error("Nie udało się zaimportować generatorów");
        }
      } catch (error) {
        toast.error("Nieprawidłowy plik JSON");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleDownloadSample} className="border-primary/30 text-primary hover:bg-primary/10">
        <Download className="w-4 h-4 mr-2" /> Pobierz Przykład
      </Button>
      <div className="relative">
        <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
          <Upload className="w-4 h-4 mr-2" /> Importuj JSON
        </Button>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleImport}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
