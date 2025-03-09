import { useState, useEffect } from 'react';
import { FPAPIClient, GetCreatorContentParams, GetVideoDeliveryParams } from '../clients/FPAPIClient';
import { FPListContentResponse } from '../types/FPListContentResponse';
import { FPVideoResponse } from '../types/FPVideoResponse';
import { FPListResponse } from '../types/FPListResponse';
import { useAuth } from '../contexts/AuthContext';

type APIMethod<T> = (...args: any[]) => Promise<T>;

interface UseFPAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseFPAPIOptions {
  lazy?: boolean;
}

export function useFPAPI<T>(
  method: keyof FPAPIClient,
  params?: GetCreatorContentParams | GetVideoDeliveryParams,
  options: UseFPAPIOptions = {}
): UseFPAPIResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!options.lazy);
  const [error, setError] = useState<Error | null>(null);
  const { cookie } = useAuth();

  const fetchData = async () => {
    if (!cookie) {
      setError(new Error('Cookie is required for authentication'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = new FPAPIClient(cookie);
      const apiMethod = client[method] as APIMethod<T>;
      
      const result = params 
        ? await apiMethod.call(client, params)
        : await apiMethod.call(client);
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.lazy) {
      fetchData();
    }
  }, [cookie, method, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Example usage hooks for specific API methods
export function useCreatorContent(
  params: GetCreatorContentParams, 
  options?: UseFPAPIOptions
) {
  return useFPAPI<FPListContentResponse>('getCreatorContent', params, options);
}

export function useVideoDelivery(
  params: GetVideoDeliveryParams, 
  options?: UseFPAPIOptions
) {
  return useFPAPI<FPVideoResponse>('getVideoDelivery', params, options);
}

export function useNotificationChannels(
  options?: UseFPAPIOptions
) {
  return useFPAPI<FPListResponse>('getNotificationChannels', undefined, options);
} 