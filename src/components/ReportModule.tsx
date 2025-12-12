import React, { useEffect, useState } from 'react';
import { Download, FileText, Mail, Printer, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Tooltip } from './Tooltip';
import { projectId } from '../utils/supabase/info';

interface ReportModuleProps {
  accessToken: string;
  onBack: () => void;
}

export function ReportModule({ accessToken, onBack }: ReportModuleProps) {
  const [labResults, setLabResults] = useState<any[]>([]);
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const labRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/lab-results`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const labData = await labRes.json();
      setLabResults(labData.labResults || []);

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

  const formatChartData = () => {
    return labResults
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((lab) => ({
        date: new Date(lab.createdAt).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
        freeT: lab.freeT,
        totalT: lab.totalT,
        lh: lab.lh,
        vitaminD: lab.vitaminD,
      }));
  };

  const formatSymptomRadar = () => {
    if (symptoms.length === 0) return [];
    const latest = symptoms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    
    return [
      { category: 'Сон', value: (latest.sleepQuality / 10) * 100, fullMark: 100 },
      { category: 'Энергия', value: ((5 - (latest.energyDecrease || 3)) / 5) * 100, fullMark: 100 },
      { category: 'Либидо', value: ((5 - (latest.libidoDecrease || 3)) / 5) * 100, fullMark: 100 },
      { category: 'Настроение', value: ((5 - (latest.sadness || 3)) / 5) * 100, fullMark: 100 },
      { category: 'Физ. сила', value: ((5 - (latest.strengthDecrease || 3)) / 5) * 100, fullMark: 100 },
    ];
  };

  const getLatestLab = () => {
    if (labResults.length === 0) return null;
    return labResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    // In a real implementation, this would generate and download the file
    alert(`Экспорт в формате ${format.toUpperCase()} будет доступен в следующей версии. Данные будут включать все лабораторные результаты, симптомы и рекомендации.`);
  };

  const latestLab = getLatestLab();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-muted)]">Формирование отчёта...</p>
        </div>
      </div>
    );
  }

  if (labResults.length === 0 && symptoms.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-light)] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-12 text-center">
            <FileText className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h2 className="text-[var(--primary-navy)] mb-3">
              Нет данных для отчёта
            </h2>
            <p className="text-[var(--text-muted)] mb-6">
              Пройдите опрос симптомов и загрузите лабораторные анализы
            </p>
            <button onClick={onBack} className="btn-primary">
              Вернуться в панель
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-light)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with export options */}
        <div className="card p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-[var(--primary-navy)] mb-2">
                Медицинский отчёт
              </h1>
              <p className="text-[var(--text-muted)]">
                Сформирован {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--danger)] text-white rounded-xl hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                Экспорт PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--success)] text-white rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                Экспорт CSV
              </button>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        {latestLab && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm text-[var(--text-muted)]">Свободный Т</h4>
                <Tooltip content="Биологически активная форма тестостерона" />
              </div>
              <p className="text-3xl font-bold text-[var(--primary-navy)] mb-2">
                {latestLab.freeT}
              </p>
              <p className="text-sm text-[var(--text-muted)]">нг/дл</p>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--success)] to-[var(--primary-blue)] transition-all duration-1000"
                  style={{ width: `${Math.min((latestLab.freeT / 15) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm text-[var(--text-muted)]">Общий Т</h4>
                <Tooltip content="Сумма всех форм тестостерона" />
              </div>
              <p className="text-3xl font-bold text-[var(--primary-navy)] mb-2">
                {latestLab.totalT}
              </p>
              <p className="text-sm text-[var(--text-muted)]">нг/дл</p>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-navy)] transition-all duration-1000"
                  style={{ width: `${Math.min((latestLab.totalT / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm text-[var(--text-muted)]">ЛГ</h4>
                <Tooltip content="Лютеинизирующий гормон" />
              </div>
              <p className="text-3xl font-bold text-[var(--primary-navy)] mb-2">
                {latestLab.lh}
              </p>
              <p className="text-sm text-[var(--text-muted)]">мМЕ/мл</p>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--warning)] to-[var(--danger)] transition-all duration-1000"
                  style={{ width: `${Math.min((latestLab.lh / 8.6) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm text-[var(--text-muted)]">Витамин D</h4>
                <Tooltip content="Дефицит связан с низким Т" />
              </div>
              <p className="text-3xl font-bold text-[var(--primary-navy)] mb-2">
                {latestLab.vitaminD}
              </p>
              <p className="text-sm text-[var(--text-muted)]">нг/мл</p>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                  style={{ width: `${Math.min((latestLab.vitaminD / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Testosterone trend */}
          {labResults.length > 0 && (
            <div className="card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[var(--primary-navy)] mb-1">
                    Динамика тестостерона
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Изменение во времени
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-[var(--success)]" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#7F8C8D" />
                  <YAxis stroke="#7F8C8D" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="freeT"
                    stroke="var(--success)"
                    strokeWidth={3}
                    name="Свободный Т (нг/дл)"
                    dot={{ r: 5, fill: 'var(--success)' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalT"
                    stroke="var(--primary-blue)"
                    strokeWidth={3}
                    name="Общий Т (нг/дл)"
                    dot={{ r: 5, fill: 'var(--primary-blue)' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Hormones comparison */}
          {labResults.length > 0 && (
            <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[var(--primary-navy)] mb-1">
                    Гормональная панель
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Сравнение показателей
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#7F8C8D" />
                  <YAxis stroke="#7F8C8D" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="lh" fill="var(--warning)" name="ЛГ (мМЕ/мл)" />
                  <Bar dataKey="vitaminD" fill="var(--primary-blue)" name="Витамин D (нг/мл)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Symptom radar chart */}
        {symptoms.length > 0 && (
          <div className="card p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[var(--primary-navy)] mb-1">
                  Профиль симптомов
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Радарная диаграмма оценки самочувствия
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={formatSymptomRadar()}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="category" stroke="#7F8C8D" />
                <PolarRadiusAxis stroke="#7F8C8D" />
                <Radar
                  name="Уровень"
                  dataKey="value"
                  stroke="var(--primary-blue)"
                  fill="var(--primary-blue)"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Clinical interpretation */}
        {latestLab && (
          <div className="card p-8 mb-8 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <AlertCircle className="w-8 h-8 text-[var(--primary-blue)]" />
              </div>
              <div className="flex-1">
                <h2 className="text-[var(--primary-navy)] mb-4">
                  Клиническая интерпретация
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-[var(--primary-navy)] mb-2">
                      Уровень тестостерона
                    </h4>
                    <p className="text-[var(--text-dark)]">
                      {latestLab.freeT < 5
                        ? '⚠️ Свободный тестостерон ниже нормы. Рекомендуется консультация эндокринолога для оценки необходимости дообследования и возможной терапии.'
                        : latestLab.freeT < 10
                        ? '⚠️ Свободный тестостерон в нижней границе нормы. Рекомендуется коррекция образа жизни: улучшение сна, снижение стресса, регулярные тренировки.'
                        : '✅ Свободный тестостерон в пределах нормы. Продолжайте здоровый образ жизни.'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-[var(--primary-navy)] mb-2">
                      Рекомендации по образу жизни
                    </h4>
                    <ul className="text-[var(--text-dark)] space-y-2">
                      <li>• Сон: 7-9 часов, засыпать до 23:00</li>
                      <li>• Тренировки: силовые 3-4 раза в неделю, избегать перетренированности</li>
                      <li>• Питание: достаточно белка, здоровых жиров, цинка (мясо, орехи, морепродукты)</li>
                      <li>• Стресс: практики релаксации, медитация, избегать хронического стресса</li>
                      <li>• Витамин D: при дефиците — добавки 2000-4000 МЕ/день</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900">
                      <strong>Важно:</strong> Данный отчёт носит информационный характер и не заменяет консультацию врача.
                      Для постановки диагноза и назначения лечения обратитесь к квалифицированному эндокринологу.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-8 py-4 border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] rounded-xl hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-300 font-semibold"
          >
            Вернуться в панель
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-8 py-4 bg-[var(--primary-blue)] text-white rounded-xl hover:bg-[var(--primary-navy)] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            <Download className="inline-block w-5 h-5 mr-2" />
            Скачать полный отчёт
          </button>
        </div>
      </div>
    </div>
  );
}
