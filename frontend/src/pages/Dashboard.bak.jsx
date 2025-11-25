import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Weight,
  TrendingUp,
  Pill,
  Calendar,
  FileText,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import KPICard from '../components/KPICard';
import Card from '../components/Card';
import Button from '../components/Button';
import FormGroup from '../components/FormGroup';
import Input from '../components/Input';
import Select from '../components/Select';
import Alert from '../components/Alert';
import MetricDisplay from '../components/MetricDisplay';
import HealthStatusBadge from '../components/HealthStatusBadge';
import ProgressRing from '../components/ProgressRing';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

// Mock data
const bloodPressureData = [
  { day: 'T2', systolic: 120, diastolic: 80 },
  { day: 'T3', systolic: 118, diastolic: 78 },
  { day: 'T4', systolic: 122, diastolic: 82 },
  { day: 'T5', systolic: 125, diastolic: 85 },
  { day: 'T6', systolic: 121, diastolic: 81 },
  { day: 'T7', systolic: 119, diastolic: 79 },
  { day: 'CN', systolic: 117, diastolic: 77 },
];

const medications = [
  {
    id: 1,
    name: 'Aspirin 100mg',
    time: '08:00',
    taken: true,
    note: 'Uống sau bữa sáng',
  },
  {
    id: 2,
    name: 'Vitamin D3',
    time: '12:00',
    taken: true,
    note: 'Uống cùng bữa trưa',
  },
  {
    id: 3,
    name: 'Omega-3',
    time: '20:00',
    taken: false,
    note: 'Uống trước khi ngủ',
  },
];

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    metricType: '',
    value: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.metricType) errors.metricType = 'Vui lòng chọn loại chỉ số';
    if (!formData.value) errors.value = 'Vui lòng nhập giá trị';
    else if (isNaN(formData.value)) errors.value = 'Giá trị phải là số';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setFormData({ metricType: '', value: '', notes: '' });
      alert('Đã lưu chỉ số thành công!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard - Tổng quan sức khỏe
          </h1>
          <p className="text-gray-600">
            Theo dõi các chỉ số sức khỏe của bạn theo thời gian thực
          </p>
        </div>

        {/* Alert */}
        <Alert type="warning" className="mb-6">
          <strong>Lưu ý:</strong> Huyết áp của bạn đã tăng trong 2 ngày qua. Hãy theo dõi
          chặt chẽ và tham khảo ý kiến bác sĩ nếu cần thiết.
        </Alert>

        {/* KPI Cards */}
        <div className="dashboard-grid mb-8">
          <KPICard status="normal">
            <div className="flex items-start justify-between mb-3">
              <Heart className="text-success-500" size={32} aria-hidden="true" />
              <HealthStatusBadge status="normal" value="Tốt" />
            </div>
            <MetricDisplay label="Nhịp tim" value="72" unit="bpm" status="normal" />
          </KPICard>

          <KPICard status="warning">
            <div className="flex items-start justify-between mb-3">
              <Activity className="text-warning-500" size={32} aria-hidden="true" />
              <HealthStatusBadge status="warning" value="Cảnh báo" />
            </div>
            <MetricDisplay
              label="Huyết áp"
              value="125/85"
              unit="mmHg"
              status="warning"
            />
          </KPICard>

          <KPICard status="normal">
            <div className="flex items-start justify-between mb-3">
              <Weight className="text-primary-500" size={32} aria-hidden="true" />
              <HealthStatusBadge status="normal" value="Ổn định" />
            </div>
            <MetricDisplay label="Cân nặng" value="68.5" unit="kg" status="normal" />
          </KPICard>

          <KPICard status="success">
            <div className="flex items-start justify-between mb-3">
              <TrendingUp className="text-success-500" size={32} aria-hidden="true" />
              <HealthStatusBadge status="normal" value="Đạt mục tiêu" />
            </div>
            <MetricDisplay label="Số bước" value="8,542" unit="bước" status="normal" />
          </KPICard>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Blood Pressure Chart - Spans 2 columns */}
          <Card className="lg:col-span-2" hover={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Biểu đồ huyết áp 7 ngày
              </h2>
              <Button size="sm" variant="secondary">
                <FileText size={16} className="mr-2" aria-hidden="true" />
                Xuất báo cáo
              </Button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bloodPressureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                <XAxis
                  dataKey="day"
                  stroke="var(--gray-600)"
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  stroke="var(--gray-600)"
                  style={{ fontSize: '14px' }}
                  domain={[60, 140]}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '0.5rem',
                    fontSize: '14px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="var(--chart-danger)"
                  strokeWidth={2}
                  name="Tâm thu (Systolic)"
                  dot={{ fill: 'var(--chart-danger)', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="var(--chart-good)"
                  strokeWidth={2}
                  name="Tâm trương (Diastolic)"
                  dot={{ fill: 'var(--chart-good)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <Alert type="info" className="mt-4">
              <strong>Thông tin:</strong> Huyết áp bình thường là dưới 120/80 mmHg.
              Biểu đồ cho thấy xu hướng tăng nhẹ trong 2 ngày gần đây.
            </Alert>
          </Card>

          {/* Weekly Goal Progress */}
          <Card hover={false}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Mục tiêu tuần này
            </h3>
            <div className="flex flex-col items-center py-4">
              <ProgressRing percentage={75} size={140} />
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm mb-1">Số bước đã đi</p>
                <p className="text-2xl font-bold text-primary-600 tabular-nums">
                  52,794 / 70,000
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Còn 17,206 bước để đạt mục tiêu!
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medication Timeline */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Pill size={28} aria-hidden="true" />
                Lịch uống thuốc hôm nay
              </h2>
              <Button size="sm" variant="secondary">
                <Calendar size={16} className="mr-2" aria-hidden="true" />
                Xem tất cả
              </Button>
            </div>

            <div className="med-timeline">
              {medications.map((med) => (
                <div key={med.id} className="med-timeline-item">
                  <div
                    className={`med-timeline-dot ${
                      med.taken ? 'bg-success-500 shadow-success-500/50' : 'bg-gray-300'
                    }`}
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{med.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{med.note}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-primary-600">
                        {med.time}
                      </p>
                      {med.taken ? (
                        <span className="text-xs text-success-600 font-medium">
                          ✓ Đã uống
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">
                          Chưa uống
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Add New Reading Form */}
          <Card hover={false}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Thêm chỉ số sức khỏe mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormGroup
                label="Loại chỉ số"
                error={formErrors.metricType}
                required
                id="metricType"
              >
                <Select
                  id="metricType"
                  value={formData.metricType}
                  onChange={(e) => handleInputChange('metricType', e.target.value)}
                  options={[
                    { label: 'Huyết áp', value: 'blood_pressure' },
                    { label: 'Nhịp tim', value: 'heart_rate' },
                    { label: 'Cân nặng', value: 'weight' },
                    { label: 'Đường huyết', value: 'blood_sugar' },
                    { label: 'Nhiệt độ', value: 'temperature' },
                  ]}
                  placeholder="Chọn loại chỉ số"
                />
              </FormGroup>

              <FormGroup
                label="Giá trị"
                error={formErrors.value}
                helper="Ví dụ: 120/80 cho huyết áp, 72 cho nhịp tim"
                required
                id="value"
              >
                <Input
                  id="value"
                  type="text"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder="Nhập giá trị"
                  error={!!formErrors.value}
                  aria-describedby="value-helper value-error"
                />
              </FormGroup>

              <FormGroup label="Ghi chú (tùy chọn)" id="notes">
                <Input
                  id="notes"
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Ví dụ: Đo sau khi tập thể dục"
                />
              </FormGroup>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <LoadingSpinner size={20} className="mr-2" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu chỉ số'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Xem báo cáo
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Báo cáo sức khỏe chi tiết"
      >
        <Alert type="success" className="mb-4">
          Tổng quan sức khỏe của bạn trong tuần qua cho thấy các chỉ số đều ở mức tốt.
        </Alert>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Nhịp tim trung bình</h3>
            <p className="text-gray-600">
              72 bpm - Nằm trong khoảng bình thường (60-100 bpm)
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Huyết áp</h3>
            <p className="text-gray-600">
              Trung bình 122/82 mmHg - Hơi cao một chút, nên theo dõi thêm
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Hoạt động thể chất</h3>
            <p className="text-gray-600">
              Trung bình 7,542 bước/ngày - Tốt! Cố gắng duy trì trên 7,000 bước
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="flex-1" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>
          <Button variant="secondary">
            <FileText size={20} className="mr-2" aria-hidden="true" />
            Tải xuống PDF
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
