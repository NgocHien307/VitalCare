import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Pill,
  Activity,
  AlertCircle,
  Info,
  CheckCircle,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
import LoadingSpinner from '../../components/LoadingSpinner';
import HealthStatusBadge from '../../components/HealthStatusBadge';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications(mockNotifications);
      setLoading(false);
    }
  };

  const mockNotifications = [
    {
      id: 1,
      type: 'medicine',
      title: 'Nhắc nhở uống thuốc',
      message: 'Đã đến giờ uống Aspirin 100mg',
      time: '2024-11-24T08:00:00',
      read: false,
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Lịch hẹn sắp tới',
      message: 'Bạn có lịch hẹn với BS. Nguyễn Văn A vào ngày mai lúc 09:00',
      time: '2024-11-23T18:00:00',
      read: false,
    },
    {
      id: 3,
      type: 'health',
      title: 'Chỉ số huyết áp cao',
      message: 'Huyết áp của bạn cao hơn bình thường (145/95 mmHg). Nên theo dõi chặt chẽ.',
      time: '2024-11-23T14:30:00',
      read: true,
    },
    {
      id: 4,
      type: 'alert',
      title: 'Cảnh báo sức khỏe',
      message: 'Bạn đã bỏ lỡ 3 liều thuốc trong tuần này. Vui lòng tuân thủ điều trị.',
      time: '2024-11-23T10:00:00',
      read: false,
    },
    {
      id: 5,
      type: 'info',
      title: 'Cập nhật hệ thống',
      message: 'Chúng tôi đã thêm tính năng theo dõi nhịp tim mới.',
      time: '2024-11-22T16:00:00',
      read: true,
    },
    {
      id: 6,
      type: 'medicine',
      title: 'Nhắc nhở uống thuốc',
      message: 'Đã đến giờ uống Metformin 500mg',
      time: '2024-11-24T07:00:00',
      read: false,
    },
    {
      id: 7,
      type: 'appointment',
      title: 'Lịch hẹn đã hoàn thành',
      message: 'Bạn đã hoàn thành lịch hẹn với BS. Trần Thị B',
      time: '2024-11-20T15:00:00',
      read: true,
    },
    {
      id: 8,
      type: 'health',
      title: 'Mục tiêu bước chân',
      message: 'Chúc mừng! Bạn đã đạt mục tiêu 10,000 bước trong ngày.',
      time: '2024-11-20T22:00:00',
      read: true,
    },
    {
      id: 9,
      type: 'medicine',
      title: 'Nhắc nhở uống thuốc',
      message: 'Đã đến giờ uống Vitamin D 1000 IU',
      time: '2024-11-18T09:00:00',
      read: true,
    },
    {
      id: 10,
      type: 'info',
      title: 'Lời khuyên sức khỏe',
      message: 'Hãy uống đủ 8 ly nước mỗi ngày để duy trì sức khỏe tốt.',
      time: '2024-11-17T08:00:00',
      read: true,
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'medicine':
        return <Pill className="text-blue-600" size={24} />;
      case 'appointment':
        return <Calendar className="text-purple-600" size={24} />;
      case 'health':
        return <Activity className="text-green-600" size={24} />;
      case 'alert':
        return <AlertCircle className="text-red-600" size={24} />;
      case 'info':
        return <Info className="text-gray-600" size={24} />;
      default:
        return <Bell className="text-gray-600" size={24} />;
    }
  };

  const getNotificationBadge = (type) => {
    switch (type) {
      case 'medicine':
        return <HealthStatusBadge status="info" value="Thuốc" />;
      case 'appointment':
        return <HealthStatusBadge status="info" value="Lịch hẹn" />;
      case 'health':
        return <HealthStatusBadge status="normal" value="Sức khỏe" />;
      case 'alert':
        return <HealthStatusBadge status="danger" value="Cảnh báo" />;
      case 'info':
        return <HealthStatusBadge status="normal" value="Thông tin" />;
      default:
        return null;
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleDelete = (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleDeleteAll = () => {
    if (!confirm('Bạn có chắc chắn muốn xóa tất cả thông báo?')) return;
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'unread' && !notif.read) ||
      (filterStatus === 'read' && notif.read);
    return matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            Thông báo
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Theo dõi các thông báo và nhắc nhở quan trọng
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" className="gap-2" onClick={handleMarkAllAsRead}>
              <CheckCircle size={20} />
              Đánh dấu đã đọc
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="danger" className="gap-2" onClick={handleDeleteAll}>
              <Trash2 size={20} />
              Xóa tất cả
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { label: 'Tất cả loại', value: 'all' },
                { label: 'Thuốc', value: 'medicine' },
                { label: 'Lịch hẹn', value: 'appointment' },
                { label: 'Sức khỏe', value: 'health' },
                { label: 'Cảnh báo', value: 'alert' },
                { label: 'Thông tin', value: 'info' },
              ]}
            />
          </div>
          <div className="flex-1">
            <Select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { label: 'Tất cả trạng thái', value: 'all' },
                { label: 'Chưa đọc', value: 'unread' },
                { label: 'Đã đọc', value: 'read' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bell className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Không có thông báo
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filterType !== 'all' || filterStatus !== 'all'
                ? 'Không tìm thấy thông báo phù hợp'
                : 'Bạn không có thông báo mới'}
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${
                  !notification.read ? 'border-l-4 border-primary-600 bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
                hover
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold ${
                            !notification.read
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {getNotificationBadge(notification.type)}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {formatTime(notification.time)}
                      </span>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Đánh dấu đã đọc
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredNotifications.length)} của{' '}
                  {filteredNotifications.length} thông báo
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
