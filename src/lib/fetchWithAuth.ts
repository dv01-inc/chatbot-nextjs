declare global {
  interface Window {
    apiGatewayUrl?: string;
  }
}

function getApiGatewayUrl(): string | undefined {
  if (typeof window !== 'undefined' && window.apiGatewayUrl) {
    return window.apiGatewayUrl;
  }
  return undefined;
}

function createLogoutUrl(): string {
  const base = getApiGatewayUrl() || '';
  const redirectUrl = typeof window !== 'undefined' ? window.location.href : '';
  const normalized = base.replace(/\/$/, '');
  return `${normalized}/auth-service/api/v1/auth/authenticated/initiate-logout?redirectUrl=${encodeURIComponent(
    redirectUrl
  )}`;
}

function apiUrl(path: string) {
  if (typeof window !== 'undefined' && window.apiGatewayUrl) {
    return `${window.apiGatewayUrl.replace(/\/$/, '')}/chatbot/${path.replace(
      /^\//,
      ''
    )}`;
  }
  return path;
}

export async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const response = await fetch(apiUrl(path), {
    ...options,
    credentials: 'include',
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    window.location.href = createLogoutUrl();
  }

  return response;
}