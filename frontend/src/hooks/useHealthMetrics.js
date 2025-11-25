import { useApi, useMutation } from './useApi';
import { healthMetricsAPI } from '../utils/api';

/**
 * Hook to fetch all health metrics for current user
 * 
 * @returns {Object} { data: metrics[], loading, error, refetch }
 */
export const useHealthMetrics = () => {
  return useApi(() => healthMetricsAPI.getAll(), []);
};

/**
 * Hook to fetch metrics by type
 * 
 * @param {string} type - Metric type (BLOOD_PRESSURE, BLOOD_SUGAR, etc.)
 * @returns {Object} { data: metrics[], loading, error, refetch }
 */
export const useHealthMetricsByType = (type) => {
  return useApi(
    () => healthMetricsAPI.getByType(type),
    [type],
    !!type // Only fetch if type is provided
  );
};

/**
 * Hook to fetch recent metrics (since date)
 * 
 * @param {Date} since - Start date
 * @returns {Object} { data: metrics[], loading, error, refetch }
 */
export const useRecentHealthMetrics = (since) => {
  return useApi(
    () => healthMetricsAPI.getRecent(since),
    [since],
    !!since // Only fetch if since is provided
  );
};

/**
 * Hook to create new health metric
 * 
 * @returns {Object} { mutate: createMetric, loading, error, data }
 * 
 * @example
 * const { mutate: createMetric, loading } = useCreateHealthMetric();
 * await createMetric({ metricType: 'BLOOD_PRESSURE', value: 120, ... });
 */
export const useCreateHealthMetric = () => {
  return useMutation((metricData) => healthMetricsAPI.create(metricData));
};

/**
 * Hook to update health metric
 * 
 * @returns {Object} { mutate: updateMetric, loading, error, data }
 */
export const useUpdateHealthMetric = () => {
  return useMutation((id, metricData) =>
    healthMetricsAPI.update(id, metricData)
  );
};

/**
 * Hook to delete health metric
 * 
 * @returns {Object} { mutate: deleteMetric, loading, error }
 */
export const useDeleteHealthMetric = () => {
  return useMutation((id) => healthMetricsAPI.delete(id));
};
