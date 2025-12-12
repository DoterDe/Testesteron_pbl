import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, AlertCircle, Search, Filter, LogOut, Send } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { projectId } from '../utils/supabase/info';

interface DoctorDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function DoctorDashboard({ user, accessToken, onLogout }: DoctorDashboardProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'moderate' | 'low'>('all');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [recommendations, setRecommendations] = useState('');
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const profileRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/profile`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const profileData = await profileRes.json();
      setProfile(profileData.profile);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/patients`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      
      if (response.ok) {
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRecommendations = async () => {
    if (!selectedPatient || !recommendations.trim()) {
      alert('Пожалуйста, введите рекомендации');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/recommendations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            patientId: selectedPatient.id,
            recommendations,
          }),
        }
      );

      if (response.ok) {
        alert('Рекомендации отправлены успешно');
        setRecommendations('');
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error('Error sending recommendations:', error);
      alert('Ошибка отправки рекомендаций');
    } finally {
      setSending(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'all' || patient.latestSymptom?.risk === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    if (risk === 'high') return 'var(--danger)';
    if (risk === 'moderate') return 'var(--warning)';
    return 'var(--success)';
  };

  const getRiskBadge = (risk: string) => {
    const color = getRiskColor(risk);
    const text = risk === 'high' ? 'Высокий' : risk === 'moderate' ? 'Умеренный' : 'Низкий';
    return (
      <span
        className="px-2 py-1 rounded text-xs font-semibold"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {text}
      </span>
    );
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
              Панель врача
            </h3>
            <p className="text-[var(--text-muted)]">
              Добро пожаловать, Dr. {profile?.name || user.email}
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-[var(--primary-blue)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Всего пациентов</p>
                <p className="text-2xl font-bold text-[var(--primary-navy)]">{patients.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-[var(--danger)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Высокий риск</p>
                <p className="text-2xl font-bold text-[var(--primary-navy)]">
                  {patients.filter(p => p.latestSymptom?.risk === 'high').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[var(--success)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">С анализами</p>
                <p className="text-2xl font-bold text-[var(--primary-navy)]">
                  {patients.filter(p => p.labCount > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filter */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени или email..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterRisk('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterRisk === 'all'
                    ? 'bg-[var(--primary-blue)] text-white'
                    : 'bg-gray-200 text-[var(--text-muted)] hover:bg-gray-300'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setFilterRisk('high')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterRisk === 'high'
                    ? 'bg-[var(--danger)] text-white'
                    : 'bg-gray-200 text-[var(--text-muted)] hover:bg-gray-300'
                }`}
              >
                Высокий
              </button>
              <button
                onClick={() => setFilterRisk('moderate')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterRisk === 'moderate'
                    ? 'bg-[var(--warning)] text-white'
                    : 'bg-gray-200 text-[var(--text-muted)] hover:bg-gray-300'
                }`}
              >
                Умеренный
              </button>
              <button
                onClick={() => setFilterRisk('low')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterRisk === 'low'
                    ? 'bg-[var(--success)] text-white'
                    : 'bg-gray-200 text-[var(--text-muted)] hover:bg-gray-300'
                }`}
              >
                Низкий
              </button>
            </div>
          </div>
        </div>

        {/* Patient list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="card p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-[var(--primary-navy)] mb-1 group-hover:text-[var(--primary-blue)] transition-colors">
                    {patient.name}
                  </h4>
                  <p className="text-sm text-[var(--text-muted)]">{patient.email}</p>
                </div>
                {patient.latestSymptom?.risk && getRiskBadge(patient.latestSymptom.risk)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {patient.latestLab && (
                  <>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Свободный Т</p>
                      <p className="font-semibold text-[var(--primary-navy)]">
                        {patient.latestLab.freeT} нг/дл
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Общий Т</p>
                      <p className="font-semibold text-[var(--primary-navy)]">
                        {patient.latestLab.totalT} нг/дл
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4 text-sm text-[var(--text-muted)]">
                <span>📊 {patient.labCount} анализ(ов)</span>
                <span>📋 {patient.symptomCount} опрос(ов)</span>
              </div>

              {patient.latestLab && (
                <p className="text-xs text-[var(--text-muted)] mt-3">
                  Последний анализ: {new Date(patient.latestLab.createdAt).toLocaleDateString('ru-RU')}
                </p>
              )}
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="card p-12 text-center">
            <Users className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">Пациенты не найдены</p>
          </div>
        )}
      </div>

      {/* Patient detail modal */}
      {selectedPatient && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-[var(--primary-navy)] mb-2">
                  {selectedPatient.name}
                </h2>
                <p className="text-[var(--text-muted)]">{selectedPatient.email}</p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-[var(--text-muted)] hover:text-[var(--primary-navy)]"
              >
                ✕
              </button>
            </div>

            {/* Lab results */}
            {selectedPatient.latestLab && (
              <div className="mb-6">
                <h3 className="text-[var(--primary-navy)] mb-3">
                  Последние анализы
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[var(--text-muted)]">Свободный тестостерон</p>
                    <p className="text-xl font-semibold text-[var(--primary-navy)]">
                      {selectedPatient.latestLab.freeT} нг/дл
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[var(--text-muted)]">Общий тестостерон</p>
                    <p className="text-xl font-semibold text-[var(--primary-navy)]">
                      {selectedPatient.latestLab.totalT} нг/дл
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[var(--text-muted)]">ЛГ</p>
                    <p className="text-xl font-semibold text-[var(--primary-navy)]">
                      {selectedPatient.latestLab.lh} мМЕ/мл
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[var(--text-muted)]">Витамин D</p>
                    <p className="text-xl font-semibold text-[var(--primary-navy)]">
                      {selectedPatient.latestLab.vitaminD} нг/мл
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Symptoms */}
            {selectedPatient.latestSymptom && (
              <div className="mb-6">
                <h3 className="text-[var(--primary-navy)] mb-3">
                  Оценка симптомов
                </h3>
                <div
                  className="p-4 rounded-lg border-2 mb-4"
                  style={{
                    borderColor: getRiskColor(selectedPatient.latestSymptom.risk),
                    backgroundColor: `${getRiskColor(selectedPatient.latestSymptom.risk)}15`,
                  }}
                >
                  <p className="font-semibold mb-1">
                    Риск: {selectedPatient.latestSymptom.riskText}
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                    <div>
                      <p className="text-[var(--text-muted)]">Сон</p>
                      <p className="font-semibold">{selectedPatient.latestSymptom.sleepQuality}/10</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Стресс</p>
                      <p className="font-semibold">{selectedPatient.latestSymptom.stressLevel}/10</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">ИМТ</p>
                      <p className="font-semibold">{selectedPatient.latestSymptom.bmi.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h3 className="text-[var(--primary-navy)] mb-3">
                Отправить рекомендации
              </h3>
              <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                placeholder="Введите рекомендации для пациента..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent resize-none"
                rows={6}
              />
              <button
                onClick={handleSendRecommendations}
                disabled={sending || !recommendations.trim()}
                className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Отправка...' : 'Отправить рекомендации'}
                <Send className="inline-block w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
