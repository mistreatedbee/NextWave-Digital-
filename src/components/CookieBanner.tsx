import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';

const STORAGE_KEY = 'nextwave_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="max-w-4xl mx-auto rounded-2xl bg-slate-950/95 border border-white/10 px-5 py-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-xs sm:text-sm text-slate-300 flex-1">
          We use cookies and similar technologies to understand how our site is used and to
          improve your experience. By continuing, you agree to our use of cookies.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="primary" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

