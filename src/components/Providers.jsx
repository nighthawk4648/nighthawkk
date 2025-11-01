'use client';

import { PatreonAuthProvider } from '@/contexts/PatreonAuthContext';

export default function Providers({ children }) {
  return (
    <PatreonAuthProvider>
      {children}
    </PatreonAuthProvider>
  );
}
