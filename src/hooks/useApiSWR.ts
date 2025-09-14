import useSWR, { SWRConfiguration } from 'swr';
import { fetchWithAuth } from 'lib/fetchWithAuth';

export function useApiSWR<T = any>(
  path: string | null,
  options?: RequestInit,
  swrOptions?: SWRConfiguration<T>
) {
  return useSWR<T>(
    path,
    path ? () => fetchWithAuth(path, options).then((res) => res.json()) : null,
    swrOptions
  );
}