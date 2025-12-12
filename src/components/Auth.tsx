import React, { useState } from 'react';
import { User, Lock, Mail, Shield } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Tooltip } from './Tooltip';

interface AuthProps {
  onAuthSuccess: (user: any, role: string) => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        // Fetch user profile to get role
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/profile`,
          {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          }
        );

        const profileData = await response.json();
        
        if (response.ok) {
          onAuthSuccess(data.user, profileData.profile.role);
        } else {
          setError('Failed to fetch user profile');
        }
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          setError('Пароли не совпадают');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Пароль должен содержать минимум 6 символов');
          setLoading(false);
          return;
        }

        // Register via server
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              name: formData.name,
              role,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Ошибка регистрации');
          setLoading(false);
          return;
        }

        // Auto login after signup
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginError) {
          setError('Регистрация успешна, но не удалось войти. Попробуйте войти вручную.');
          setLoading(false);
          return;
        }

        onAuthSuccess(loginData.user, role);
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-blue)] flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-[var(--primary-blue)] bg-opacity-10 rounded-full mb-4">
            <Shield className="w-12 h-12 text-[var(--primary-blue)]" />
          </div>
          <h2 className="text-[var(--primary-navy)] mb-2">
            {isLogin ? 'Вход в систему' : 'Регистрация'}
          </h2>
          <p className="text-[var(--text-muted)]">
            {isLogin ? 'Войдите для доступа к платформе' : 'Создайте аккаунт для начала работы'}
          </p>
        </div>

        {!isLogin && (
          <div className="mb-6">
            <label className="block mb-2 text-sm text-[var(--text-dark)] flex items-center gap-2">
              Выберите роль
              <Tooltip content="Пациенты могут проходить диагностику, врачи могут просматривать данные пациентов и давать рекомендации" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === 'patient'
                    ? 'border-[var(--success)] bg-[var(--success)] bg-opacity-10'
                    : 'border-gray-300 hover:border-[var(--success)]'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-1 text-[var(--success)]" />
                <p className="text-sm">Пациент</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === 'doctor'
                    ? 'border-[var(--primary-blue)] bg-[var(--primary-blue)] bg-opacity-10'
                    : 'border-gray-300 hover:border-[var(--primary-blue)]'
                }`}
              >
                <Shield className="w-6 h-6 mx-auto mb-1 text-[var(--primary-blue)]" />
                <p className="text-sm">Врач</p>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-2 text-sm text-[var(--text-dark)]">Имя</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm text-[var(--text-dark)]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
                placeholder="example@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-[var(--text-dark)]">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block mb-2 text-sm text-[var(--text-dark)]">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-[var(--primary-blue)] hover:underline"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
          </button>
        </div>
      </div>
    </div>
  );
}
