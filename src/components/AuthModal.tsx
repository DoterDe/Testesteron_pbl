import { useState } from 'react';
import { X, Eye, EyeOff, Check, AlertCircle, Shield, Smartphone, QrCode } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaMethod, setMfaMethod] = useState<'sms' | 'authenticator'>('sms');
  const [formError, setFormError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  if (!isOpen) return null;

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z\d]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setFormError('Пароли не совпадают');
        return;
      }
      if (passwordStrength < 75) {
        setFormError('Пароль недостаточно надежный');
        return;
      }
    }

    // Here you would handle actual authentication
    console.log('Auth submitted:', { mode, role, formData, mfaEnabled, mfaMethod });
    onClose();
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-[#E74C3C]';
    if (passwordStrength < 75) return 'bg-[#F39C12]';
    return 'bg-[#27AE60]';
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return 'Слабый';
    if (passwordStrength < 75) return 'Средний';
    return 'Надежный';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl frosted-glass shadow-2xl slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 smooth-transition"
        >
          <X size={20} />
        </button>

        {/* Mode Toggle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg smooth-transition ${
                mode === 'login' ? 'gradient-blue text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg smooth-transition ${
                mode === 'signup' ? 'gradient-blue text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Регистрация
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Role Selection (Only for Signup) */}
          {mode === 'signup' && (
            <div>
              <label className="block mb-2 text-sm text-gray-700">Выберите роль</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`p-4 rounded-xl border-2 smooth-transition ${
                    role === 'patient'
                      ? 'border-[#3C8CE7] bg-[#3C8CE7]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">👤</div>
                    <div className="text-sm">Пациент</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`p-4 rounded-xl border-2 smooth-transition ${
                    role === 'doctor'
                      ? 'border-[#3C8CE7] bg-[#3C8CE7]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">👨‍⚕️</div>
                    <div className="text-sm">Врач</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Full Name (Only for Signup) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block mb-2 text-sm text-gray-700">
                Полное имя
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F7] border border-transparent smooth-transition focus:border-[#3C8CE7] focus:ring-2 focus:ring-[#3C8CE7]/20 outline-none"
                placeholder="Иван Иванов"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F5F7] border border-transparent smooth-transition focus:border-[#3C8CE7] focus:ring-2 focus:ring-[#3C8CE7]/20 outline-none"
              placeholder="example@email.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm text-gray-700">
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F5F5F7] border border-transparent smooth-transition focus:border-[#3C8CE7] focus:ring-2 focus:ring-[#3C8CE7]/20 outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 smooth-transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Meter (Only for Signup) */}
            {mode === 'signup' && formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Надежность пароля</span>
                  <span className={`text-xs ${passwordStrength >= 75 ? 'text-[#27AE60]' : passwordStrength >= 50 ? 'text-[#F39C12]' : 'text-[#E74C3C]'}`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full smooth-transition ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Мин. 8 символов, заглавные и строчные буквы, цифры и спецсимволы
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (Only for Signup) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm text-gray-700">
                Подтвердите пароль
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F5F5F7] border border-transparent smooth-transition focus:border-[#3C8CE7] focus:ring-2 focus:ring-[#3C8CE7]/20 outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 smooth-transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* MFA Toggle (Only for Signup) */}
          {mode === 'signup' && (
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="text-[#3C8CE7] mt-0.5" size={20} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Двухфакторная аутентификация</span>
                    <button
                      type="button"
                      onClick={() => setMfaEnabled(!mfaEnabled)}
                      className={`relative w-12 h-6 rounded-full smooth-transition ${
                        mfaEnabled ? 'bg-[#27AE60]' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full smooth-transition ${
                          mfaEnabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {mfaEnabled && (
                    <div className="space-y-2 fade-in">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setMfaMethod('sms')}
                          className={`flex-1 flex items-center gap-2 p-2 rounded-lg smooth-transition ${
                            mfaMethod === 'sms'
                              ? 'bg-[#3C8CE7] text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Smartphone size={16} />
                          <span className="text-xs">SMS</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMfaMethod('authenticator')}
                          className={`flex-1 flex items-center gap-2 p-2 rounded-lg smooth-transition ${
                            mfaMethod === 'authenticator'
                              ? 'bg-[#3C8CE7] text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <QrCode size={16} />
                          <span className="text-xs">App</span>
                        </button>
                      </div>

                      {mfaMethod === 'authenticator' && (
                        <div className="p-3 bg-white rounded-lg text-center fade-in">
                          <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                            <QrCode size={64} className="text-gray-400" />
                          </div>
                          <div className="text-xs text-gray-600">Сканируйте QR-код в приложении</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Remember Me / Forgot Password (Only for Login) */}
          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#3C8CE7] focus:ring-[#3C8CE7]" />
                <span className="text-sm text-gray-700">Запомнить меня</span>
              </label>
              <button type="button" className="text-sm text-[#3C8CE7] hover:underline">
                Забыли пароль?
              </button>
            </div>
          )}

          {/* Error Message */}
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm shake">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl text-white shadow-lg smooth-transition hover-scale ${
              mode === 'signup' ? 'gradient-success' : 'gradient-blue'
            }`}
          >
            {mode === 'signup' ? 'Создать аккаунт' : 'Войти'}
          </button>

          {/* Switch Mode */}
          <div className="text-center text-sm text-gray-600">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[#3C8CE7] hover:underline"
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
