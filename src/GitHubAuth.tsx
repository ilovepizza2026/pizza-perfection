import { useState, useEffect } from 'react';
import { initiateGitHubLogin, logout, getStoredUser, storeUser, handleOAuthCallback } from './github-auth';

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export default function GitHubAuth() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleOAuthCallback(code, state)
        .then(user => {
          storeUser(user);
          setUser(user);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('OAuth callback error:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = () => {
    initiateGitHubLogin();
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <img
          src={user.avatar_url}
          alt={`${user.name} avatar`}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%'
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold' }}>{user.name}</div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>@{user.login}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1rem',
      background: '#f5f5f5',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '2rem'
    }}>
      <p style={{ marginBottom: '1rem' }}>
        Sign in with GitHub to save your pizza preferences!
      </p>
      <button
        onClick={handleLogin}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#24292e',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '0 auto'
        }}
      >
        <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        Sign in with GitHub
      </button>
    </div>
  );
}