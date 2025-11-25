import React, { useState } from 'react';
import {
  Plus,
  Pill,
  Clock,
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import FormGroup from '../../components/FormGroup';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

// Custom Hooks
import {
  useMedicines,
  useCreateMedicine,
  useUpdateMedicine,
  useDeleteMedicine,
} from '../../hooks/useMedicines';
import { useToast } from '../../contexts/ToastContext';

const Medications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const { success, error: showError } = useToast();

  // Fetch medicines
  const {
    data: medications,
    loading,
    error: fetchError,
    refetch,
  } = useMedicines();

  const { mutate: createMedicine, loading: createLoading } =
    useCreateMedicine();
  const { mutate: updateMedicine, loading: updateLoading } =
    useUpdateMedicine();
  const { mutate: deleteMedicine, loading: deleteLoading } =
    useDeleteMedicine();

  const handleOpenModal = (medication = null) => {
    if (medication) {
      setEditingMedication(medication);
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        startDate: medication.startDate?.split('T')[0] || '',
        endDate: medication.endDate?.split('T')[0] || '',
        notes: medication.notes || '',
      });
    } else {
      setEditingMedication(null);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: '',
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
    if (!formData.name) errors.name = 'Vui lòng nhập tên thuốc';
    if (!formData.dosage) errors.dosage = 'Vui lòng nhập liều lượng';
    if (!formData.frequency) errors.frequency = 'Vui lòng nhập tần suất';
    if (!formData.startDate) errors.startDate = 'Vui lòng chọn ngày bắt đầu';
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
      const payload = {
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null,
        notes: formData.notes || null,
      };

      if (editingMedication) {
        await updateMedicine(editingMedication.id, payload);
        success('Đã cập nhật thuốc thành công!');
      } else {
        await createMedicine(payload);
        success('Đã thêm thuốc mới thành công!');
      }

      setIsModalOpen(false);
      refetch();
    } catch (err) {
      showError(err.message || 'Không thể lưu thuốc. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      return;
    }

    try {
      await deleteMedicine(id);
      success('Đã xóa thuốc thành công!');
      refetch();
    } catch (err) {
      showError(err.message || 'Không thể xóa thuốc. Vui lòng thử lại.');
    }
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
          <strong>Lỗi:</strong> Không thể tải danh sách thuốc. Vui lòng thử lại
          sau.
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
            <Pill size={40} className="text-primary-500" />
            Quản lý thuốc
          </h1>
          <p className="text-gray-600">
            Theo dõi và quản lý các loại thuốc bạn đang sử dụng
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          Thêm thuốc mới
        </Button>
      </div>

      {/* Medications Grid */}
      {medications && medications.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {medications.map((med) => (
            <Card key={med.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Pill size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {med.name}
                    </h3>
                    <p className="text-sm text-gray-600">{med.dosage}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleOpenModal(med)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(med.id)}
                    disabled={deleteLoading}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>Tần suất: {med.frequency}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    Từ {new Date(med.startDate).toLocaleDateString('vi-VN')}
                    {med.endDate &&
                      ` đến ${new Date(med.endDate).toLocaleDateString(
                        'vi-VN'
                      )}`}
                  </span>
                </div>
              </div>

              {med.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{med.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Pill size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Chưa có thuốc nào
          </h3>
          <p className="text-gray-500 mb-4">
            Bắt đầu theo dõi các loại thuốc bạn đang sử dụng
          </p>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Thêm thuốc đầu tiên
          </Button>
        </Card>
      )}

      {/* Add/Edit Medication Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMedication ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup
            label="Tên thuốc"
            htmlFor="name"
            error={formErrors.name}
            required
          >
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="VD: Aspirin"
              error={!!formErrors.name}
            />
          </FormGroup>

          <FormGroup
            label="Liều lượng"
            htmlFor="dosage"
            error={formErrors.dosage}
            required
          >
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              placeholder="VD: 100mg"
              error={!!formErrors.dosage}
            />
          </FormGroup>

          <FormGroup
            label="Tần suất"
            htmlFor="frequency"
            error={formErrors.frequency}
            required
          >
            <Input
              id="frequency"
              value={formData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
              placeholder="VD: 2 lần/ngày, mỗi sáng, ..."
              error={!!formErrors.frequency}
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup
              label="Ngày bắt đầu"
              htmlFor="startDate"
              error={formErrors.startDate}
              required
            >
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                error={!!formErrors.startDate}
              />
            </FormGroup>

            <FormGroup label="Ngày kết thúc" htmlFor="endDate">
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={formData.startDate}
              />
            </FormGroup>
          </div>

          <FormGroup label="Ghi chú" htmlFor="notes">
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ghi chú về cách dùng, thời gian uống thuốc..."
              rows={3}
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
            <Button
              type="submit"
              disabled={createLoading || updateLoading}
            >
              {createLoading || updateLoading ? (
                <LoadingSpinner size="sm" />
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
