import React, { useState, useEffect } from 'react';
import { Plus, Pill, Clock, Calendar, CheckCircle, XCircle, Edit, Trash2, AlertCircle } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import FormGroup from '../../components/FormGroup';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import HealthStatusBadge from '../../components/HealthStatusBadge';
import { medicinesAPI } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

const Medications = () => {
  const { success, error: showError } = useToast();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: ['08:00'],
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await medicinesAPI.getAll();
      setMedications(data);
    } catch (error) {
      console.error('Failed to fetch medications:', error);
      setMedications(mockMedications);
    } finally {
      setLoading(false);
    }
  };

  const mockMedications = [
    {
      id: 1,
      name: 'Aspirin',
      dosage: '100mg',
      frequency: 'daily',
      times: ['08:00', '20:00'],
      startDate: '2024-11-01',
      endDate: '2024-12-31',
      notes: 'Uống sau ăn',
      adherence: 85,
      nextDose: '2024-11-24T08:00:00',
      lastTaken: '2024-11-23T20:00:00',
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'daily',
      times: ['07:00', '12:00', '19:00'],
      startDate: '2024-10-15',
      endDate: '2025-01-15',
      notes: 'Kiểm soát đường huyết',
      adherence: 92,
      nextDose: '2024-11-24T07:00:00',
      lastTaken: '2024-11-23T19:00:00',
    },
    {
      id: 3,
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'weekly',
      times: ['09:00'],
      startDate: '2024-11-01',
      endDate: '2025-03-01',
      notes: 'Bổ sung vitamin D',
      adherence: 100,
      nextDose: '2024-11-25T09:00:00',
      lastTaken: '2024-11-18T09:00:00',
    },
  ];

  const handleOpenModal = (medication = null) => {
    if (medication) {
      setEditingMedication(medication);
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        times: medication.times,
        startDate: medication.startDate,
        endDate: medication.endDate,
        notes: medication.notes,
      });
    } else {
      setEditingMedication(null);
      setFormData({
        name: '',
        dosage: '',
        frequency: 'daily',
        times: ['08:00'],
        startDate: '',
        endDate: '',
        notes: '',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedication(null);
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['08:00'],
      startDate: '',
      endDate: '',
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

  const handleAddTime = () => {
    setFormData((prev) => ({ ...prev, times: [...prev.times, '08:00'] }));
  };

  const handleRemoveTime = (index) => {
    setFormData((prev) => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index),
    }));
  };

  const handleTimeChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      times: prev.times.map((time, i) => (i === index ? value : time)),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Tên thuốc là bắt buộc';
    if (!formData.dosage) errors.dosage = 'Liều lượng là bắt buộc';
    if (!formData.startDate) errors.startDate = 'Ngày bắt đầu là bắt buộc';
    if (formData.times.length === 0) errors.times = 'Phải có ít nhất một giờ uống thuốc';
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
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
      if (editingMedication) {
        await medicinesAPI.update(editingMedication.id, formData);
        setMedications((prev) =>
          prev.map((med) =>
            med.id === editingMedication.id ? { ...med, ...formData } : med
          )
        );
      } else {
        const newMed = await medicinesAPI.create(formData);
        setMedications((prev) => [
          ...prev,
          { ...formData, id: Date.now(), adherence: 0, nextDose: null, lastTaken: null },
        ]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save medication:', error);
      showError('Không thể lưu thuốc. Vui lòng thử lại.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thuốc này?')) return;

    try {
      await medicinesAPI.delete(id);
      setMedications((prev) => prev.filter((med) => med.id !== id));
    } catch (error) {
      console.error('Failed to delete medication:', error);
      showError('Không thể xóa thuốc. Vui lòng thử lại.');
    }
  };

  const handleLogIntake = async (medicationId, time) => {
    try {
      await medicinesAPI.logIntake(medicationId, { takenAt: new Date().toISOString() });
      setMedications((prev) =>
        prev.map((med) =>
          med.id === medicationId ? { ...med, lastTaken: new Date().toISOString() } : med
        )
      );
      success('Đã ghi nhận uống thuốc!');
    } catch (error) {
      console.error('Failed to log intake:', error);
      showError('Không thể ghi nhận. Vui lòng thử lại.');
    }
  };

  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return 'text-green-600 dark:text-green-400';
    if (adherence >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (nextDose) => {
    if (!nextDose) return false;
    return new Date(nextDose) < new Date();
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Thuốc</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý thuốc và theo dõi tuân thủ điều trị
          </p>
        </div>
        <Button variant="primary" className="gap-2" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Thêm thuốc
        </Button>
      </div>

      {/* Overall Adherence */}
      {medications.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Tuân thủ điều trị tổng thể
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tỷ lệ uống thuốc đúng giờ trong 30 ngày qua
              </p>
            </div>
            <div
              className={`text-4xl font-bold ${getAdherenceColor(
                Math.round(
                  medications.reduce((sum, med) => sum + med.adherence, 0) / medications.length
                )
              )}`}
            >
              {Math.round(
                medications.reduce((sum, med) => sum + med.adherence, 0) / medications.length
              )}
              %
            </div>
          </div>
        </Card>
      )}

      {/* Medications List */}
      {medications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Pill className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Không có thuốc
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Bạn chưa thêm thuốc nào vào danh sách
            </p>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Thêm thuốc đầu tiên
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {medications.map((medication) => (
            <Card key={medication.id} hover>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <Pill size={20} className="text-primary-600 dark:text-primary-400" />
                        {medication.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Liều lượng: {medication.dosage}
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${getAdherenceColor(medication.adherence)}`}>
                      {medication.adherence}%
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>
                        <strong>Giờ uống:</strong> {medication.times.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>
                        <strong>Thời gian:</strong>{' '}
                        {new Date(medication.startDate).toLocaleDateString('vi-VN')} -{' '}
                        {medication.endDate
                          ? new Date(medication.endDate).toLocaleDateString('vi-VN')
                          : 'Không thời hạn'}
                      </span>
                    </div>
                    {medication.nextDose && (
                      <div
                        className={`flex items-center gap-2 ${
                          isOverdue(medication.nextDose) ? 'text-red-600 dark:text-red-400' : ''
                        }`}
                      >
                        {isOverdue(medication.nextDose) ? (
                          <AlertCircle size={16} />
                        ) : (
                          <Clock size={16} className="text-gray-400" />
                        )}
                        <span>
                          <strong>Liều tiếp theo:</strong> {formatDate(medication.nextDose)}
                        </span>
                      </div>
                    )}
                    {medication.lastTaken && (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>
                          <strong>Uống lần cuối:</strong> {formatDate(medication.lastTaken)}
                        </span>
                      </div>
                    )}
                  </div>

                  {medication.notes && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      <strong>Ghi chú:</strong> {medication.notes}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleLogIntake(medication.id, medication.times[0])}
                  >
                    <CheckCircle size={16} />
                    Đã uống
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleOpenModal(medication)}
                  >
                    <Edit size={16} />
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDelete(medication.id)}
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
        title={editingMedication ? 'Sửa thông tin thuốc' : 'Thêm thuốc mới'}
      >
        <form onSubmit={handleSubmit}>
          <FormGroup label="Tên thuốc" error={formErrors.name} required id="name">
            <Input
              id="name"
              placeholder="Aspirin, Metformin..."
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!formErrors.name}
            />
          </FormGroup>

          <FormGroup label="Liều lượng" error={formErrors.dosage} required id="dosage">
            <Input
              id="dosage"
              placeholder="100mg, 500mg, 1 viên..."
              value={formData.dosage}
              onChange={(e) => handleChange('dosage', e.target.value)}
              error={!!formErrors.dosage}
            />
          </FormGroup>

          <FormGroup label="Tần suất" id="frequency">
            <Select
              id="frequency"
              value={formData.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
              options={[
                { label: 'Hàng ngày', value: 'daily' },
                { label: 'Hàng tuần', value: 'weekly' },
                { label: 'Hàng tháng', value: 'monthly' },
                { label: 'Khi cần', value: 'as-needed' },
              ]}
            />
          </FormGroup>

          <FormGroup label="Giờ uống thuốc" error={formErrors.times} required id="times">
            <div className="space-y-2">
              {formData.times.map((time, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {formData.times.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveTime(index)}
                    >
                      <XCircle size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTime}>
                <Plus size={16} className="mr-1" />
                Thêm giờ
              </Button>
            </div>
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Ngày bắt đầu" error={formErrors.startDate} required id="startDate">
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                error={!!formErrors.startDate}
              />
            </FormGroup>

            <FormGroup label="Ngày kết thúc" error={formErrors.endDate} id="endDate">
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                error={!!formErrors.endDate}
                min={formData.startDate}
              />
            </FormGroup>
          </div>

          <FormGroup label="Ghi chú" id="notes">
            <Textarea
              id="notes"
              placeholder="Uống sau ăn, lưu ý tác dụng phụ..."
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
              ) : editingMedication ? (
                'Cập nhật'
              ) : (
                'Thêm thuốc'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Medications;
