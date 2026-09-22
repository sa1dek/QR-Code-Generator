import React, { useState, useEffect } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { supabase } from "./lib/fetchUtils"; 

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('review_cards_token') || 'demo_token';
  });

  const [dbMode, setDbMode] = useState<'supabase' | 'mock'>('mock');

  // Check health and dbMode on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        return ct.includes('application/json') ? res.json() : null;
      })
      .then((data) => {
        if (data && data.dbMode) {
          setDbMode(data.dbMode);
        }
      })
      .catch(() => {});
  }, []);

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleLoginSuccess = (token: string, user: any) => {
    setAuthToken(token);
    localStorage.setItem('review_cards_token', token);
    navigateTo('/admin');
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('review_cards_token');
    navigateTo('/admin/login');
  };

  const isAuthenticated = Boolean(authToken);

  // Router logic
  let content = null;

  if (currentPath.startsWith('/admin/login')) {
    content = (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoHome={() => navigateTo('/')}
        dbMode={dbMode}
      />
    );
  } else if (currentPath.startsWith('/admin')) {
    if (!isAuthenticated) {
      // Guard: redirect to login
      content = (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onGoHome={() => navigateTo('/')}
          dbMode={dbMode}
        />
      );
    } else {
      content = <AdminDashboardPage onLogout={handleLogout} dbMode="supabase" />;
    }
  } else {
    // Default: HomePage
    content = (
      <HomePage
        onGoToLogin={() => navigateTo('/admin/login')}
        onGoToDashboard={() => navigateTo('/admin')}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  return <ToastProvider>{content}</ToastProvider>;
}
