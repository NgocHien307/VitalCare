import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import FormGroup from '../../components/FormGroup';
import Textarea from '../../components/Textarea';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import HealthStatusBadge from '../../components/HealthStatusBadge';

// Custom Hooks
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
  useDeleteAppointment,
} from '../../hooks/useAppointments';
import { useToast } from '../../contexts/ToastContext';

const Appointments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    appointmentDate: '',
    appointmentTime: '',
    location: '',
    reason: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const { success, error: showError } = useToast();

  // Fetch appointments
  const {
    data: appointments,
    loading,
    error: fetchError,
    refetch,
  } = useAppointments();

  const { mutate: createAppointment, loading: createLoading } =
    useCreateAppointment();
  const { mutate: updateAppointment, loading: updateLoading } =
    useUpdateAppointment();
  const { mutate: cancelAppointment, loading: cancelLoading } =
    useCancelAppointment();
  const { mutate: deleteAppointment, loading: deleteLoading } =
    useDeleteAppointment();

  const handleOpenModal = (appointment = null) => {
    if (appointment) {
      const appointmentDateTime = new Date(appointment.appointmentDate);
      setEditingAppointment(appointment);
      setFormData({
        doctorName: appointment.doctorName,
        specialty: appointment.specialty || '',
        appointmentDate: appointmentDateTime
          .toISOString()
          .split('T')[0],
        appointmentTime: appointmentDateTime.toTimeString().slice(0, 5),
        location: appointment.location || '',
        reason: appointment.reason || '',
        notes: appointment.notes || '',
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        doctorName: '',
        specialty: '',
        appointmentDate: '',
        appointmentTime: '',
        location: '',
        reason: '',
        notes: '',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.doctorName) errors.doctorName = 'Vui lòng nhập tên bác sĩ';
    if (!formData.appointmentDate)
      errors.appointmentDate = 'Vui lòng chọn ngày';
    if (!formData.appointmentTime)
      errors.appointmentTime = 'Vui lòng chọn giờ';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const dateTimeString = `${formData.appointmentDate}T${formData.appointmentTime}:00`;
      const payload = {
        doctorName: formData.doctorName,
        specialty: formData.specialty || null,
        appointmentDate: new Date(dateTimeString).toISOString(),
        location: formData.location || null,
        reason: formData.reason || null,
        notes: formData.notes || null,
        status: 'SCHEDULED',
      };

      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, payload);
        success('Đã cập nhật lịch hẹn thành công!');
      } else {
        await createAppointment(payload);
        success('Đã thêm lịch hẹn mới thành công!');
      }

      setIsModalOpen(false);
      refetch();
    } catch (err) {
      showError(err.message || 'Không thể lưu lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      return;
    }

    try {
      await cancelAppointment(id);
      success('Đã hủy lịch hẹn thành công!');
      refetch();
    } catch (err) {
      showError(err.message || 'Không thể hủy lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      return;
    }

    try {
      await deleteAppointment(id);
      success('Đã xóa lịch hẹn thành công!');
      refetch();
    } catch (err) {
      showError(err.message || 'Không thể xóa lịch hẹn. Vui lòng thử lại.');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      SCHEDULED: { label: 'Đã đặt', status: 'normal' },
      COMPLETED: { label: 'Hoàn thành', status: 'success' },
      CANCELLED: { label: 'Đã hủy', status: 'danger' },
    };
    return statusMap[status] || statusMap.SCHEDULED;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container py-8">
        <Alert type="error">
          <AlertCircle size={20} className="mr-2" />
          <strong>Lỗi:</strong> Không thể tải danh sách lịch hẹn. Vui lòng thử
          lại sau.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Calendar size={40} className="text-primary-500" />
            Lịch hẹn khám
          </h1>
          <p className="text-gray-600">
            Quản lý các lịch hẹn khám bệnh và tái khám
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          Đặt lịch mới
        </Button>
      </div>

      {/* Appointments List */}
      {appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const { label, status } = getStatusBadge(appt.status);
            const appointmentDate = new Date(appt.appointmentDate);
            const isPast = appointmentDate < new Date();

            return (
              <Card key={appt.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${
                        isPast ? 'bg-gray-100' : 'bg-primary-100'
                      }`}
                    >
                      <Calendar
                        size={24}
                        className={isPast ? 'text-gray-500' : 'text-primary-600'}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          <User size={18} className="inline mr-2" />
                          {appt.doctorName}
                        </h3>
                        <HealthStatusBadge status={status} value={label} />
                      </div>

                      {appt.specialty && (
                        <p className="text-sm text-gray-600 mb-2">
                          Chuyên khoa: {appt.specialty}
                        </p>
                      )}

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>
                            {appointmentDate.toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}{' '}
                            - {appointmentDate.toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {appt.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{appt.location}</span>
                          </div>
                        )}
                      </div>

                      {appt.reason && (
                        <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded-lg">
                          <strong>Lý do:</strong> {appt.reason}
                        </p>
                      )}

                      {appt.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          Ghi chú: {appt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {appt.status === 'SCHEDULED' && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenModal(appt)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleCancel(appt.id)}
                          disabled={cancelLoading}
                        >
                          <X size={16} />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(appt.id)}
                      disabled={deleteLoading}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Chưa có lịch hẹn nào
          </h3>
          <p className="text-gray-500 mb-4">
            Đặt lịch khám bệnh hoặc tái khám với bác sĩ
          </p>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Đặt lịch đầu tiên
          </Button>
        </Card>
      )}

      {/* Add/Edit Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAppointment ? 'Chỉnh sửa lịch hẹn' : 'Đặt lịch hẹn mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup
            label="Tên bác sĩ"
            htmlFor="doctorName"
            error={formErrors.doctorName}
            required
          >
            <Input
              id="doctorName"
              value={formData.doctorName}
              onChange={(e) => handleInputChange('doctorName', e.target.value)}
              placeholder="VD: BS. Nguyễn Văn A"
              error={!!formErrors.doctorName}
            />
          </FormGroup>

          <FormGroup label="Chuyên khoa" htmlFor="specialty">
            <Input
              id="specialty"
              value={formData.specialty}
              onChange={(e) => handleInputChange('specialty', e.target.value)}
              placeholder="VD: Tim mạch, Da liễu, ..."
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup
              label="Ngày khám"
              htmlFor="appointmentDate"
              error={formErrors.appointmentDate}
              required
            >
              <Input
                id="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  handleInputChange('appointmentDate', e.target.value)
                }
                min={new Date().toISOString().split('T')[0]}
                error={!!formErrors.appointmentDate}
              />
            </FormGroup>

            <FormGroup
              label="Giờ khám"
              htmlFor="appointmentTime"
              error={formErrors.appointmentTime}
              required
            >
              <Input
                id="appointmentTime"
                type="time"
                value={formData.appointmentTime}
                onChange={(e) =>
                  handleInputChange('appointmentTime', e.target.value)
                }
                error={!!formErrors.appointmentTime}
              />
            </FormGroup>
          </div>

          <FormGroup label="Địa điểm" htmlFor="location">
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="VD: Bệnh viện ABC, Phòng khám XYZ"
            />
          </FormGroup>

          <FormGroup label="Lý do khám" htmlFor="reason">
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Mô tả triệu chứng hoặc lý do khám..."
              rows={3}
            />
          </FormGroup>

          <FormGroup label="Ghi chú" htmlFor="notes">
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ghi chú thêm..."
              rows={2}
            />
          </FormGroup>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={createLoading || updateLoading}>
              {createLoading || updateLoading ? (
                <LoadingSpinner size="sm" />
              ) : editingAppointment ? (
                'Cập nhật'
              ) : (
                'Đặt lịch'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
