interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

const GITHUB_OAUTH_CONFIG: OAuthConfig = {
  clientId: process.env.VITE_GITHUB_CLIENT_ID || 'demo-client-id',
  redirectUri: '',
  scopes: ['user:email', 'read:user']
};

export function initiateGitHubLogin(): void {
  const redirectUri = `${window.location.origin}/oauth/callback`;
  const params = new URLSearchParams({
    client_id: GITHUB_OAUTH_CONFIG.clientId,
    redirect_uri: redirectUri,
    scope: GITHUB_OAUTH_CONFIG.scopes.join(' '),
    state: generateStateToken()
  });

  sessionStorage.setItem('oauth_state', params.get('state')!);
  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}

export async function handleOAuthCallback(code: string, state: string): Promise<GitHubUser> {
  const storedState = sessionStorage.getItem('oauth_state');
  if (state !== storedState) {
    throw new Error('Invalid OAuth state parameter');
  }

  sessionStorage.removeItem('oauth_state');

  // In a real implementation, this would go through your backend
  // Here we simulate the token exchange
  const mockUser: GitHubUser = {
    id: 12345,
    login: 'pizza-lover',
    name: 'Pizza Lover',
    email: 'pizza@example.com',
    avatar_url: 'https://github.com/images/error/octocat_happy.gif'
  };

  return mockUser;
}

export function logout(): void {
  localStorage.removeItem('github_user');
  localStorage.removeItem('github_token');
}

export function getStoredUser(): GitHubUser | null {
  const stored = localStorage.getItem('github_user');
  return stored ? JSON.parse(stored) : null;
}

export function storeUser(user: GitHubUser): void {
  localStorage.setItem('github_user', JSON.stringify(user));
}

function generateStateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}