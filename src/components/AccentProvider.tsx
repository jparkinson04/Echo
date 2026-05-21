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

export type Theme = 'dark' | 'light';

interface AccentContextValue {
  accentHex: string;
  setAccentHex: (hex: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  logoDataUrl: string | null;
  setLogoDataUrl: (url: string | null) => void;
  orgName: string;
  setOrgName: (name: string) => void;
}

const AccentContext = createContext<AccentContextValue | null>(null);

const DEFAULT_HEX = '#00E090';
const DEFAULT_ROLE: UserRole = 'mat_admin';
const DEFAULT_THEME: Theme = 'dark';
const DEFAULT_ORG_NAME = 'Greenfield Primary';

const ACCENT_KEY = 'echo-accent-hex-v2';
const ROLE_KEY = 'echo-role';
const THEME_KEY = 'echo-theme';
const LOGO_KEY = 'echo-logo-data-url';
const ORG_NAME_KEY = 'echo-org-name';

interface AccentProviderProps {
  children: ReactNode;
  initialHex?: string;
  initialRole?: UserRole;
  initialTheme?: Theme;
  initialOrgName?: string;
}

export function AccentProvider({
  children,
  initialHex = DEFAULT_HEX,
  initialRole = DEFAULT_ROLE,
  initialTheme = DEFAULT_THEME,
  initialOrgName = DEFAULT_ORG_NAME,
}: AccentProviderProps) {
  const [accentHex, setAccentHexState] = useState<string>(initialHex);
  const [role, setRoleState] = useState<UserRole>(initialRole);
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [logoDataUrl, setLogoDataUrlState] = useState<string | null>(null);
  const [orgName, setOrgNameState] = useState<string>(initialOrgName);

  useEffect(() => {
    const storedHex = window.localStorage.getItem(ACCENT_KEY);
    const storedRole = window.localStorage.getItem(ROLE_KEY) as UserRole | null;
    const storedTheme = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const storedLogo = window.localStorage.getItem(LOGO_KEY);
    const storedOrgName = window.localStorage.getItem(ORG_NAME_KEY);
    if (storedHex) setAccentHexState(storedHex);
    if (storedRole) setRoleState(storedRole);
    if (storedTheme === 'dark' || storedTheme === 'light') setThemeState(storedTheme);
    if (storedLogo) setLogoDataUrlState(storedLogo);
    if (storedOrgName) setOrgNameState(storedOrgName);
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

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(THEME_KEY, next);
  }, []);

  const setLogoDataUrl = useCallback((url: string | null) => {
    setLogoDataUrlState(url);
    if (url) window.localStorage.setItem(LOGO_KEY, url);
    else window.localStorage.removeItem(LOGO_KEY);
  }, []);

  const setOrgName = useCallback((name: string) => {
    setOrgNameState(name);
    if (name) window.localStorage.setItem(ORG_NAME_KEY, name);
    else window.localStorage.removeItem(ORG_NAME_KEY);
  }, []);

  const value = useMemo(
    () => ({
      accentHex,
      setAccentHex,
      role,
      setRole,
      theme,
      setTheme,
      logoDataUrl,
      setLogoDataUrl,
      orgName,
      setOrgName,
    }),
    [
      accentHex,
      setAccentHex,
      role,
      setRole,
      theme,
      setTheme,
      logoDataUrl,
      setLogoDataUrl,
      orgName,
      setOrgName,
    ],
  );

  return (
    <AccentContext.Provider value={value}>
      <div data-theme={theme} className="min-h-screen bg-bg text-text">
        {children}
      </div>
    </AccentContext.Provider>
  );
}

export function useAccent(): AccentContextValue {
  const ctx = useContext(AccentContext);
  if (!ctx) {
    throw new Error('useAccent must be used within an AccentProvider');
  }
  return ctx;
}
