import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skull, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Wypełnij wszystkie pola");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(isLogin ? "Zalogowano pomyślnie" : "Zarejestrowano pomyślnie");
        onLogin(data);
      } else {
        toast.error(data.error || "Wystąpił błąd");
      }
    } catch (error) {
      toast.error("Błąd połączenia z serwerem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md parchment-card border-primary/40 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary p-3 rounded shadow-inner border border-primary-foreground/20 w-fit">
            <Skull className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tighter fancy-heading uppercase">Archiwum WFRP</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">
              {isLogin ? 'Zaloguj się do repozytorium' : 'Utwórz nowe konto skryby'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Użytkownik</label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Twoje imię..."
                className="bg-background border-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Hasło</label>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-primary/30"
              />
            </div>
            <Button type="submit" className="w-full wfrp-button py-6 text-lg" disabled={loading}>
              {isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
              {loading ? 'Przetwarzanie...' : (isLogin ? 'Zaloguj' : 'Zarejestruj')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
            >
              {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-primary/10 text-center">
            <p className="text-[10px] text-primary/30 italic">"Wiedza jest ciężarem, ale ignorancja jest wyrokiem śmierci."</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
