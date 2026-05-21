'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { injectAccentColour } from '@/lib/accent';
import type { UserRole } from '@/types';

interface AccentContextValue {
  accentHex: string;
  setAccentHex: (hex: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const AccentContext = createContext<AccentContextValue | null>(null);

const DEFAULT_HEX = '#00E090';
const DEFAULT_ROLE: UserRole = 'mat_admin';

const ACCENT_KEY = 'echo-accent-hex-v2';
const ROLE_KEY = 'echo-role';

interface AccentProviderProps {
  children: ReactNode;
  initialHex?: string;
  initialRole?: UserRole;
}

export function AccentProvider({
  children,
  initialHex = DEFAULT_HEX,
  initialRole = DEFAULT_ROLE,
}: AccentProviderProps) {
  const [accentHex, setAccentHexState] = useState<string>(initialHex);
  const [role, setRoleState] = useState<UserRole>(initialRole);

  useEffect(() => {
    const storedHex = window.localStorage.getItem(ACCENT_KEY);
    const storedRole = window.localStorage.getItem(ROLE_KEY) as UserRole | null;
    if (storedHex) setAccentHexState(storedHex);
    if (storedRole) setRoleState(storedRole);
  }, []);

  useEffect(() => {
    injectAccentColour(accentHex);
  }, [accentHex]);

  const setAccentHex = useCallback((hex: string) => {
    setAccentHexState(hex);
    window.localStorage.setItem(ACCENT_KEY, hex);
  }, []);

  const setRole = useCallback((next: UserRole) => {
    setRoleState(next);
    window.localStorage.setItem(ROLE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ accentHex, setAccentHex, role, setRole }),
    [accentHex, setAccentHex, role, setRole],
  );

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

export function useAccent(): AccentContextValue {
  const ctx = useContext(AccentContext);
  if (!ctx) {
    throw new Error('useAccent must be used within an AccentProvider');
  }
  return ctx;
}
