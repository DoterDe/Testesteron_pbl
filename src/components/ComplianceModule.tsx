import React, { useState } from 'react';
import { Shield, CheckCircle, FileText, Lock, Globe, Award } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface ComplianceModuleProps {
  onBack: () => void;
}

export function ComplianceModule({ onBack }: ComplianceModuleProps) {
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);

  const standards = [
    {
      id: 'samd',
      icon: Shield,
      title: 'SaMD / CDS',
      subtitle: 'Software as Medical Device',
      description: 'Классификация как Clinical Decision Support (CDS) система',
      color: 'var(--primary-blue)',
      checklist: [
        'Алгоритм предоставляет рекомендации, не принимая автоматических решений',
        'Финальное решение остаётся за врачом (human-in-the-loop)',
        'Прозрачность ограничений алгоритма через UI tooltips',
        'Документация клинических валидаций',
      ],
      status: 'Соответствует',
    },
    {
      id: 'ce-mdr',
      icon: Award,
      title: 'CE / MDR',
      subtitle: 'European Medical Device Regulation',
      description: 'Соответствие европейским регуляторным требованиям',
      color: 'var(--success)',
      checklist: [
        'Техническая документация (Technical File)',
        'Clinical Evaluation Report (CER)',
        'Post-Market Surveillance (PMS)',
        'Risk Management File (ISO 14971)',
      ],
      status: 'В процессе',
    },
    {
      id: 'iso-13485',
      icon: FileText,
      title: 'ISO 13485',
      subtitle: 'Quality Management Systems',
      description: 'Система менеджмента качества для медицинских изделий',
      color: 'var(--warning)',
      checklist: [
        'Контроль проектирования и разработки',
        'Валидация программного обеспечения',
        'Управление изменениями',
        'Внутренние аудиты и корректирующие действия',
      ],
      status: 'Соответствует',
    },
    {
      id: 'iso-14971',
      icon: AlertCircle,
      title: 'ISO 14971',
      subtitle: 'Risk Management',
      description: 'Управление рисками медицинских изделий',
      color: 'var(--danger)',
      checklist: [
        'Идентификация опасностей (неправильная интерпретация)',
        'Оценка рисков (низкая/средняя/высокая)',
        'Контрольные меры (human-in-the-loop, tooltips)',
        'Мониторинг рисков после выпуска на рынок',
      ],
      status: 'Соответствует',
    },
    {
      id: 'hipaa',
      icon: Lock,
      title: 'HIPAA',
      subtitle: 'Health Insurance Portability',
      description: 'Защита конфиденциальности медицинских данных (США)',
      color: 'var(--primary-navy)',
      checklist: [
        'Шифрование данных at-rest и in-transit',
        'Контроль доступа (RBAC)',
        'Audit logs всех операций',
        'Breach notification процедуры',
      ],
      status: 'Соответствует',
    },
    {
      id: 'gdpr',
      icon: Globe,
      title: 'GDPR',
      subtitle: 'General Data Protection Regulation',
      description: 'Защита персональных данных (ЕС)',
      color: 'var(--primary-blue)',
      checklist: [
        'Согласие пользователя на обработку данных',
        'Право на доступ и удаление данных',
        'Data minimization принцип',
        'Privacy by Design архитектура',
      ],
      status: 'Соответствует',
    },
  ];

  const AlertCircle = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-light)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-[var(--primary-navy)] mb-4">
            Регуляторное соответствие
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto">
            Платформа разработана в соответствии с международными стандартами медицинских изделий и защиты данных
          </p>
        </div>

        {/* Standards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {standards.map((standard, index) => {
            const Icon = standard.icon;
            return (
              <div
                key={standard.id}
                className="card p-6 cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedStandard(selectedStandard === standard.id ? null : standard.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-4 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: `${standard.color}15`,
                      color: standard.color,
                    }}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor:
                        standard.status === 'Соответствует'
                          ? 'var(--success)15'
                          : 'var(--warning)15',
                      color:
                        standard.status === 'Соответствует'
                          ? 'var(--success)'
                          : 'var(--warning)',
                    }}
                  >
                    {standard.status}
                  </span>
                </div>

                <h3 className="text-[var(--primary-navy)] mb-2 group-hover:text-[var(--primary-blue)] transition-colors">
                  {standard.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  {standard.subtitle}
                </p>
                <p className="text-sm text-[var(--text-dark)] mb-4">
                  {standard.description}
                </p>

                {/* Checklist - shown when expanded */}
                {selectedStandard === standard.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                    <h4 className="text-sm font-semibold text-[var(--primary-navy)] mb-3">
                      Чек-лист соответствия:
                    </h4>
                    <ul className="space-y-2">
                      {standard.checklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                          <span className="text-[var(--text-dark)]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  className="text-sm text-[var(--primary-blue)] mt-4 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStandard(selectedStandard === standard.id ? null : standard.id);
                  }}
                >
                  {selectedStandard === standard.id ? 'Скрыть детали' : 'Показать детали'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Risk Management Highlight */}
        <div className="card p-8 mb-8 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-red-50 rounded-xl">
              <Shield className="w-8 h-8 text-[var(--danger)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-[var(--primary-navy)] mb-3">
                Управление рисками (Human-in-the-Loop)
              </h2>
              <p className="text-[var(--text-dark)] mb-4">
                Платформа предоставляет <strong>рекомендации</strong>, но не принимает автоматических решений.
                Финальное решение о диагностике и лечении всегда остаётся за врачом.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-[var(--primary-navy)] mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                    Реализованные меры
                  </h4>
                  <ul className="text-sm text-[var(--text-dark)] space-y-1">
                    <li>• Tooltips с ограничениями алгоритма</li>
                    <li>• Прозрачность расчётов (Vermeulen)</li>
                    <li>• Врач утверждает рекомендации</li>
                    <li>• Audit trail всех действий</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-[var(--primary-navy)] mb-2 flex items-center gap-2">
                    <Tooltip content="Остаточные риски минимизированы через контрольные меры" />
                    Остаточные риски
                  </h4>
                  <ul className="text-sm text-[var(--text-dark)] space-y-1">
                    <li>• Неправильный ввод данных (валидация)</li>
                    <li>• Неверная интерпретация (обучение)</li>
                    <li>• Технические сбои (мониторинг)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-4 border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] rounded-xl hover:bg-[var(--primary-blue)] hover:text-white transition-all duration-300 font-semibold"
          >
            Вернуться в меню
          </button>
        </div>
      </div>
    </div>
  );
}
