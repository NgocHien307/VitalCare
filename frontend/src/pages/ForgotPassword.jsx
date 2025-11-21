import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import FormGroup from '../components/FormGroup';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';

const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Validation function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      // Mock API call - replace with actual password reset request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if email exists (mock validation)
      const emailExists = email.includes('@'); // Mock check - replace with actual API response

      if (!emailExists) {
        setSubmitError('Email không tồn tại trong hệ thống');
        setIsLoading(false);
        return;
      }

      // Success - show confirmation screen
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleChange = (value) => {
    setEmail(value);
    // Clear errors when user types
    if (errors.email) {
      setErrors({});
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  // Resend email handler
  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // Mock resend API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Show temporary success message
      Alert.success = 'Email đã được gửi lại!';
    } catch (error) {
      setSubmitError('Không thể gửi lại email. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {!isSubmitted ? (
          <>
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-xl mb-4">
                <Mail className="text-white" size={32} aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quên mật khẩu?
              </h1>
              <p className="text-gray-600">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu
              </p>
            </div>

            {/* Forgot Password Form */}
            <Card hover={false} className="mb-6">
              {/* Error Alert */}
              {submitError && (
                <Alert type="danger" className="mb-4">
                  {submitError}
                </Alert>
              )}

              {/* Info Alert */}
              <Alert type="info" className="mb-6">
                <strong>Lưu ý:</strong> Email chứa liên kết đặt lại mật khẩu sẽ hết hạn sau 1 giờ.
              </Alert>

              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <FormGroup
                  label="Địa chỉ email"
                  error={errors.email}
                  helper="Nhập email bạn đã sử dụng khi đăng ký tài khoản"
                  required
                  id="email"
                >
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => handleChange(e.target.value)}
                      error={!!errors.email}
                      className="pl-10"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </FormGroup>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mb-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size={20} className="mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Gửi liên kết đặt lại'
                  )}
                </Button>

                {/* Back to Login Link */}
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('/login')}
                  className="flex items-center justify-center w-full text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" aria-hidden="true" />
                  Quay lại đăng nhập
                </button>
              </form>
            </Card>

            {/* Additional Help */}
            <Card hover={false}>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Cần thêm trợ giúp?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Nếu bạn không thể truy cập email hoặc gặp vấn đề khác, vui lòng liên hệ với chúng tôi:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>
                    Email hỗ trợ:{' '}
                    <a href="mailto:support@healthtracker.com" className="text-primary-600 hover:text-primary-700 font-medium">
                      support@healthtracker.com
                    </a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Hotline: 1900-xxxx (8:00 - 22:00 hàng ngày)</span>
                </li>
              </ul>
            </Card>
          </>
        ) : (
          <>
            {/* Success Screen */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success-500 rounded-xl mb-4">
                <CheckCircle className="text-white" size={32} aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Kiểm tra email của bạn
              </h1>
              <p className="text-gray-600">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến
              </p>
              <p className="text-gray-800 font-semibold mt-1">{email}</p>
            </div>

            {/* Success Card */}
            <Card hover={false} className="mb-6">
              <Alert type="success" className="mb-6">
                <strong>Email đã được gửi thành công!</strong>
                <br />
                Vui lòng kiểm tra hộp thư đến của bạn.
              </Alert>

              {/* Instructions */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-800">Các bước tiếp theo:</h3>
                <ol className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5">
                      1
                    </span>
                    <span>
                      Mở email với tiêu đề "Đặt lại mật khẩu - Health Tracker"
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5">
                      2
                    </span>
                    <span>
                      Nhấp vào liên kết "Đặt lại mật khẩu" trong email
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5">
                      3
                    </span>
                    <span>
                      Tạo mật khẩu mới và đăng nhập vào tài khoản
                    </span>
                  </li>
                </ol>
              </div>

              {/* Didn't receive email */}
              <Alert type="warning">
                <strong>Không nhận được email?</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Kiểm tra thư mục Spam/Junk</li>
                  <li>• Đảm bảo email nhập đúng</li>
                  <li>• Đợi vài phút trước khi gửi lại</li>
                </ul>
              </Alert>

              {/* Resend Email Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full mb-3"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size={20} className="mr-2" />
                      Đang gửi lại...
                    </>
                  ) : (
                    'Gửi lại email'
                  )}
                </Button>

                {/* Back to Login */}
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('/login')}
                  className="flex items-center justify-center w-full text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" aria-hidden="true" />
                  Quay lại đăng nhập
                </button>
              </div>
            </Card>

            {/* Security Notice */}
            <Alert type="info">
              <strong>Bảo mật:</strong> Liên kết đặt lại mật khẩu chỉ có hiệu lực trong 1 giờ và chỉ có thể sử dụng một lần.
            </Alert>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
