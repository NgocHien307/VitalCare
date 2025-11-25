import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Droplet,
  Weight,
  Thermometer,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Download,
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import HealthStatusBadge from '../../components/HealthStatusBadge';

// Custom Hooks
import { useHealthMetrics } from '../../hooks/useHealthMetrics';

const HealthRecords = () => {
  const [filterType, setFilterType] = useState('ALL');

  const { data: metrics, loading, error } = useHealthMetrics();

  const getMetricIcon = (type) => {
    const icons = {
      BLOOD_PRESSURE: Activity,
      HEART_RATE: Heart,
      BLOOD_SUGAR: Droplet,
      WEIGHT: Weight,
      TEMPERATURE: Thermometer,
      BMI: TrendingUp,
    };
    return icons[type] || Activity;
  };

  const getMetricColor = (type) => {
    const colors = {
      BLOOD_PRESSURE: 'text-error-500 bg-error-100',
      HEART_RATE: 'text-success-500 bg-success-100',
      BLOOD_SUGAR: 'text-warning-500 bg-warning-100',
      WEIGHT: 'text-primary-500 bg-primary-100',
      TEMPERATURE: 'text-orange-500 bg-orange-100',
      BMI: 'text-purple-500 bg-purple-100',
    };
    return colors[type] || 'text-gray-500 bg-gray-100';
  };

  const getMetricLabel = (type) => {
    const labels = {
      BLOOD_PRESSURE: 'Huyết áp',
      HEART_RATE: 'Nhịp tim',
      BLOOD_SUGAR: 'Đường huyết',
      WEIGHT: 'Cân nặng',
      TEMPERATURE: 'Nhiệt độ',
      BMI: 'BMI',
    };
    return labels[type] || type;
  };

  const getMetricValue = (metric) => {
    if (metric.metricType === 'BLOOD_PRESSURE') {
      return `${metric.systolic}/${metric.diastolic} mmHg`;
    }
    const units = {
      HEART_RATE: 'bpm',
      BLOOD_SUGAR: 'mg/dL',
      WEIGHT: 'kg',
      TEMPERATURE: '°C',
      BMI: '',
    };
    return `${metric.value} ${units[metric.metricType] || ''}`;
  };

  const getTrendIcon = (current, previous) => {
    if (!previous) return <Minus size={16} className="text-gray-400" />;
    if (current > previous)
      return <TrendingUp size={16} className="text-success-500" />;
    if (current < previous)
      return <TrendingDown size={16} className="text-error-500" />;
    return <Minus size={16} className="text-gray-400" />;
  };

  const filteredMetrics = React.useMemo(() => {
    if (!metrics) return [];
    if (filterType === 'ALL') return metrics;
    return metrics.filter((m) => m.metricType === filterType);
  }, [metrics, filterType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert type="error">
          <strong>Lỗi:</strong> Không thể tải dữ liệu. Vui lòng thử lại sau.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Hồ sơ sức khỏe
        </h1>
        <p className="text-gray-600">
          Xem lịch sử và chi tiết các chỉ số sức khỏe của bạn
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">Tất cả chỉ số</option>
            <option value="BLOOD_PRESSURE">Huyết áp</option>
            <option value="HEART_RATE">Nhịp tim</option>
            <option value="BLOOD_SUGAR">Đường huyết</option>
            <option value="WEIGHT">Cân nặng</option>
            <option value="TEMPERATURE">Nhiệt độ</option>
            <option value="BMI">BMI</option>
          </Select>
        </div>
        <Button variant="secondary" size="sm">
          <Download size={16} className="mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Metrics List */}
      {filteredMetrics.length > 0 ? (
        <div className="space-y-4">
          {filteredMetrics.map((metric, index) => {
            const Icon = getMetricIcon(metric.metricType);
            const colorClass = getMetricColor(metric.metricType);
            const previousMetric = filteredMetrics[index + 1];

            return (
              <Card key={metric.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${colorClass}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {getMetricLabel(metric.metricType)}
                        </h3>
                        <HealthStatusBadge
                          status={metric.status?.toLowerCase() || 'normal'}
                          value={
                            metric.status === 'CRITICAL'
                              ? 'Nghiêm trọng'
                              : metric.status === 'WARNING'
                              ? 'Cảnh báo'
                              : 'Bình thường'
                          }
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-bold text-primary-600">
                          {getMetricValue(metric)}
                        </p>
                        {getTrendIcon(
                          metric.value || metric.systolic,
                          previousMetric?.value || previousMetric?.systolic
                        )}
                      </div>
                      {metric.analysisNote && (
                        <p className="text-sm text-gray-600 mt-2">
                          {metric.analysisNote}
                        </p>
                      )}
                      {metric.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          Ghi chú: {metric.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">
                      {new Date(metric.measuredAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(metric.measuredAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Activity size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Chưa có dữ liệu
          </h3>
          <p className="text-gray-500 mb-4">
            Bắt đầu ghi nhận các chỉ số sức khỏe từ Dashboard
          </p>
          <Button onClick={() => (window.location.href = '/dashboard')}>
            <Plus size={20} className="mr-2" />
            Thêm chỉ số mới
          </Button>
        </Card>
      )}
    </div>
  );
};

export default HealthRecords;
