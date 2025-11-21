import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import FormGroup from '../components/FormGroup';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';

const ResetPassword = ({ onNavigate, token }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [tokenStatus, setTokenStatus] = useState('validating'); // validating, valid, invalid, expired

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Mock token validation - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Extract token from URL if not provided via props
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = token || urlParams.get('token');

        if (!resetToken) {
          setTokenStatus('invalid');
          return;
        }

        // Mock validation check
        const isExpired = resetToken === 'expired_token'; // Mock check
        const isValid = resetToken.length > 10; // Mock validation

        if (isExpired) {
          setTokenStatus('expired');
        } else if (isValid) {
          setTokenStatus('valid');
        } else {
          setTokenStatus('invalid');
        }
      } catch (error) {
        setTokenStatus('invalid');
      }
    };

    validateToken();
  }, [token]);

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  // Password requirements
  const passwordRequirements = [
    { label: 'Ít nhất 8 ký tự', met: formData.password.length >= 8 },
    { label: 'Có chữ hoa và chữ thường', met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) },
    { label: 'Có ít nhất 1 số', met: /\d/.test(formData.password) },
    { label: 'Có ký tự đặc biệt', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ];

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (passwordStrength < 100) {
      newErrors.password = 'Mật khẩu chưa đủ mạnh. Vui lòng đáp ứng tất cả yêu cầu.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
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
      // Mock API call - replace with actual password reset
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful password reset
      setIsSubmitted(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('/login');
        }
      }, 3000);
    } catch (error) {
      setSubmitError('Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state while validating token
  if (tokenStatus === 'validating') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <Card hover={false} className="max-w-md w-full text-center">
          <LoadingSpinner size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Đang xác thực liên kết...
          </h2>
          <p className="text-gray-600">
            Vui lòng đợi trong giây lát
          </p>
        </Card>
      </div>
    );
  }

  // Render invalid token screen
  if (tokenStatus === 'invalid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-danger-500 rounded-xl mb-4">
              <XCircle className="text-white" size={32} aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Liên kết không hợp lệ
            </h1>
            <p className="text-gray-600">
              Liên kết đặt lại mật khẩu này không hợp lệ hoặc đã được sử dụng
            </p>
          </div>

          <Card hover={false} className="mb-6">
            <Alert type="danger" className="mb-6">
              <strong>Không thể đặt lại mật khẩu</strong>
              <br />
              Liên kết này có thể đã được sử dụng hoặc không tồn tại.
            </Alert>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800">Bạn có thể:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Yêu cầu liên kết đặt lại mật khẩu mới</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Kiểm tra email để đảm bảo bạn đang sử dụng liên kết mới nhất</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn</span>
                </li>
              </ul>
            </div>

            <Button
              type="button"
              variant="primary"
              className="w-full mb-3"
              onClick={() => onNavigate && onNavigate('/forgot-password')}
            >
              Yêu cầu liên kết mới
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => onNavigate && onNavigate('/login')}
            >
              Quay lại đăng nhập
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Render expired token screen
  if (tokenStatus === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-warning-500 rounded-xl mb-4">
              <AlertTriangle className="text-white" size={32} aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Liên kết đã hết hạn
            </h1>
            <p className="text-gray-600">
              Liên kết đặt lại mật khẩu này đã hết hạn
            </p>
          </div>

          <Card hover={false} className="mb-6">
            <Alert type="warning" className="mb-6">
              <strong>Liên kết hết hạn sau 1 giờ</strong>
              <br />
              Vì lý do bảo mật, liên kết đặt lại mật khẩu chỉ có hiệu lực trong 1 giờ kể từ khi được gửi.
            </Alert>

            <p className="text-sm text-gray-600 mb-6">
              Để tiếp tục đặt lại mật khẩu, vui lòng yêu cầu một liên kết mới. 
              Liên kết mới sẽ được gửi đến email của bạn ngay lập tức.
            </p>

            <Button
              type="button"
              variant="primary"
              className="w-full mb-3"
              onClick={() => onNavigate && onNavigate('/forgot-password')}
            >
              Yêu cầu liên kết mới
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => onNavigate && onNavigate('/login')}
            >
              Quay lại đăng nhập
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Render success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-500 rounded-xl mb-4 animate-scale-in">
              <CheckCircle className="text-white" size={32} aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Đặt lại mật khẩu thành công!
            </h1>
            <p className="text-gray-600">
              Mật khẩu của bạn đã được cập nhật
            </p>
          </div>

          <Card hover={false} className="mb-6">
            <Alert type="success" className="mb-6">
              <strong>Hoàn tất!</strong>
              <br />
              Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
            </Alert>

            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                Đang chuyển hướng đến trang đăng nhập...
              </p>
              <LoadingSpinner size={24} className="mx-auto" />
            </div>

            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => onNavigate && onNavigate('/login')}
            >
              Đăng nhập ngay
            </Button>
          </Card>

          <Alert type="info">
            <strong>Mẹo bảo mật:</strong> Hãy đảm bảo bạn lưu giữ mật khẩu mới ở nơi an toàn và không chia sẻ với bất kỳ ai.
          </Alert>
        </div>
      </div>
    );
  }

  // Render reset password form (token is valid)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-xl mb-4">
            <Lock className="text-white" size={32} aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Đặt lại mật khẩu
          </h1>
          <p className="text-gray-600">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {/* Reset Password Form */}
        <Card hover={false} className="mb-6">
          {/* Error Alert */}
          {submitError && (
            <Alert type="danger" className="mb-4">
              {submitError}
            </Alert>
          )}

          {/* Security Notice */}
          <Alert type="info" className="mb-6">
            <strong>Yêu cầu bảo mật:</strong> Mật khẩu mới phải khác với mật khẩu cũ và đáp ứng tất cả các tiêu chí bên dưới.
          </Alert>

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <FormGroup
              label="Mật khẩu mới"
              error={errors.password}
              required
              id="password"
            >
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tạo mật khẩu mới"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  error={!!errors.password}
                  className="pr-12"
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <EyeOff size={20} aria-hidden="true" />
                  ) : (
                    <Eye size={20} aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength <= 25
                            ? 'bg-danger-500'
                            : passwordStrength <= 50
                              ? 'bg-warning-500'
                              : passwordStrength <= 75
                                ? 'bg-primary-500'
                                : 'bg-success-500'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {passwordStrength <= 25
                        ? 'Yếu'
                        : passwordStrength <= 50
                          ? 'Trung bình'
                          : passwordStrength <= 75
                            ? 'Khá'
                            : 'Mạnh'}
                    </span>
                  </div>

                  {/* Password Requirements Checklist */}
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {req.met ? (
                          <CheckCircle size={16} className="text-success-500" aria-hidden="true" />
                        ) : (
                          <XCircle size={16} className="text-gray-300" aria-hidden="true" />
                        )}
                        <span className={req.met ? 'text-success-700' : 'text-gray-600'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FormGroup>

            {/* Confirm Password */}
            <FormGroup
              label="Xác nhận mật khẩu mới"
              error={errors.confirmPassword}
              required
              id="confirmPassword"
            >
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                  className="pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} aria-hidden="true" />
                  ) : (
                    <Eye size={20} aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Match indicator */}
              {formData.confirmPassword && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle size={16} className="text-success-500" aria-hidden="true" />
                      <span className="text-success-700">Mật khẩu khớp</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="text-danger-500" aria-hidden="true" />
                      <span className="text-danger-700">Mật khẩu không khớp</span>
                    </>
                  )}
                </div>
              )}
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
                  Đang cập nhật...
                </>
              ) : (
                'Đặt lại mật khẩu'
              )}
            </Button>

            {/* Cancel Link */}
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/login')}
              className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors text-center"
            >
              Hủy bỏ
            </button>
          </form>
        </Card>

        {/* Security Tips */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Mẹo tạo mật khẩu mạnh:
          </h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>Sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>Tránh sử dụng thông tin cá nhân dễ đoán</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>Không sử dụng lại mật khẩu từ các tài khoản khác</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>Độ dài từ 12-16 ký tự sẽ bảo mật hơn</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
