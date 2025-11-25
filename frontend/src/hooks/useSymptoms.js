import { useApi, useMutation } from './useApi';
import { symptomsAPI } from '../utils/api';

/**
 * Hook to fetch all symptoms for current user
 * 
 * @returns {Object} { data: symptoms[], loading, error, refetch }
 */
export const useSymptoms = () => {
  return useApi(() => symptomsAPI.getAll(), []);
};

/**
 * Hook to fetch active symptoms only
 * 
 * @returns {Object} { data: symptoms[], loading, error, refetch }
 */
export const useActiveSymptoms = () => {
  return useApi(() => symptomsAPI.getActive(), []);
};

/**
 * Hook to create new symptom
 * 
 * @returns {Object} { mutate: createSymptom, loading, error, data }
 */
export const useCreateSymptom = () => {
  return useMutation((symptomData) => symptomsAPI.create(symptomData));
};

/**
 * Hook to update symptom
 * 
 * @returns {Object} { mutate: updateSymptom, loading, error, data }
 */
export const useUpdateSymptom = () => {
  return useMutation((id, symptomData) => symptomsAPI.update(id, symptomData));
};

/**
 * Hook to mark symptom as ended
 * 
 * @returns {Object} { mutate: endSymptom, loading, error }
 */
export const useEndSymptom = () => {
  return useMutation((id) => symptomsAPI.markAsEnded(id));
};

/**
 * Hook to delete symptom
 * 
 * @returns {Object} { mutate: deleteSymptom, loading, error }
 */
export const useDeleteSymptom = () => {
  return useMutation((id) => symptomsAPI.delete(id));
};
