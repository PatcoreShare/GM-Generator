import React from 'react';
import { Input } from '../input';

interface DiceSectionProps {
  formula: string;
  setFormula: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
}

export const DiceSection = ({ formula, setFormula, description, setDescription }: DiceSectionProps) => {
  return (
    <div className="md:col-span-2 space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-primary">Formuła Kości</label>
        <Input 
          value={formula} 
          onChange={(e) => setFormula(e.target.value)} 
          placeholder="np. 1d20, 3d6+2, 2d10-1"
          className="bg-background border-primary/30 font-mono text-lg"
        />
        <p className="text-[10px] text-primary/40 uppercase font-bold">
          Obsługiwane formaty: XdY, XdY+Z, XdY-Z (np. 2d10+5)
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-primary">Opis (opcjonalnie)</label>
        <Input 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="np. Rzut na obrażenia mieczem"
          className="bg-background border-primary/30"
        />
      </div>
    </div>
  );
};
