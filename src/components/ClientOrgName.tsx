'use client';

import { useEffect, useState } from 'react';

const ORG_NAME_KEY = 'echo-org-name';

export function useLocalOrgName(fallback: string): string {
  const [name, setName] = useState(fallback);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(ORG_NAME_KEY);
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
