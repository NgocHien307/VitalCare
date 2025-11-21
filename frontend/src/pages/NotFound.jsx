import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <Card hover={false} className="max-w-md w-full text-center">
        <div className="text-9xl font-bold text-primary-500 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Không tìm thấy trang
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="primary" className="gap-2">
              <Home size={20} />
              Về trang chủ
            </Button>
          </Link>
          <Link to="/dashboard/records">
            <Button variant="secondary" className="gap-2">
              <Search size={20} />
              Tìm kiếm
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
