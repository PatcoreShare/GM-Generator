// frontend/src/components/Auth.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skull, LogIn, UserPlus, Clock, MailCheck } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const API_BASE = import.meta.env.VITE_API_URL ?? '';

type Screen = 'login' | 'register' | 'pending';

export function Auth({ onLogin }: AuthProps) {
  const [screen, setScreen] = useState<Screen>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const resetFields = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Wypełnij wszystkie pola');
      return;
    }
    if (screen === 'register') {
      if (username.trim().length < 3) {
        toast.error('Nazwa użytkownika musi mieć min. 3 znaki');
        return;
      }
      if (password.length < 6) {
        toast.error('Hasło musi mieć min. 6 znaków');
        return;
      }
      if (!email || !email.includes('@')) {
        toast.error('Podaj prawidłowy adres e-mail');
        return;
      }
    }

    setLoading(true);

    try {
      const isLogin = screen === 'login';
      const endpoint = isLogin
        ? `${API_BASE}/api/auth/login`
        : `${API_BASE}/api/auth/register`;

      const body = isLogin
        ? { username, password }
        : { username, email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail ?? 'Wystąpił błąd');
      }

      if (isLogin) {
        localStorage.setItem('wfrp-token', data.access_token);
        toast.success('Zalogowano pomyślnie');
        onLogin(data.user);
      } else {
        setPendingEmail(email);
        resetFields();
        setScreen('pending');
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  // ── Ekran po rejestracji ──────────────────────────────────────────────────
  if (screen === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md parchment-card border-primary/40 shadow-2xl">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-primary/10 p-5 rounded-full">
                <MailCheck className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black fancy-heading uppercase tracking-tight text-primary">
                  Sprawdź skrzynkę
                </h2>
                <p className="text-sm text-primary/60 leading-relaxed max-w-xs mx-auto">
                  Wysłaliśmy link aktywacyjny na adres:
                </p>
                <p className="text-sm font-bold text-primary/80 break-all">
                  {pendingEmail}
                </p>
                <p className="text-xs text-primary/40 leading-relaxed max-w-xs mx-auto">
                  Kliknij link w e-mailu, aby aktywować konto.
                  Link wygasa po 24 godzinach.
                </p>
              </div>
              <div className="w-full pt-2 border-t border-primary/10">
                <button
                  type="button"
                  onClick={() => { setScreen('login'); resetFields(); }}
                  className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
                >
                  Powrót do logowania
                </button>
              </div>
              <p className="text-[10px] text-primary/20 italic">
                "Cierpliwość jest cnotą mądrych."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Formularz logowania / rejestracji ─────────────────────────────────────
  const isLogin = screen === 'login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md parchment-card border-primary/40 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary p-3 rounded shadow-inner border border-primary-foreground/20 w-fit">
            <Skull className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tighter fancy-heading uppercase">
              Archiwum WFRP
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">
              {isLogin ? 'Zaloguj się do repozytorium' : 'Utwórz nowe konto skryby'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="auth-username"
                className="text-[10px] font-bold uppercase tracking-widest text-primary/60"
              >
                Użytkownik
              </label>
              <Input
                id="auth-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Twoje imię..."
                autoComplete="username"
                className="bg-background border-primary/30"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label
                  htmlFor="auth-email"
                  className="text-[10px] font-bold uppercase tracking-widest text-primary/60"
                >
                  Adres e-mail
                </label>
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                  autoComplete="email"
                  className="bg-background border-primary/30"
                />
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="auth-password"
                className="text-[10px] font-bold uppercase tracking-widest text-primary/60"
              >
                Hasło
              </label>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="bg-background border-primary/30"
              />
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2 p-3 rounded border border-primary/20 bg-primary/5">
                <Clock className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
                <p className="text-[10px] text-primary/50 leading-relaxed">
                  Po rejestracji wyślemy link aktywacyjny na podany adres e-mail.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full wfrp-button py-6 text-lg"
              disabled={loading}
            >
              {isLogin
                ? <LogIn className="w-5 h-5 mr-2" />
                : <UserPlus className="w-5 h-5 mr-2" />}
              {loading ? 'Przetwarzanie...' : isLogin ? 'Zaloguj' : 'Zarejestruj'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setScreen(isLogin ? 'register' : 'login'); resetFields(); }}
              className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
            >
              {isLogin
                ? 'Nie masz konta? Zarejestruj się'
                : 'Masz już konto? Zaloguj się'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-primary/10 text-center">
            <p className="text-[10px] text-primary/30 italic">
              "Wiedza jest ciężarem, ale ignorancja jest wyrokiem śmierci."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
