import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { projectId } from '../utils/supabase/info';

interface LabModuleProps {
  accessToken: string;
  onComplete: () => void;
  onBack: () => void;
}

interface LabValues {
  totalT: string;
  shbg: string;
  albumin: string;
  lh: string;
  fsh: string;
  prolactin: string;
  vitaminD: string;
  homaIr: string;
  testDate: string;
  testTime: string;
}

export function LabModule({ accessToken, onComplete, onBack }: LabModuleProps) {
  const [loading, setLoading] = useState(false);
  const [calculatedFreeT, setCalculatedFreeT] = useState<number | null>(null);
  const [values, setValues] = useState<LabValues>({
    totalT: '',
    shbg: '',
    albumin: '4.3',
    lh: '',
    fsh: '',
    prolactin: '',
    vitaminD: '',
    homaIr: '',
    testDate: new Date().toISOString().split('T')[0],
    testTime: '08:00',
  });

  const labFields = [
    { key: 'totalT', label: 'Общий тестостерон', unit: 'нг/дл', normal: '300-1000', tooltip: 'Измеряется утром натощак. Пик выработки в 6-8 утра.' },
    { key: 'shbg', label: 'SHBG (глобулин)', unit: 'нмоль/л', normal: '18-54', tooltip: 'Белок, связывающий тестостерон. Высокий SHBG снижает свободный тестостерон.' },
    { key: 'albumin', label: 'Альбумин', unit: 'г/дл', normal: '3.5-5.5', tooltip: 'Другой белок-переносчик. По умолчанию 4.3 г/дл.' },
    { key: 'lh', label: 'ЛГ (лютеинизирующий гормон)', unit: 'мМЕ/мл', normal: '1.7-8.6', tooltip: 'Стимулирует выработку тестостерона. Высокий ЛГ при низком Т = первичный гипогонадизм.' },
    { key: 'fsh', label: 'ФСГ (фолликулостимулирующий)', unit: 'мМЕ/мл', normal: '1.5-12.4', tooltip: 'Регулирует сперматогенез. Помогает диагностировать причину низкого Т.' },
    { key: 'prolactin', label: 'Пролактин', unit: 'нг/мл', normal: '4-15', tooltip: 'Высокий пролактин подавляет тестостерон и либидо.' },
    { key: 'vitaminD', label: 'Витамин D', unit: 'нг/мл', normal: '30-100', tooltip: 'Дефицит витамина D связан с низким тестостероном.' },
    { key: 'homaIr', label: 'HOMA-IR (инсулинорезистентность)', unit: '', normal: '<2.5', tooltip: 'Инсулинорезистентность снижает тестостерон и повышает эстроген.' },
  ];

  const getStatus = (key: string, value: string) => {
    if (!value) return null;
    const num = parseFloat(value);
    
    const ranges: Record<string, [number, number]> = {
      totalT: [300, 1000],
      shbg: [18, 54],
      albumin: [3.5, 5.5],
      lh: [1.7, 8.6],
      fsh: [1.5, 12.4],
      prolactin: [4, 15],
      vitaminD: [30, 100],
      homaIr: [0, 2.5],
    };
    
    const [min, max] = ranges[key] || [0, 0];
    
    if (num < min) return { status: 'low', color: 'var(--warning)', text: 'Ниже нормы' };
    if (num > max) return { status: 'high', color: 'var(--danger)', text: 'Выше нормы' };
    return { status: 'normal', color: 'var(--success)', text: 'Норма' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/lab-results`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            totalT: parseFloat(values.totalT),
            shbg: parseFloat(values.shbg),
            albumin: parseFloat(values.albumin),
            lh: parseFloat(values.lh),
            fsh: parseFloat(values.fsh),
            prolactin: parseFloat(values.prolactin),
            vitaminD: parseFloat(values.vitaminD),
            homaIr: parseFloat(values.homaIr),
            testDate: values.testDate,
            testTime: values.testTime,
          }),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save lab results');
      }
      
      setCalculatedFreeT(data.freeT);
      
      // Show success message for a moment before completing
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Error saving lab results:', error);
      alert('Ошибка сохранения данных. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-light)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 animate-fade-in">
          <div className="mb-8">
            <h2 className="text-[var(--primary-navy)] mb-2">
              Лабораторные анализы
            </h2>
            <p className="text-[var(--text-muted)]">
              Введите результаты ваших анализов. Свободный тестостерон будет рассчитан автоматически по формуле Vermeulen.
            </p>
          </div>

          {/* Time of test info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 font-semibold">Важно: время сдачи анализа</p>
              <p className="text-blue-800 text-sm mt-1">
                Тестостерон следует измерять утром (7-11 утра) натощак, так как уровень гормона колеблется в течение дня.
                Вечером тестостерон может быть на 20-30% ниже.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm text-[var(--text-dark)]">
                  Дата анализа
                </label>
                <input
                  type="date"
                  value={values.testDate}
                  onChange={(e) => setValues({ ...values, testDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm text-[var(--text-dark)]">
                  Время анализа
                </label>
                <input
                  type="time"
                  value={values.testTime}
                  onChange={(e) => setValues({ ...values, testTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Lab values */}
            {labFields.map((field) => {
              const status = getStatus(field.key, values[field.key as keyof LabValues]);
              
              return (
                <div key={field.key} className="animate-slide-in">
                  <label className="block mb-2 text-sm text-[var(--text-dark)] flex items-center gap-2">
                    {field.label}
                    <span className="text-[var(--text-muted)]">({field.unit})</span>
                    <Tooltip content={field.tooltip} />
                    <span className="text-xs text-[var(--text-muted)] ml-auto">
                      Норма: {field.normal}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={values[field.key as keyof LabValues]}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent ${
                        status ? 'pr-32' : ''
                      }`}
                      placeholder={`Введите ${field.label.toLowerCase()}`}
                      required
                    />
                    {status && (
                      <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                        style={{ backgroundColor: `${status.color}15`, color: status.color }}
                      >
                        {status.status === 'normal' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {status.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Calculated free testosterone */}
            {calculatedFreeT !== null && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-green-900">
                    Расчёт завершён
                  </h3>
                </div>
                <p className="text-green-800">
                  Свободный тестостерон (по Vermeulen): <span className="font-bold text-xl">{calculatedFreeT} нг/дл</span>
                </p>
                <p className="text-sm text-green-700 mt-2">
                  Норма: 5-15 нг/дл (зависит от возраста)
                </p>
              </div>
            )}

            {/* Submit buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-[var(--text-muted)] rounded-lg hover:border-[var(--primary-blue)] hover:text-[var(--primary-blue)] transition-all"
              >
                Вернуться в меню
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Сохранение...' : 'Сохранить результаты'}
                <Save className="inline-block w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
