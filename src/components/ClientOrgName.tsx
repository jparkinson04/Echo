'use client';

import { useEffect, useState } from 'react';

// The public survey is filled in by staff of a specific school, so it
// always shows the school's name even if a MAT admin signed up first.
const SCHOOL_NAME_KEY = 'echo-school-name';
const LEGACY_ORG_NAME_KEY = 'echo-org-name';

export function useLocalOrgName(fallback: string): string {
  const [name, setName] = useState(fallback);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored =
      window.localStorage.getItem(SCHOOL_NAME_KEY) ??
      window.localStorage.getItem(LEGACY_ORG_NAME_KEY);
    if (stored && stored.trim()) setName(stored);
  }, []);
  return name;
}

interface ClientOrgNameProps {
  fallback: string;
}

export function ClientOrgName({ fallback }: ClientOrgNameProps) {
  const name = useLocalOrgName(fallback);
  return <>{name}</>;
}
