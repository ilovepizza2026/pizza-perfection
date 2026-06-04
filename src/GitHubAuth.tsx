import { useState, useEffect, useRef } from 'react';
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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const isProcessingCallbackRef = useRef(false);

  useEffect(() => {
    // Skip if already processing a callback to prevent race conditions
    if (isProcessingCallbackRef.current) return;

    // Handle OAuth callback first - takes priority over stored user
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const oauthError = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    // Check for OAuth errors first
    if (oauthError && isMountedRef.current) {
      isProcessingCallbackRef.current = true;
      const errorMessage = errorDescription || `OAuth error: ${oauthError}`;
      console.error('OAuth authorization error:', { error: oauthError, description: errorDescription });

      // Clean up any stored OAuth state
      sessionStorage.removeItem('oauth_state');

      // Clean up URL first, then update states atomically
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.warn('Failed to clean up OAuth callback URL:', error);
      }

      setError(errorMessage);
      setIsLoading(false);
      setIsLoggingIn(false);
      isProcessingCallbackRef.current = false;
      return; // Exit early, don't process stored user
    }

    if (code && state) {
      isProcessingCallbackRef.current = true;

      // Clean up URL immediately to prevent re-processing
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.warn('Failed to clean up OAuth callback URL:', error);
      }

      // Handle successful OAuth callback
      handleOAuthCallback(code, state)
        .then(user => {
          if (!isMountedRef.current) return;

          storeUser(user);
          setUser(user);
          setError(null); // Clear any previous errors
          setIsLoading(false);
          setIsLoggingIn(false);
        })
        .catch(error => {
          if (!isMountedRef.current) return;

          console.error('OAuth callback error:', error);
          setError(error.message || 'Authentication failed. Please try again.');
          setIsLoading(false);
          setIsLoggingIn(false);
        })
        .finally(() => {
          isProcessingCallbackRef.current = false;
        });
      return; // Exit early, don't process stored user during OAuth callback
    }

    // Only check for stored user if no OAuth callback is in progress
    const storedUser = getStoredUser();
    if (storedUser && isMountedRef.current) {
      setUser(storedUser);
    }

    if (isMountedRef.current) {
      setIsLoading(false);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleLogin = () => {
    if (isLoggingIn) return; // Prevent multiple concurrent login attempts

    setIsLoggingIn(true);
    setError(null); // Clear any previous errors

    try {
      initiateGitHubLogin();
    } catch (error) {
      console.error('Failed to initiate GitHub login:', error);
      if (isMountedRef.current) {
        setError('Failed to initiate login. Please try again.');
        setIsLoggingIn(false);
      }
    }
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
      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}
      <button
        onClick={handleLogin}
        disabled={isLoggingIn}
        style={{
          padding: '0.75rem 1.5rem',
          background: isLoggingIn ? '#666' : '#24292e',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoggingIn ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '0 auto',
          opacity: isLoggingIn ? 0.7 : 1
        }}
      >
        <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        {isLoggingIn ? 'Signing in...' : 'Sign in with GitHub'}
      </button>
    </div>
  );
}