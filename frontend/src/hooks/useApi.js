import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for API calls with loading, error, and data state management
 * 
 * @param {Function} apiCall - Async function that calls the API
 * @param {Array} dependencies - Dependencies array for useEffect (default: [])
 * @param {boolean} immediate - Whether to call API immediately on mount (default: true)
 * @returns {Object} { data, loading, error, refetch, setData }
 * 
 * @example
 * const { data: metrics, loading, error, refetch } = useApi(
 *   () => healthMetricsAPI.getAll(),
 *   []
 * );
 */
export const useApi = (apiCall, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  // Refetch function to manually trigger API call
  const refetch = useCallback(() => execute(), [execute]);

  return {
    data,
    loading,
    error,
    refetch,
    setData, // Allow manual data updates (optimistic updates)
  };
};

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 * Does NOT auto-fetch on mount
 * 
 * @param {Function} mutationFn - Async function that performs mutation
 * @returns {Object} { mutate, loading, error, data }
 * 
 * @example
 * const { mutate: createMetric, loading } = useMutation(
 *   (data) => healthMetricsAPI.create(data)
 * );
 * await createMetric({ metricType: 'BLOOD_PRESSURE', value: 120 });
 */
export const useMutation = (mutationFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await mutationFn(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        console.error('Mutation Error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn]
  );

  return {
    mutate,
    loading,
    error,
    data,
  };
};

export default useApi;
