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

  trustName: string;
  setTrustName: (name: string) => void;
  schoolName: string;
  setSchoolName: (name: string) => void;
  trustLogo: string | null;
  setTrustLogo: (url: string | null) => void;
  schoolLogo: string | null;
  setSchoolLogo: (url: string | null) => void;

  /** The org name for the currently-active view (trust in MAT mode, school otherwise). */
  orgName: string;
  /** The logo for the currently-active view. */
  logoDataUrl: string | null;
}

const AccentContext = createContext<AccentContextValue | null>(null);

const DEFAULT_HEX = '#00E090';
const DEFAULT_ROLE: UserRole = 'mat_admin';
const DEFAULT_THEME: Theme = 'dark';
const DEFAULT_TRUST_NAME = 'Northstar Learning Trust';
const DEFAULT_SCHOOL_NAME = 'Greenfield Primary';

const ACCENT_KEY = 'echo-accent-hex-v2';
const ROLE_KEY = 'echo-role';
const THEME_KEY = 'echo-theme';
const TRUST_NAME_KEY = 'echo-trust-name';
const SCHOOL_NAME_KEY = 'echo-school-name';
const TRUST_LOGO_KEY = 'echo-trust-logo';
const SCHOOL_LOGO_KEY = 'echo-school-logo';

// Old single-tenant keys, kept for one-time migration.
const LEGACY_ORG_NAME_KEY = 'echo-org-name';
const LEGACY_LOGO_KEY = 'echo-logo-data-url';

interface AccentProviderProps {
  children: ReactNode;
  initialHex?: string;
  initialRole?: UserRole;
  initialTheme?: Theme;
}

export function AccentProvider({
  children,
  initialHex = DEFAULT_HEX,
  initialRole = DEFAULT_ROLE,
  initialTheme = DEFAULT_THEME,
}: AccentProviderProps) {
  const [accentHex, setAccentHexState] = useState<string>(initialHex);
  const [role, setRoleState] = useState<UserRole>(initialRole);
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [trustName, setTrustNameState] = useState<string>(DEFAULT_TRUST_NAME);
  const [schoolName, setSchoolNameState] = useState<string>(DEFAULT_SCHOOL_NAME);
  const [trustLogo, setTrustLogoState] = useState<string | null>(null);
  const [schoolLogo, setSchoolLogoState] = useState<string | null>(null);

  useEffect(() => {
    const storedHex = window.localStorage.getItem(ACCENT_KEY);
    const storedRole = window.localStorage.getItem(ROLE_KEY) as UserRole | null;
    const storedTheme = window.localStorage.getItem(THEME_KEY) as Theme | null;

    // One-time migration from the old single-tenant keys into the
    // school-level slot. The school is the more common single-tenant
    // case; MATs would re-set the trust name on the next visit.
    const legacyOrg = window.localStorage.getItem(LEGACY_ORG_NAME_KEY);
    const legacyLogo = window.localStorage.getItem(LEGACY_LOGO_KEY);
    if (legacyOrg && !window.localStorage.getItem(SCHOOL_NAME_KEY)) {
      window.localStorage.setItem(SCHOOL_NAME_KEY, legacyOrg);
    }
    if (legacyLogo && !window.localStorage.getItem(SCHOOL_LOGO_KEY)) {
      window.localStorage.setItem(SCHOOL_LOGO_KEY, legacyLogo);
    }
    if (legacyOrg) window.localStorage.removeItem(LEGACY_ORG_NAME_KEY);
    if (legacyLogo) window.localStorage.removeItem(LEGACY_LOGO_KEY);

    const storedTrustName = window.localStorage.getItem(TRUST_NAME_KEY);
    const storedSchoolName = window.localStorage.getItem(SCHOOL_NAME_KEY);
    const storedTrustLogo = window.localStorage.getItem(TRUST_LOGO_KEY);
    const storedSchoolLogo = window.localStorage.getItem(SCHOOL_LOGO_KEY);

    if (storedHex) setAccentHexState(storedHex);
    if (storedRole) setRoleState(storedRole);
    if (storedTheme === 'dark' || storedTheme === 'light') setThemeState(storedTheme);
    if (storedTrustName) setTrustNameState(storedTrustName);
    if (storedSchoolName) setSchoolNameState(storedSchoolName);
    if (storedTrustLogo) setTrustLogoState(storedTrustLogo);
    if (storedSchoolLogo) setSchoolLogoState(storedSchoolLogo);
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
  const setTrustName = useCallback((name: string) => {
    setTrustNameState(name);
    if (name) window.localStorage.setItem(TRUST_NAME_KEY, name);
    else window.localStorage.removeItem(TRUST_NAME_KEY);
  }, []);
  const setSchoolName = useCallback((name: string) => {
    setSchoolNameState(name);
    if (name) window.localStorage.setItem(SCHOOL_NAME_KEY, name);
    else window.localStorage.removeItem(SCHOOL_NAME_KEY);
  }, []);
  const setTrustLogo = useCallback((url: string | null) => {
    setTrustLogoState(url);
    if (url) window.localStorage.setItem(TRUST_LOGO_KEY, url);
    else window.localStorage.removeItem(TRUST_LOGO_KEY);
  }, []);
  const setSchoolLogo = useCallback((url: string | null) => {
    setSchoolLogoState(url);
    if (url) window.localStorage.setItem(SCHOOL_LOGO_KEY, url);
    else window.localStorage.removeItem(SCHOOL_LOGO_KEY);
  }, []);

  const isMat = role === 'mat_admin';
  const orgName = isMat ? trustName : schoolName;
  const logoDataUrl = isMat ? trustLogo : schoolLogo;

  const value = useMemo<AccentContextValue>(
    () => ({
      accentHex,
      setAccentHex,
      role,
      setRole,
      theme,
      setTheme,
      trustName,
      setTrustName,
      schoolName,
      setSchoolName,
      trustLogo,
      setTrustLogo,
      schoolLogo,
      setSchoolLogo,
      orgName,
      logoDataUrl,
    }),
    [
      accentHex,
      setAccentHex,
      role,
      setRole,
      theme,
      setTheme,
      trustName,
      setTrustName,
      schoolName,
      setSchoolName,
      trustLogo,
      setTrustLogo,
      schoolLogo,
      setSchoolLogo,
      orgName,
      logoDataUrl,
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
