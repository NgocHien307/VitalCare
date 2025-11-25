import React, { useState } from 'react';
import {
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Calendar,
  Activity,
  XCircle,
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
import HealthStatusBadge from '../../components/HealthStatusBadge';

// Custom Hooks
import {
  useSymptoms,
  useActiveSymptoms,
  useCreateSymptom,
  useUpdateSymptom,
  useEndSymptom,
  useDeleteSymptom,
} from '../../hooks/useSymptoms';
import { useSymptomAnalysis } from '../../hooks/useDSS';
import { useToast } from '../../contexts/ToastContext';

const Symptoms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [formData, setFormData] = useState({
    symptomName: '',
    severity: 'MILD',
    startDate: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const { success, error: showError } = useToast();

  // Fetch symptoms
  const {
    data: allSymptoms,
    loading,
    error: fetchError,
    refetch,
  } = useSymptoms();

  const { data: activeSymptoms } = useActiveSymptoms();

  const { mutate: createSymptom, loading: createLoading } =
    useCreateSymptom();
  const { mutate: updateSymptom, loading: updateLoading } =
    useUpdateSymptom();
  const { mutate: endSymptom, loading: endLoading } = useEndSymptom();
  const { mutate: deleteSymptom, loading: deleteLoading } =
    useDeleteSymptom();

  // DSS Analysis
  const {
    data: analysisResult,
    loading: analysisLoading,
    refetch: triggerAnalysis,
  } = useSymptomAnalysis(false); // Don't auto-run on mount

  const handleOpenModal = (symptom = null) => {
    if (symptom) {
      setEditingSymptom(symptom);
      setFormData({
        symptomName: symptom.symptomName,
        severity: symptom.severity,
        startDate: symptom.startDate?.split('T')[0] || '',
        notes: symptom.notes || '',
      });
    } else {
      setEditingSymptom(null);
      setFormData({
        symptomName: '',
        severity: 'MILD',
        startDate: new Date().toISOString().split('T')[0],
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
    if (!formData.symptomName) errors.symptomName = 'Vui lòng nhập tên triệu chứng';
    if (!formData.severity) errors.severity = 'Vui lòng chọn mức độ';
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
        symptomName: formData.symptomName,
        severity: formData.severity,
        startDate: new Date(formData.startDate).toISOString(),
        notes: formData.notes || null,
      };

      if (editingSymptom) {
        await updateSymptom(editingSymptom.id, payload);
        success('Đã cập nhật triệu chứng thành công!');
      } else {
        await createSymptom(payload);
        success('Đã thêm triệu chứng mới thành công!');
      }

      setIsModalOpen(false);
      refetch();
    } catch (err) {
      showError(err.message || 'Không thể lưu triệu chứng. Vui lòng thử lại.');
    }
  };

  const handleEnd = async (id) => {
    try {
      await endSymptom(id);
      success('Đã đánh dấu triệu chứng đã kết thúc!');
      refetch();
    } catch (err) {
      showError(err.message || 'Không thể cập nhật. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa triệu chứng này?')) {
      return;
    }

    try {
      await deleteSymptom(id);
      success('Đã xóa triệu chứng thành công!');
      refetch();
    } catch (err) {
      showError(err.message || 'Không thể xóa triệu chứng. Vui lòng thử lại.');
    }
  };

  const handleAnalyze = async () => {
    try {
      await triggerAnalysis();
      setShowAnalysis(true);
      success('Phân tích hoàn tất!');
    } catch (err) {
      showError(err.message || 'Không thể phân tích. Vui lòng thử lại.');
    }
  };

  const getSeverityBadge = (severity) => {
    const severityMap = {
      MILD: { label: 'Nhẹ', status: 'normal' },
      MODERATE: { label: 'Trung bình', status: 'warning' },
      SEVERE: { label: 'Nghiêm trọng', status: 'danger' },
    };
    return severityMap[severity] || severityMap.MILD;
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
          <strong>Lỗi:</strong> Không thể tải danh sách triệu chứng. Vui lòng thử
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
            <Activity size={40} className="text-primary-500" />
            Quản lý triệu chứng
          </h1>
          <p className="text-gray-600">
            Ghi nhận và theo dõi các triệu chứng sức khỏe
          </p>
        </div>
        <div className="flex gap-3">
          {activeSymptoms && activeSymptoms.length > 0 && (
            <Button
              onClick={handleAnalyze}
              variant="secondary"
              disabled={analysisLoading}
            >
              {analysisLoading ? <LoadingSpinner size="sm" /> : '🔍 Phân tích DSS'}
            </Button>
          )}
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Thêm triệu chứng
          </Button>
        </div>
      </div>

      {/* Analysis Results */}
      {showAnalysis && analysisResult && (
        <Card className="mb-6 p-6 bg-primary-50 border-primary-200">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Kết quả phân tích DSS
            </h2>
            <button
              onClick={() => setShowAnalysis(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle size={20} />
            </button>
          </div>

          {/* Urgency Score */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-gray-700">
                Mức độ khẩn cấp:
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      analysisResult.urgencyScore >= 70
                        ? 'bg-error-500'
                        : analysisResult.urgencyScore >= 40
                        ? 'bg-warning-500'
                        : 'bg-success-500'
                    }`}
                    style={{ width: `${analysisResult.urgencyScore}%` }}
                  />
                </div>
                <span className="font-bold text-lg">
                  {analysisResult.urgencyScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* Possible Diseases */}
          {analysisResult.possibleDiseases &&
            analysisResult.possibleDiseases.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Bệnh có thể xảy ra:
                </h3>
                <div className="space-y-2">
                  {analysisResult.possibleDiseases.map((disease, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-lg"
                    >
                      <span className="font-medium">{disease.name}</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(disease.matchScore * 100)}% khớp
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Recommendations */}
          {analysisResult.recommendations &&
            analysisResult.recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Khuyến nghị:
                </h3>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle size={16} className="text-success-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </Card>
      )}

      {/* Active Symptoms */}
      {activeSymptoms && activeSymptoms.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Triệu chứng đang diễn ra
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeSymptoms.map((symptom) => {
              const { label, status } = getSeverityBadge(symptom.severity);
              return (
                <Card key={symptom.id} className="p-4 border-l-4 border-warning-500">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {symptom.symptomName}
                      </h3>
                      <HealthStatusBadge status={status} value={label} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleEnd(symptom.id)}
                        disabled={endLoading}
                        title="Đánh dấu đã kết thúc"
                      >
                        <CheckCircle size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal(symptom)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(symptom.id)}
                        disabled={deleteLoading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        Bắt đầu:{' '}
                        {new Date(symptom.startDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>
                        Thời gian:{' '}
                        {Math.floor(
                          (new Date() - new Date(symptom.startDate)) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        ngày
                      </span>
                    </div>
                  </div>

                  {symptom.notes && (
                    <p className="mt-3 text-sm text-gray-700 p-2 bg-gray-50 rounded">
                      {symptom.notes}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Symptoms History */}
      {allSymptoms && allSymptoms.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Lịch sử triệu chứng
          </h2>
          <div className="space-y-3">
            {allSymptoms
              .filter((s) => s.endDate) // Only ended symptoms
              .map((symptom) => {
                const { label, status } = getSeverityBadge(symptom.severity);
                return (
                  <Card key={symptom.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {symptom.symptomName}
                          </h3>
                          <HealthStatusBadge status={status} value={label} />
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            Từ{' '}
                            {new Date(symptom.startDate).toLocaleDateString(
                              'vi-VN'
                            )}{' '}
                            đến{' '}
                            {new Date(symptom.endDate).toLocaleDateString('vi-VN')}
                          </div>
                          {symptom.notes && (
                            <p className="text-gray-700 italic">{symptom.notes}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(symptom.id)}
                        disabled={deleteLoading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Activity size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Chưa có triệu chứng nào
          </h3>
          <p className="text-gray-500 mb-4">
            Bắt đầu ghi nhận các triệu chứng sức khỏe của bạn
          </p>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Thêm triệu chứng đầu tiên
          </Button>
        </Card>
      )}

      {/* Add/Edit Symptom Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSymptom ? 'Chỉnh sửa triệu chứng' : 'Thêm triệu chứng mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup
            label="Tên triệu chứng"
            htmlFor="symptomName"
            error={formErrors.symptomName}
            required
          >
            <Input
              id="symptomName"
              value={formData.symptomName}
              onChange={(e) => handleInputChange('symptomName', e.target.value)}
              placeholder="VD: Đau đầu, Sốt, Ho, Mệt mỏi..."
              error={!!formErrors.symptomName}
            />
          </FormGroup>

          <FormGroup
            label="Mức độ nghiêm trọng"
            htmlFor="severity"
            error={formErrors.severity}
            required
          >
            <Select
              id="severity"
              value={formData.severity}
              onChange={(e) => handleInputChange('severity', e.target.value)}
              error={!!formErrors.severity}
            >
              <option value="MILD">Nhẹ</option>
              <option value="MODERATE">Trung bình</option>
              <option value="SEVERE">Nghiêm trọng</option>
            </Select>
          </FormGroup>

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
              max={new Date().toISOString().split('T')[0]}
              error={!!formErrors.startDate}
            />
          </FormGroup>

          <FormGroup label="Ghi chú" htmlFor="notes">
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Mô tả chi tiết triệu chứng, thời điểm xuất hiện..."
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
            <Button type="submit" disabled={createLoading || updateLoading}>
              {createLoading || updateLoading ? (
                <LoadingSpinner size="sm" />
              ) : editingSymptom ? (
                'Cập nhật'
              ) : (
                'Thêm triệu chứng'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Symptoms;
