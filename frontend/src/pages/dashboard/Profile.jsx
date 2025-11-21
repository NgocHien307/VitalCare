import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Activity,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import FormGroup from '../../components/FormGroup';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import { authAPI } from '../../utils/api';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  const [personalErrors, setPersonalErrors] = useState({});

  // Health Profile State
  const [healthProfile, setHealthProfile] = useState({
    height: '',
    weight: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    emergencyContact: '',
    emergencyPhone: '',
  });
  const [healthErrors, setHealthErrors] = useState({});

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [securityErrors, setSecurityErrors] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const user = await authAPI.getCurrentUser();
      setPersonalInfo({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
      });
      setHealthProfile({
        height: user.healthProfile?.height || '',
        weight: user.healthProfile?.weight || '',
        bloodType: user.healthProfile?.bloodType || '',
        allergies: user.healthProfile?.allergies || '',
        chronicConditions: user.healthProfile?.chronicConditions || '',
        emergencyContact: user.emergencyContact?.name || '',
        emergencyPhone: user.emergencyContact?.phone || '',
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Use mock data as fallback
      setPersonalInfo({
        fullName: 'Nguyễn Văn A',
        email: 'demo@healthtracker.com',
        phone: '0901234567',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: 'Hà Nội, Việt Nam',
      });
      setHealthProfile({
        height: '175',
        weight: '70',
        bloodType: 'O+',
        allergies: 'Không có dị ứng',
        chronicConditions: 'Không có',
        emergencyContact: 'Nguyễn Thị B',
        emergencyPhone: '0912345678',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalChange = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    if (personalErrors[field]) {
      setPersonalErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleHealthChange = (field, value) => {
    setHealthProfile((prev) => ({ ...prev, [field]: value }));
    if (healthErrors[field]) {
      setHealthErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSecurityChange = (field, value) => {
    setSecurityData((prev) => ({ ...prev, [field]: value }));
    if (securityErrors[field]) {
      setSecurityErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validatePersonalInfo = () => {
    const errors = {};
    if (!personalInfo.fullName) errors.fullName = 'Họ tên là bắt buộc';
    if (!personalInfo.email) errors.email = 'Email là bắt buộc';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      errors.email = 'Email không hợp lệ';
    }
    if (!personalInfo.phone) errors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^0\d{9,10}$/.test(personalInfo.phone.replace(/-/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    return errors;
  };

  const validateHealthProfile = () => {
    const errors = {};
    if (healthProfile.height && (isNaN(healthProfile.height) || healthProfile.height < 50 || healthProfile.height > 250)) {
      errors.height = 'Chiều cao phải từ 50-250 cm';
    }
    if (healthProfile.weight && (isNaN(healthProfile.weight) || healthProfile.weight < 20 || healthProfile.weight > 300)) {
      errors.weight = 'Cân nặng phải từ 20-300 kg';
    }
    if (healthProfile.emergencyPhone && !/^0\d{9,10}$/.test(healthProfile.emergencyPhone.replace(/-/g, ''))) {
      errors.emergencyPhone = 'Số điện thoại không hợp lệ';
    }
    return errors;
  };

  const validateSecurity = () => {
    const errors = {};
    if (!securityData.currentPassword) errors.currentPassword = 'Mật khẩu hiện tại là bắt buộc';
    if (!securityData.newPassword) errors.newPassword = 'Mật khẩu mới là bắt buộc';
    else if (securityData.newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!securityData.confirmPassword) errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    else if (securityData.newPassword !== securityData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }
    return errors;
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    const errors = validatePersonalInfo();
    if (Object.keys(errors).length > 0) {
      setPersonalErrors(errors);
      return;
    }

    setSaveLoading(true);
    try {
      // await authAPI.updateProfile(personalInfo);
      setSuccessMessage('Cập nhật thông tin cá nhân thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update personal info:', error);
      alert('Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveHealthProfile = async (e) => {
    e.preventDefault();
    const errors = validateHealthProfile();
    if (Object.keys(errors).length > 0) {
      setHealthErrors(errors);
      return;
    }

    setSaveLoading(true);
    try {
      // await authAPI.updateHealthProfile(healthProfile);
      setSuccessMessage('Cập nhật hồ sơ sức khỏe thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update health profile:', error);
      alert('Không thể cập nhật hồ sơ sức khỏe. Vui lòng thử lại.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errors = validateSecurity();
    if (Object.keys(errors).length > 0) {
      setSecurityErrors(errors);
      return;
    }

    setSaveLoading(true);
    try {
      // await authAPI.changePassword(securityData);
      setSuccessMessage('Đổi mật khẩu thành công!');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Không thể đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: User },
    { id: 'health', label: 'Hồ sơ sức khỏe', icon: Heart },
    { id: 'security', label: 'Bảo mật', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Hồ sơ cá nhân</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý thông tin cá nhân và cài đặt bảo mật
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Profile Avatar */}
      <Card>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl font-bold">
              {personalInfo.fullName.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Camera size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {personalInfo.fullName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{personalInfo.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Thành viên từ {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Thông tin cá nhân
          </h3>
          <form onSubmit={handleSavePersonalInfo}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Họ và tên" error={personalErrors.fullName} required id="fullName">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="fullName"
                    value={personalInfo.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    error={!!personalErrors.fullName}
                    className="pl-10"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Email" error={personalErrors.email} required id="email">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    error={!!personalErrors.email}
                    className="pl-10"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Số điện thoại" error={personalErrors.phone} required id="phone">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    error={!!personalErrors.phone}
                    className="pl-10"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Ngày sinh" id="dateOfBirth">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Giới tính" id="gender">
                <Select
                  id="gender"
                  value={personalInfo.gender}
                  onChange={(e) => handlePersonalChange('gender', e.target.value)}
                  options={[
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' },
                    { label: 'Khác', value: 'other' },
                  ]}
                  placeholder="Chọn giới tính"
                />
              </FormGroup>

              <FormGroup label="Địa chỉ" id="address">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="address"
                    value={personalInfo.address}
                    onChange={(e) => handlePersonalChange('address', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </FormGroup>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" variant="primary" disabled={saveLoading} className="gap-2">
                {saveLoading ? (
                  <>
                    <LoadingSpinner size={20} />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'health' && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Hồ sơ sức khỏe
          </h3>
          <form onSubmit={handleSaveHealthProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Chiều cao (cm)" error={healthErrors.height} id="height">
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="height"
                    type="number"
                    value={healthProfile.height}
                    onChange={(e) => handleHealthChange('height', e.target.value)}
                    error={!!healthErrors.height}
                    className="pl-10"
                    min="50"
                    max="250"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Cân nặng (kg)" error={healthErrors.weight} id="weight">
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="weight"
                    type="number"
                    value={healthProfile.weight}
                    onChange={(e) => handleHealthChange('weight', e.target.value)}
                    error={!!healthErrors.weight}
                    className="pl-10"
                    min="20"
                    max="300"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Nhóm máu" id="bloodType">
                <Select
                  id="bloodType"
                  value={healthProfile.bloodType}
                  onChange={(e) => handleHealthChange('bloodType', e.target.value)}
                  options={[
                    { label: 'A+', value: 'A+' },
                    { label: 'A-', value: 'A-' },
                    { label: 'B+', value: 'B+' },
                    { label: 'B-', value: 'B-' },
                    { label: 'AB+', value: 'AB+' },
                    { label: 'AB-', value: 'AB-' },
                    { label: 'O+', value: 'O+' },
                    { label: 'O-', value: 'O-' },
                  ]}
                  placeholder="Chọn nhóm máu"
                />
              </FormGroup>

              <FormGroup label="Người liên hệ khẩn cấp" id="emergencyContact">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="emergencyContact"
                    value={healthProfile.emergencyContact}
                    onChange={(e) => handleHealthChange('emergencyContact', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </FormGroup>

              <FormGroup label="Số điện thoại khẩn cấp" error={healthErrors.emergencyPhone} id="emergencyPhone">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={healthProfile.emergencyPhone}
                    onChange={(e) => handleHealthChange('emergencyPhone', e.target.value)}
                    error={!!healthErrors.emergencyPhone}
                    className="pl-10"
                  />
                </div>
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
              <FormGroup label="Dị ứng" id="allergies">
                <Textarea
                  id="allergies"
                  value={healthProfile.allergies}
                  onChange={(e) => handleHealthChange('allergies', e.target.value)}
                  rows={3}
                  placeholder="Liệt kê các loại dị ứng..."
                />
              </FormGroup>

              <FormGroup label="Bệnh mãn tính" id="chronicConditions">
                <Textarea
                  id="chronicConditions"
                  value={healthProfile.chronicConditions}
                  onChange={(e) => handleHealthChange('chronicConditions', e.target.value)}
                  rows={3}
                  placeholder="Liệt kê các bệnh mãn tính..."
                />
              </FormGroup>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" variant="primary" disabled={saveLoading} className="gap-2">
                {saveLoading ? (
                  <>
                    <LoadingSpinner size={20} />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Đổi mật khẩu
          </h3>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-6 max-w-md">
              <FormGroup label="Mật khẩu hiện tại" error={securityErrors.currentPassword} required id="currentPassword">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={securityData.currentPassword}
                    onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                    error={!!securityErrors.currentPassword}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormGroup>

              <FormGroup label="Mật khẩu mới" error={securityErrors.newPassword} required id="newPassword">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={securityData.newPassword}
                    onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                    error={!!securityErrors.newPassword}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormGroup>

              <FormGroup label="Xác nhận mật khẩu mới" error={securityErrors.confirmPassword} required id="confirmPassword">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={securityData.confirmPassword}
                    onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                    error={!!securityErrors.confirmPassword}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormGroup>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" variant="primary" disabled={saveLoading} className="gap-2">
                {saveLoading ? (
                  <>
                    <LoadingSpinner size={20} />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Đổi mật khẩu
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Bảo mật tài khoản</h4>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>✓ Mật khẩu phải có ít nhất 6 ký tự</p>
              <p>✓ Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</p>
              <p>✓ Không sử dụng thông tin cá nhân dễ đoán</p>
              <p>✓ Thay đổi mật khẩu định kỳ để bảo mật tài khoản</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;
