import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import FormGroup from '../components/FormGroup';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressRing from '../components/ProgressRing';
import Card from '../components/Card';

const Register = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1 = Basic Info, 2 = Health Profile
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

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

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Vietnamese phone format: 0xxx-xxx-xxx or 0xxxxxxxxx
    return /^0\d{9,10}$/.test(phone.replace(/-/g, ''));
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 3 ký tự';
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

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

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    } else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = 'Bạn phải ít nhất 13 tuổi';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Ngày sinh không hợp lệ';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Vui lòng chọn giới tính';
    }

    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx)';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản dịch vụ';
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
    if (registerError) {
      setRegisterError('');
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);
    setRegisterError('');

    try {
      // Mock API call - replace with actual registration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful registration
      Alert.success = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...';
      
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('/login');
        }
      }, 1500);
    } catch (error) {
      setRegisterError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo & App Name */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-xl mb-4">
            <User className="text-white" size={32} aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-600">Đăng ký để bắt đầu theo dõi sức khỏe</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep >= 1
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                Thông tin cơ bản
              </span>
            </div>

            {/* Divider */}
            <div className={`h-1 w-20 ${currentStep >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`} />

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep >= 2
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                Hoàn tất
              </span>
            </div>
          </div>
        </div>

        {/* Register Card */}
        <Card hover={false} className="mb-6">
          {/* Error Alert */}
          {registerError && (
            <Alert type="danger" className="mb-4">
              {registerError}
            </Alert>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Bước 1: Thông tin cơ bản
              </h2>

              {/* Full Name */}
              <FormGroup
                label="Họ và tên"
                error={errors.fullName}
                required
                id="fullName"
              >
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    error={!!errors.fullName}
                    className="pl-10"
                    autoComplete="name"
                  />
                </div>
              </FormGroup>

              {/* Email */}
              <FormGroup
                label="Email"
                error={errors.email}
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
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={!!errors.email}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </FormGroup>

              {/* Password */}
              <FormGroup
                label="Mật khẩu"
                error={errors.password}
                required
                id="password"
              >
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tạo mật khẩu mạnh"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    error={!!errors.password}
                    className="pr-12"
                    autoComplete="new-password"
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
                label="Xác nhận mật khẩu"
                error={errors.confirmPassword}
                required
                id="confirmPassword"
              >
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
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
              </FormGroup>

              {/* Date of Birth */}
              <FormGroup
                label="Ngày sinh"
                error={errors.dateOfBirth}
                required
                id="dateOfBirth"
              >
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    error={!!errors.dateOfBirth}
                    className="pl-10"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </FormGroup>

              {/* Gender */}
              <FormGroup
                label="Giới tính"
                error={errors.gender}
                required
                id="gender"
              >
                <Select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  options={[
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' },
                    { label: 'Khác', value: 'other' },
                  ]}
                  placeholder="Chọn giới tính"
                />
              </FormGroup>

              {/* Phone Number */}
              <FormGroup
                label="Số điện thoại"
                error={errors.phone}
                helper="Định dạng: 0xxxxxxxxx"
                required
                id="phone"
              >
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912345678"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={!!errors.phone}
                    className="pl-10"
                    autoComplete="tel"
                  />
                </div>
              </FormGroup>

              {/* Terms & Conditions */}
              <div className="mb-6">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                  label={
                    <span className="text-sm text-gray-600">
                      Tôi đồng ý với{' '}
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Điều khoản dịch vụ
                      </button>{' '}
                      và{' '}
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Chính sách bảo mật
                      </button>
                    </span>
                  }
                />
                {errors.agreeTerms && (
                  <p className="text-sm text-danger-500 mt-1" role="alert">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Next Button */}
              <Button type="submit" variant="primary" className="w-full">
                Tiếp tục
              </Button>
            </form>
          )}

          {/* Step 2: Confirmation */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Bước 2: Xác nhận thông tin
              </h2>

              <Alert type="success" className="mb-6">
                <strong>Thông tin của bạn đã được xác thực!</strong>
                <br />
                Vui lòng xem lại thông tin trước khi hoàn tất đăng ký.
              </Alert>

              {/* Summary of entered information */}
              <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Họ và tên:</span>
                  <span className="font-medium text-gray-800">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày sinh:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(formData.dateOfBirth).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giới tính:</span>
                  <span className="font-medium text-gray-800">
                    {formData.gender === 'male' ? 'Nam' : formData.gender === 'female' ? 'Nữ' : 'Khác'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium text-gray-800">{formData.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  Quay lại
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size={20} className="mr-2" />
                      Đang đăng ký...
                    </>
                  ) : (
                    'Hoàn tất đăng ký'
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <button
            onClick={() => onNavigate && onNavigate('/login')}
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
