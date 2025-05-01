'use client';

import { AuthProvider } from './contexts/AuthContext';
import { ArticleProvider } from './contexts/ArticleContext';

export default function Providers({ children }) {
  return (
    <ArticleProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ArticleProvider>
  );
}