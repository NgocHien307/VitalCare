import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Weight,
  TrendingUp,
  Pill,
  Calendar,
  FileText,
  AlertCircle,
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

// Custom Hooks
import { useRecentHealthMetrics, useCreateHealthMetric } from '../hooks/useHealthMetrics';
import { useActiveMedicines } from '../hooks/useMedicines';
import { useHealthInsights } from '../hooks/useDSS';
import { useToast } from '../contexts/ToastContext';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    metricType: '',
    value: '',
    systolic: '',
    diastolic: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Toast notifications
  const { success, error: showError } = useToast();

  // Fetch data from backend
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const {
    data: recentMetrics,
    loading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useRecentHealthMetrics(sevenDaysAgo);

  const {
    data: medications,
    loading: medsLoading,
    error: medsError,
  } = useActiveMedicines();

  const {
    data: insights,
    loading: insightsLoading,
    error: insightsError,
  } = useHealthInsights(false);

  const {
    mutate: createMetric,
    loading: createLoading,
  } = useCreateHealthMetric();

  // Process blood pressure data for chart
  const bloodPressureData = React.useMemo(() => {
    if (!recentMetrics) return [];

    const bpMetrics = recentMetrics
      .filter((m) => m.metricType === 'BLOOD_PRESSURE')
      .sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt))
      .slice(-7); // Last 7 readings

    return bpMetrics.map((m) => ({
      day: new Date(m.measuredAt).toLocaleDateString('vi-VN', {
        weekday: 'short',
      }),
      systolic: m.systolic,
      diastolic: m.diastolic,
      date: m.measuredAt,
    }));
  }, [recentMetrics]);

  // Get latest metrics for KPI cards
  const latestMetrics = React.useMemo(() => {
    if (!recentMetrics) return {};

    const getLatest = (type) => {
      const metrics = recentMetrics
        .filter((m) => m.metricType === type)
        .sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt));
      return metrics[0];
    };

    return {
      heartRate: getLatest('HEART_RATE'),
      bloodPressure: getLatest('BLOOD_PRESSURE'),
      weight: getLatest('WEIGHT'),
      bloodSugar: getLatest('BLOOD_SUGAR'),
    };
  }, [recentMetrics]);

  // Determine status for KPI cards
  const getHeartRateStatus = (hr) => {
    if (!hr) return 'normal';
    const rate = hr.value;
    if (rate < 60 || rate > 100) return 'warning';
    return 'normal';
  };

  const getBloodPressureStatus = (bp) => {
    if (!bp) return 'normal';
    const { systolic, diastolic } = bp;
    if (systolic >= 140 || diastolic >= 90) return 'warning';
    if (systolic >= 180 || diastolic >= 120) return 'danger';
    return 'normal';
  };

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.metricType) errors.metricType = 'Vui lòng chọn loại chỉ số';

    if (formData.metricType === 'BLOOD_PRESSURE') {
      if (!formData.systolic) errors.systolic = 'Vui lòng nhập tâm thu';
      else if (isNaN(formData.systolic)) errors.systolic = 'Giá trị phải là số';
      if (!formData.diastolic) errors.diastolic = 'Vui lòng nhập tâm trương';
      else if (isNaN(formData.diastolic)) errors.diastolic = 'Giá trị phải là số';
    } else {
      if (!formData.value) errors.value = 'Vui lòng nhập giá trị';
      else if (isNaN(formData.value)) errors.value = 'Giá trị phải là số';
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

    try {
      const payload = {
        metricType: formData.metricType,
        measuredAt: new Date().toISOString(),
        notes: formData.notes || null,
      };

      if (formData.metricType === 'BLOOD_PRESSURE') {
        payload.systolic = parseFloat(formData.systolic);
        payload.diastolic = parseFloat(formData.diastolic);
      } else {
        payload.value = parseFloat(formData.value);
      }

      await createMetric(payload);
      success('Đã lưu chỉ số thành công!');
      setFormData({ metricType: '', value: '', systolic: '', diastolic: '', notes: '' });
      setIsModalOpen(false);
      refetchMetrics(); // Refresh data
    } catch (err) {
      showError(err.message || 'Không thể lưu chỉ số. Vui lòng thử lại.');
    }
  };

  // Loading state
  if (metricsLoading || medsLoading || insightsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (metricsError || medsError || insightsError) {
    return (
      <div className="container py-8">
        <Alert type="error">
          <AlertCircle size={20} className="mr-2" />
          <strong>Lỗi:</strong> Không thể tải dữ liệu. Vui lòng thử lại sau.
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Dashboard - Tổng quan sức khỏe
            </h1>
            <p className="text-gray-600">
              Theo dõi các chỉ số sức khỏe của bạn theo thời gian thực
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            + Thêm chỉ số mới
          </Button>
        </div>

        {/* Health Insights Alert */}
        {insights && insights.length > 0 && insights[0].severity === 'HIGH' && (
          <Alert type="warning" className="mb-6">
            <AlertCircle size={20} className="mr-2" />
            <strong>Cảnh báo:</strong> {insights[0].message}
          </Alert>
        )}

        {/* KPI Cards */}
        <div className="dashboard-grid mb-8">
          <KPICard status={getHeartRateStatus(latestMetrics.heartRate)}>
            <div className="flex items-start justify-between mb-3">
              <Heart className="text-success-500" size={32} aria-hidden="true" />
              <HealthStatusBadge
                status={getHeartRateStatus(latestMetrics.heartRate)}
                value={getHeartRateStatus(latestMetrics.heartRate) === 'normal' ? 'Tốt' : 'Cảnh báo'}
              />
            </div>
            <MetricDisplay
              label="Nhịp tim"
              value={latestMetrics.heartRate?.value || '--'}
              unit="bpm"
              status={getHeartRateStatus(latestMetrics.heartRate)}
            />
          </KPICard>

          <KPICard status={getBloodPressureStatus(latestMetrics.bloodPressure)}>
            <div className="flex items-start justify-between mb-3">
              <Activity className="text-warning-500" size={32} aria-hidden="true" />
              <HealthStatusBadge
                status={getBloodPressureStatus(latestMetrics.bloodPressure)}
                value={getBloodPressureStatus(latestMetrics.bloodPressure) === 'normal' ? 'Bình thường' : 'Cảnh báo'}
              />
            </div>
            <MetricDisplay
              label="Huyết áp"
              value={
                latestMetrics.bloodPressure
                  ? `${latestMetrics.bloodPressure.systolic}/${latestMetrics.bloodPressure.diastolic}`
                  : '--'
              }
              unit="mmHg"
              status={getBloodPressureStatus(latestMetrics.bloodPressure)}
            />
          </KPICard>

          <KPICard status="normal">
            <div className="flex items-start justify-between mb-3">
              <Weight className="text-primary-500" size={32} aria-hidden="true" />
              <HealthStatusBadge status="normal" value="Ổn định" />
            </div>
            <MetricDisplay
              label="Cân nặng"
              value={latestMetrics.weight?.value || '--'}
              unit="kg"
              status="normal"
            />
          </KPICard>

          <KPICard status="normal">
            <div className="flex items-start justify-between mb-3">
              <TrendingUp className="text-success-500" size={32} aria-hidden="true" />
              <HealthStatusBadge status="normal" value="Tốt" />
            </div>
            <MetricDisplay
              label="Đường huyết"
              value={latestMetrics.bloodSugar?.value || '--'}
              unit="mg/dL"
              status="normal"
            />
          </KPICard>
        </div>

        {/* Blood Pressure Chart */}
        {bloodPressureData.length > 0 && (
          <Card className="mb-8" hover={false}>
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
                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
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
            </Alert>
          </Card>
        )}

        {/* Medication Timeline */}
        {medications && medications.length > 0 && (
          <Card hover={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Pill size={28} aria-hidden="true" />
                Thuốc đang sử dụng
              </h2>
              <Button size="sm" variant="secondary">
                <Calendar size={16} className="mr-2" aria-hidden="true" />
                Xem tất cả
              </Button>
            </div>

            <div className="space-y-4">
              {medications.slice(0, 5).map((med) => (
                <div key={med.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">{med.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {med.dosage} - {med.frequency}
                    </p>
                    {med.notes && (
                      <p className="text-sm text-gray-500 mt-1">{med.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-primary-600 font-medium">
                      {new Date(med.startDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Add Metric Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm chỉ số sức khỏe mới"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup
            label="Loại chỉ số"
            htmlFor="metricType"
            error={formErrors.metricType}
            required
          >
            <Select
              id="metricType"
              value={formData.metricType}
              onChange={(e) => handleInputChange('metricType', e.target.value)}
              error={!!formErrors.metricType}
            >
              <option value="">Chọn loại chỉ số</option>
              <option value="BLOOD_PRESSURE">Huyết áp</option>
              <option value="HEART_RATE">Nhịp tim</option>
              <option value="BLOOD_SUGAR">Đường huyết</option>
              <option value="WEIGHT">Cân nặng</option>
              <option value="TEMPERATURE">Nhiệt độ</option>
              <option value="BMI">BMI</option>
            </Select>
          </FormGroup>

          {formData.metricType === 'BLOOD_PRESSURE' ? (
            <>
              <FormGroup
                label="Tâm thu (Systolic)"
                htmlFor="systolic"
                error={formErrors.systolic}
                required
              >
                <Input
                  id="systolic"
                  type="number"
                  value={formData.systolic}
                  onChange={(e) => handleInputChange('systolic', e.target.value)}
                  placeholder="Nhập giá trị tâm thu"
                  error={!!formErrors.systolic}
                />
              </FormGroup>

              <FormGroup
                label="Tâm trương (Diastolic)"
                htmlFor="diastolic"
                error={formErrors.diastolic}
                required
              >
                <Input
                  id="diastolic"
                  type="number"
                  value={formData.diastolic}
                  onChange={(e) => handleInputChange('diastolic', e.target.value)}
                  placeholder="Nhập giá trị tâm trương"
                  error={!!formErrors.diastolic}
                />
              </FormGroup>
            </>
          ) : (
            formData.metricType && (
              <FormGroup
                label="Giá trị"
                htmlFor="value"
                error={formErrors.value}
                required
              >
                <Input
                  id="value"
                  type="number"
                  step="0.1"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder="Nhập giá trị"
                  error={!!formErrors.value}
                />
              </FormGroup>
            )
          )}

          <FormGroup label="Ghi chú" htmlFor="notes">
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ghi chú (tùy chọn)"
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
            <Button type="submit" disabled={createLoading}>
              {createLoading ? <LoadingSpinner size="sm" /> : 'Lưu chỉ số'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
