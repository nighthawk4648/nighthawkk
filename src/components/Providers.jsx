'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import AuthModal from '@/components/Auth/AuthModal';
import AdBlockWall from '@/components/Shared/GoogleAdsense/AdBlockWall';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <AdBlockWall />
      <AuthModal />
    </AuthProvider>
  );
}
