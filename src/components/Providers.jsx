'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import AuthModal from '@/components/Auth/AuthModal';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  );
}
