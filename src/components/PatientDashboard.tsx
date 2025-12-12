import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, Moon, AlertCircle, Plus, FileText, LogOut } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tooltip } from './Tooltip';
import { projectId } from '../utils/supabase/info';

interface PatientDashboardProps {
  user: any;
  accessToken: string;
  onNavigate: (module: string) => void;
  onLogout: () => void;
}

export function PatientDashboard({ user, accessToken, onNavigate, onLogout }: PatientDashboardProps) {
  const [labResults, setLabResults] = useState<any[]>([]);
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch profile
      const profileRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/profile`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const profileData = await profileRes.json();
      setProfile(profileData.profile);

      // Fetch lab results
      const labRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/lab-results`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const labData = await labRes.json();
      setLabResults(labData.labResults || []);

      // Fetch symptoms
      const symptomsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/symptoms`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const symptomsData = await symptomsRes.json();
      setSymptoms(symptomsData.symptoms || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLatestLab = () => {
    if (labResults.length === 0) return null;
    return labResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  };

  const getLatestSymptom = () => {
    if (symptoms.length === 0) return null;
    return symptoms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  };

  const formatChartData = () => {
    return labResults
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((lab) => ({
        date: new Date(lab.createdAt).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
        freeT: lab.freeT,
        totalT: lab.totalT,
      }));
  };

  const formatSymptomChart = () => {
    return symptoms
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((symptom) => ({
        date: new Date(symptom.createdAt).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
        sleep: symptom.sleepQuality,
        stress: symptom.stressLevel,
        bmi: symptom.bmi,
      }));
  };

  const latestLab = getLatestLab();
  const latestSymptom = getLatestSymptom();

  const getFreeTStatus = (freeT: number) => {
    if (freeT < 5) return { color: 'var(--danger)', text: 'Низкий' };
    if (freeT < 10) return { color: 'var(--warning)', text: 'Ниже оптимального' };
    return { color: 'var(--success)', text: 'Норма' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-muted)]">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-light)]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-[var(--primary-navy)]">
              Панель пациента
            </h3>
            <p className="text-[var(--text-muted)]">
              Добро пожаловать, {profile?.name || user.email}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => onNavigate('symptoms')}
            className="card p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Activity className="w-6 h-6 text-[var(--primary-blue)]" />
              </div>
              <Plus className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <h4 className="text-[var(--primary-navy)] mb-2">Пройти опрос</h4>
            <p className="text-sm text-[var(--text-muted)]">
              Заполните анкету симптомов
            </p>
          </button>

          <button
            onClick={() => onNavigate('lab')}
            className="card p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-[var(--success)]" />
              </div>
              <Plus className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <h4 className="text-[var(--primary-navy)] mb-2">Добавить анализы</h4>
            <p className="text-sm text-[var(--text-muted)]">
              Загрузите лабораторные данные
            </p>
          </button>

          <button
            onClick={() => onNavigate('report')}
            className="card p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h4 className="text-[var(--primary-navy)] mb-2">Просмотреть отчёты</h4>
            <p className="text-sm text-[var(--text-muted)]">
              Экспорт и анализ данных
            </p>
          </button>
        </div>

        {/* Additional resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => onNavigate('education')}
            className="card p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[var(--primary-navy)] mb-1">Обучающие материалы</h4>
                <p className="text-sm text-[var(--text-muted)]">
                  Видео, статьи, FAQ
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('compliance')}
            className="card p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[var(--primary-navy)] mb-1">Безопасность и соответствие</h4>
                <p className="text-sm text-[var(--text-muted)]">
                  HIPAA, GDPR, ISO стандарты
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Key metrics */}
        {latestLab && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[var(--text-muted)]">Свободный тестостерон</h4>
                <Tooltip content="Биоло��ически активная форма тестостерона. Наиболее важный показатель для оценки гормонального статуса." />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[var(--primary-navy)]">
                  {latestLab.freeT}
                </span>
                <span className="text-[var(--text-muted)] mb-1">нг/дл</span>
              </div>
              <div className="mt-2">
                <span
                  className="text-sm font-semibold px-2 py-1 rounded"
                  style={{
                    backgroundColor: `${getFreeTStatus(latestLab.freeT).color}15`,
                    color: getFreeTStatus(latestLab.freeT).color,
                  }}
                >
                  {getFreeTStatus(latestLab.freeT).text}
                </span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[var(--text-muted)]">ЛГ</h4>
                <Tooltip content="Лютеинизирующий гормон стимулирует выработку тестостерона. Высокий ЛГ при низком Т указывает на первичный гипогонадизм." />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[var(--primary-navy)]">
                  {latestLab.lh}
                </span>
                <span className="text-[var(--text-muted)] mb-1">мМЕ/мл</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">Норма: 1.7-8.6</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[var(--text-muted)]">Витамин D</h4>
                <Tooltip content="Дефицит витамина D связан с низким тестостероном. Оптимальный уровень 40-60 нг/мл." />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[var(--primary-navy)]">
                  {latestLab.vitaminD}
                </span>
                <span className="text-[var(--text-muted)] mb-1">нг/мл</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">Норма: 30-100</p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Testosterone trend */}
          {labResults.length > 0 && (
            <div className="card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[var(--primary-navy)]">
                  Динамика тестостерона
                </h3>
                <Tooltip content="График показывает изменение уровня общего и свободного тестостерона во времени" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="freeT"
                    stroke="var(--success)"
                    strokeWidth={2}
                    name="Свободный Т (нг/дл)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalT"
                    stroke="var(--primary-blue)"
                    strokeWidth={2}
                    name="Общий Т (нг/дл)"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Lifestyle factors */}
          {symptoms.length > 0 && (
            <div className="card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[var(--primary-navy)]">
                  Факторы образа жизни
                </h3>
                <Tooltip content="Сон, стресс и ИМТ влияют на уровень тестостерона" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatSymptomChart()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="sleep" fill="var(--primary-blue)" name="Качество сна" />
                  <Bar dataKey="stress" fill="var(--warning)" name="Уровень стресса" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Risk assessment */}
        {latestSymptom && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle
                className="w-6 h-6"
                style={{
                  color:
                    latestSymptom.risk === 'low'
                      ? 'var(--success)'
                      : latestSymptom.risk === 'moderate'
                      ? 'var(--warning)'
                      : 'var(--danger)',
                }}
              />
              <h3 className="text-[var(--primary-navy)]">
                Оценка риска
              </h3>
            </div>
            <div
              className="p-4 rounded-lg border-2"
              style={{
                borderColor:
                  latestSymptom.risk === 'low'
                    ? 'var(--success)'
                    : latestSymptom.risk === 'moderate'
                    ? 'var(--warning)'
                    : 'var(--danger)',
                backgroundColor:
                  latestSymptom.risk === 'low'
                    ? 'var(--success)15'
                    : latestSymptom.risk === 'moderate'
                    ? 'var(--warning)15'
                    : 'var(--danger)15',
              }}
            >
              <p className="font-semibold mb-2">{latestSymptom.riskText}</p>
              <p className="text-sm text-[var(--text-muted)]">
                На основе опросника ADAM, качества сна, ИМТ и уровня физической активности.
                Для точной диагностики необходимы лабораторные анализы.
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {labResults.length === 0 && symptoms.length === 0 && (
          <div className="card p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-[var(--primary-blue)]" />
            </div>
            <h3 className="text-[var(--primary-navy)] mb-2">
              Начните диагностику
            </h3>
            <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
              Пройдите опрос симптомов и загрузите лабораторные анализы, чтобы получить персонализированные рекомендации
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => onNavigate('symptoms')} className="btn-primary">
                Начать опрос
              </button>
              <button onClick={() => onNavigate('lab')} className="btn-secondary text-[var(--primary-navy)] border-[var(--primary-navy)]">
                Загрузить анализы
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}