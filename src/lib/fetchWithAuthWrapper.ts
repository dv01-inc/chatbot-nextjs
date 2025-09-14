import { fetchWithAuth } from './fetchWithAuth';

/**
 * Wrapper to match the fetch signature expected by Vercel AI SDK hooks (useChat, useCompletion)
 */
export const fetchWithAuthWrapper = (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  let path: string;

  if (input instanceof URL) {
    path = input.pathname;
  } else if (typeof input === 'string') {
    path = input;
  } else {
    // Handle Request object
    path = String(input);
  }
  return fetchWithAuth(path, init);
};