import { useApi, useMutation } from './useApi';
import { medicinesAPI } from '../utils/api';

/**
 * Hook to fetch all medicines for current user
 * 
 * @returns {Object} { data: medicines[], loading, error, refetch }
 */
export const useMedicines = () => {
  return useApi(() => medicinesAPI.getAll(), []);
};

/**
 * Hook to fetch active medicines only
 * 
 * @returns {Object} { data: medicines[], loading, error, refetch }
 */
export const useActiveMedicines = () => {
  return useApi(() => medicinesAPI.getActive(), []);
};

/**
 * Hook to create new medicine
 * 
 * @returns {Object} { mutate: createMedicine, loading, error, data }
 */
export const useCreateMedicine = () => {
  return useMutation((medicineData) => medicinesAPI.create(medicineData));
};

/**
 * Hook to update medicine
 * 
 * @returns {Object} { mutate: updateMedicine, loading, error, data }
 */
export const useUpdateMedicine = () => {
  return useMutation((id, medicineData) =>
    medicinesAPI.update(id, medicineData)
  );
};

/**
 * Hook to delete medicine
 * 
 * @returns {Object} { mutate: deleteMedicine, loading, error }
 */
export const useDeleteMedicine = () => {
  return useMutation((id) => medicinesAPI.delete(id));
};

/**
 * Hook to log medicine intake
 * 
 * @returns {Object} { mutate: logIntake, loading, error }
 */
export const useLogMedicineIntake = () => {
  return useMutation((medicineId) => medicinesAPI.logIntake(medicineId));
};
