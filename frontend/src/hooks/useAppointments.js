import { useApi, useMutation } from './useApi';
import { appointmentsAPI } from '../utils/api';

/**
 * Hook to fetch all appointments for current user
 * 
 * @returns {Object} { data: appointments[], loading, error, refetch }
 */
export const useAppointments = () => {
  return useApi(() => appointmentsAPI.getAll(), []);
};

/**
 * Hook to fetch upcoming appointments only
 * 
 * @returns {Object} { data: appointments[], loading, error, refetch }
 */
export const useUpcomingAppointments = () => {
  return useApi(() => appointmentsAPI.getUpcoming(), []);
};

/**
 * Hook to create new appointment
 * 
 * @returns {Object} { mutate: createAppointment, loading, error, data }
 */
export const useCreateAppointment = () => {
  return useMutation((appointmentData) =>
    appointmentsAPI.create(appointmentData)
  );
};

/**
 * Hook to update appointment
 * 
 * @returns {Object} { mutate: updateAppointment, loading, error, data }
 */
export const useUpdateAppointment = () => {
  return useMutation((id, appointmentData) =>
    appointmentsAPI.update(id, appointmentData)
  );
};

/**
 * Hook to cancel appointment
 * 
 * @returns {Object} { mutate: cancelAppointment, loading, error }
 */
export const useCancelAppointment = () => {
  return useMutation((id) => appointmentsAPI.cancel(id));
};

/**
 * Hook to delete appointment
 * 
 * @returns {Object} { mutate: deleteAppointment, loading, error }
 */
export const useDeleteAppointment = () => {
  return useMutation((id) => appointmentsAPI.delete(id));
};
