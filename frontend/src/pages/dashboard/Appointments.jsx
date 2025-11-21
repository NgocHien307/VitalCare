import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, MapPin, User, Phone, Search, Filter, Edit, Trash2, X } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import FormGroup from '../../components/FormGroup';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import HealthStatusBadge from '../../components/HealthStatusBadge';
import { appointmentsAPI } from '../../utils/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
    phone: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsAPI.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      // Use mock data as fallback
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  const mockAppointments = [
    {
      id: 1,
      doctorName: 'BS. Nguyễn Văn A',
      specialty: 'Tim mạch',
      date: '2024-11-25',
      time: '09:00',
      location: 'Phòng khám Tim mạch, Tầng 3',
      phone: '0901234567',
      notes: 'Khám định kỳ',
      status: 'upcoming',
    },
    {
      id: 2,
      doctorName: 'BS. Trần Thị B',
      specialty: 'Nội tiết',
      date: '2024-11-20',
      time: '14:30',
      location: 'Phòng khám Nội tiết, Tầng 2',
      phone: '0912345678',
      notes: 'Xét nghiệm đường huyết',
      status: 'upcoming',
    },
    {
      id: 3,
      doctorName: 'BS. Lê Văn C',
      specialty: 'Tổng quát',
      date: '2024-11-10',
      time: '10:00',
      location: 'Phòng khám Tổng quát, Tầng 1',
      phone: '0923456789',
      notes: 'Khám sức khỏe định kỳ',
      status: 'completed',
    },
  ];

  const handleOpenModal = (appointment = null) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        doctorName: appointment.doctorName,
        specialty: appointment.specialty,
        date: appointment.date,
        time: appointment.time,
        location: appointment.location,
        phone: appointment.phone,
        notes: appointment.notes,
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        doctorName: '',
        specialty: '',
        date: '',
        time: '',
        location: '',
        phone: '',
        notes: '',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setFormData({
      doctorName: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
      phone: '',
      notes: '',
    });
    setFormErrors({});
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.doctorName) errors.doctorName = 'Tên bác sĩ là bắt buộc';
    if (!formData.specialty) errors.specialty = 'Chuyên khoa là bắt buộc';
    if (!formData.date) errors.date = 'Ngày khám là bắt buộc';
    if (!formData.time) errors.time = 'Giờ khám là bắt buộc';
    if (!formData.location) errors.location = 'Địa điểm là bắt buộc';
    if (!formData.phone) errors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^0\d{9,10}$/.test(formData.phone.replace(/-/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitLoading(true);
    try {
      if (editingAppointment) {
        await appointmentsAPI.update(editingAppointment.id, formData);
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === editingAppointment.id ? { ...apt, ...formData } : apt
          )
        );
      } else {
        const newAppointment = await appointmentsAPI.create(formData);
        setAppointments((prev) => [...prev, { ...formData, id: Date.now(), status: 'upcoming' }]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save appointment:', error);
      alert('Không thể lưu lịch hẹn. Vui lòng thử lại.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) return;

    try {
      await appointmentsAPI.delete(id);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      alert('Không thể xóa lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) return;

    try {
      await appointmentsAPI.cancel(id);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
      );
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('Không thể hủy lịch hẹn. Vui lòng thử lại.');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return <HealthStatusBadge status="info" value="Sắp tới" />;
      case 'completed':
        return <HealthStatusBadge status="normal" value="Hoàn thành" />;
      case 'cancelled':
        return <HealthStatusBadge status="danger" value="Đã hủy" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Lịch hẹn</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý lịch khám bệnh và nhắc nhở
          </p>
        </div>
        <Button variant="primary" className="gap-2" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Thêm lịch hẹn
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Tìm kiếm theo bác sĩ hoặc chuyên khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Sắp tới', value: 'upcoming' },
                { label: 'Hoàn thành', value: 'completed' },
                { label: 'Đã hủy', value: 'cancelled' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Không có lịch hẹn
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Không tìm thấy lịch hẹn phù hợp'
                : 'Bạn chưa có lịch hẹn nào'}
            </p>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Thêm lịch hẹn đầu tiên
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} hover>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {appointment.doctorName}
                      </h3>
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        {appointment.specialty}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{new Date(appointment.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{appointment.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span>{appointment.phone}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      <strong>Ghi chú:</strong> {appointment.notes}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleOpenModal(appointment)}
                  >
                    <Edit size={16} />
                    Sửa
                  </Button>
                  {appointment.status === 'upcoming' && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      <X size={16} />
                      Hủy
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    <Trash2 size={16} />
                    Xóa
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAppointment ? 'Sửa lịch hẹn' : 'Thêm lịch hẹn mới'}
      >
        <form onSubmit={handleSubmit}>
          <FormGroup label="Tên bác sĩ" error={formErrors.doctorName} required id="doctorName">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="doctorName"
                placeholder="BS. Nguyễn Văn A"
                value={formData.doctorName}
                onChange={(e) => handleChange('doctorName', e.target.value)}
                error={!!formErrors.doctorName}
                className="pl-10"
              />
            </div>
          </FormGroup>

          <FormGroup label="Chuyên khoa" error={formErrors.specialty} required id="specialty">
            <Select
              id="specialty"
              value={formData.specialty}
              onChange={(e) => handleChange('specialty', e.target.value)}
              options={[
                { label: 'Tim mạch', value: 'Tim mạch' },
                { label: 'Nội tiết', value: 'Nội tiết' },
                { label: 'Tiêu hóa', value: 'Tiêu hóa' },
                { label: 'Thần kinh', value: 'Thần kinh' },
                { label: 'Tổng quát', value: 'Tổng quát' },
                { label: 'Khác', value: 'Khác' },
              ]}
              placeholder="Chọn chuyên khoa"
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Ngày khám" error={formErrors.date} required id="date">
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                error={!!formErrors.date}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>

            <FormGroup label="Giờ khám" error={formErrors.time} required id="time">
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                error={!!formErrors.time}
              />
            </FormGroup>
          </div>

          <FormGroup label="Địa điểm" error={formErrors.location} required id="location">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="location"
                placeholder="Phòng khám Tim mạch, Tầng 3"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                error={!!formErrors.location}
                className="pl-10"
              />
            </div>
          </FormGroup>

          <FormGroup label="Số điện thoại" error={formErrors.phone} required id="phone">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="phone"
                type="tel"
                placeholder="0901234567"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={!!formErrors.phone}
                className="pl-10"
              />
            </div>
          </FormGroup>

          <FormGroup label="Ghi chú" id="notes">
            <Textarea
              id="notes"
              placeholder="Thêm ghi chú về lịch hẹn..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
            />
          </FormGroup>

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={submitLoading} className="flex-1">
              {submitLoading ? (
                <>
                  <LoadingSpinner size={20} className="mr-2" />
                  Đang lưu...
                </>
              ) : editingAppointment ? (
                'Cập nhật'
              ) : (
                'Thêm lịch hẹn'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
