import { useApi, useMutation } from './useApi';
import { dssAPI } from '../utils/api';

/**
 * Hook to analyze active symptoms (CORE DSS ALGORITHM)
 * 
 * @returns {Object} { data: analysisResponse, loading, error, refetch }
 * 
 * Response includes:
 * - possibleDiseases: Array of disease matches with scores
 * - urgencyScore: Number (0-100)
 * - recommendations: Array of strings
 * - criticalSymptoms: Array of critical symptom names
 */
export const useSymptomAnalysis = (immediate = false) => {
  return useApi(() => dssAPI.analyzeSymptoms(), [], immediate);
};

/**
 * Hook to predict health risks
 * 
 * @returns {Object} { data: predictions[], loading, error, refetch }
 */
export const useRiskPredictions = (immediate = false) => {
  return useApi(() => dssAPI.predictRisks(), [], immediate);
};

/**
 * Hook to fetch health insights
 * 
 * @param {boolean} unreadOnly - Filter for unread insights only
 * @returns {Object} { data: insights[], loading, error, refetch }
 */
export const useHealthInsights = (unreadOnly = false) => {
  return useApi(() => dssAPI.getInsights(unreadOnly), [unreadOnly]);
};

/**
 * Hook to fetch health predictions
 * 
 * @param {string} type - Prediction type (CARDIOVASCULAR, DIABETES, etc.)
 * @returns {Object} { data: predictions[], loading, error, refetch }
 */
export const useHealthPredictions = (type = null) => {
  return useApi(() => dssAPI.getPredictions(type), [type]);
};

/**
 * Hook to mark insight as read
 * 
 * @returns {Object} { mutate: markAsRead, loading, error }
 */
export const useMarkInsightAsRead = () => {
  return useMutation((insightId) => dssAPI.markInsightAsRead(insightId));
};

/**
 * Hook to delete insight
 * 
 * @returns {Object} { mutate: deleteInsight, loading, error }
 */
export const useDeleteInsight = () => {
  return useMutation((insightId) => dssAPI.deleteInsight(insightId));
};

/**
 * Hook to delete prediction
 * 
 * @returns {Object} { mutate: deletePrediction, loading, error }
 */
export const useDeletePrediction = () => {
  return useMutation((predictionId) => dssAPI.deletePrediction(predictionId));
};
