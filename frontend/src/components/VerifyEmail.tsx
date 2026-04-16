// frontend/src/components/VerifyEmail.tsx
// Użycie w App.tsx:
//   const params = new URLSearchParams(window.location.search);
//   if (params.has('token')) return <VerifyEmail onGoToLogin={() => window.location.replace('/')} />;

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Skull, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

type Status = 'loading' | 'success' | 'error';

interface VerifyEmailProps {
  onGoToLogin: () => void;
}

export function VerifyEmail({ onGoToLogin }: VerifyEmailProps) {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Brak tokenu weryfikacyjnego w linku.');
      return;
    }

    fetch(`${API_BASE}/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message ?? 'Konto aktywowane!');
        } else {
          setStatus('error');
          setMessage(data.detail ?? 'Weryfikacja nie powiodła się.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Błąd połączenia z serwerem.');
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md parchment-card border-primary/40 shadow-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center space-y-6">

            <div className="mx-auto bg-primary p-3 rounded shadow-inner border border-primary-foreground/20 w-fit">
              <Skull className="w-8 h-8 text-primary-foreground" />
            </div>

            {status === 'loading' && (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-sm text-primary/60">Weryfikowanie konta…</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="bg-green-900/20 p-4 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black fancy-heading uppercase tracking-tight text-primary">
                    Konto Aktywowane!
                  </h2>
                  <p className="text-sm text-primary/60 leading-relaxed max-w-xs mx-auto">
                    {message}
                  </p>
                </div>
                <Button onClick={onGoToLogin} className="wfrp-button px-8">
                  Zaloguj się
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="bg-red-900/20 p-4 rounded-full">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black fancy-heading uppercase tracking-tight text-primary">
                    Błąd Weryfikacji
                  </h2>
                  <p className="text-sm text-primary/60 leading-relaxed max-w-xs mx-auto">
                    {message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
                >
                  Wróć do logowania
                </button>
              </>
            )}

            <p className="text-[10px] text-primary/20 italic">
              "Wiedza jest ciężarem, ale ignorancja jest wyrokiem śmierci."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
