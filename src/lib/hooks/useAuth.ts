'use client';

import { useState, useEffect, useCallback } from 'react';
import { isSessionValid, isSetupComplete, login as doLogin, logout as doLogout, setupPassword as doSetup, changePassword as doChange } from '../auth';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(isSessionValid());
    setSetupDone(isSetupComplete());
    setLoading(false);
  }, []);

  const login = useCallback(async (password: string) => {
    const ok = await doLogin(password);
    if (ok) setAuthenticated(true);
    return ok;
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setAuthenticated(false);
  }, []);

  const setup = useCallback(async (password: string) => {
    await doSetup(password);
    setAuthenticated(true);
    setSetupDone(true);
  }, []);

  const changePassword = useCallback(async (current: string, next: string) => {
    return doChange(current, next);
  }, []);

  return { authenticated, setupDone, loading, login, logout, setup, changePassword };
}
