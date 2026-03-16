'use client';

import { useState, useEffect, useCallback } from 'react';
import { login as doLogin, logout as doLogout, checkAuth } from '../auth';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    checkAuth()
      .then((res) => {
        if (!cancelled) {
          setAuthenticated(res.authenticated);
          setLoading(false);
        }
      })
      .catch(() => {
        // Retry once after a short delay
        setTimeout(() => {
          if (cancelled) return;
          checkAuth()
            .then((res) => {
              if (!cancelled) {
                setAuthenticated(res.authenticated);
                setLoading(false);
              }
            })
            .catch(() => {
              if (!cancelled) setLoading(false);
            });
        }, 500);
      });
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const ok = await doLogin(email, password);
    if (ok) setAuthenticated(true);
    return ok;
  }, []);

  const logout = useCallback(async () => {
    await doLogout();
    setAuthenticated(false);
  }, []);

  return { authenticated, loading, login, logout };
}
