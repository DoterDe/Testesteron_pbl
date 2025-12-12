import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Заполнение анкет',
      description: 'Пройдите научно обоснованные опросники для оценки симптомов',
      image: 'https://images.unsplash.com/photo-1758691463610-3c2ecf5fb3fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFsdGhjYXJlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjU0NjU5OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      points: [
        'ADAM - скрининг андрогенного дефицита',
        'AMS - возрастные мужские симптомы',
        'IIEF - эректильная функция',
        'PHQ-9 - оценка настроения',
      ],
    },
    {
      title: 'Загрузка лабораторных данных',
      description: 'Введите результаты анализов для точной оценки',
      image: 'https://images.unsplash.com/photo-1614308456595-a59d48697ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwbGFib3JhdG9yeXxlbnwxfHx8fDE3NjU0NTk5MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      points: [
        'Общий и свободный тестостерон',
        'SHBG, ЛГ, ФСГ, пролактин',
        'Автоматический расчёт по формуле Vermeulen',
        'Цветовая индикация: норма, внимание, критично',
      ],
    },
    {
      title: 'Чтение отчётов',
      description: 'Получите подробные отчёты с визуализацией и рекомендациями',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzY1NTUwMDIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      points: [
        'Интерактивные графики и тренды',
        'Сравнение с возрастными нормами',
        'Экспорт в PDF и CSV',
        'Рекомендации по образу жизни',
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-blue)] flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-fade-in">
        {/* Progress bar */}
        <div className="bg-gray-100 h-2">
          <div
            className="bg-[var(--success)] h-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Image */}
            <div className="flex-1 animate-slide-in">
              <img
                src={steps[currentStep].image}
                alt={steps[currentStep].title}
                className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="flex-1 animate-fade-in">
              <div className="mb-4">
                <span className="text-[var(--primary-blue)] text-sm">
                  Шаг {currentStep + 1} из {steps.length}
                </span>
              </div>

              <h2 className="text-[var(--primary-navy)] mb-4">
                {steps[currentStep].title}
              </h2>

              <p className="text-[var(--text-muted)] mb-6">
                {steps[currentStep].description}
              </p>

              <ul className="space-y-3 mb-8">
                {steps[currentStep].points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--text-dark)]">{point}</span>
                  </li>
                ))}
              </ul>

              {/* Navigation buttons */}
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex-1 px-6 py-3 border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] rounded-lg hover:bg-[var(--primary-blue)] hover:text-white transition-all"
                  >
                    <ChevronLeft className="inline-block w-5 h-5 mr-2" />
                    Назад
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 btn-primary"
                >
                  {currentStep === steps.length - 1 ? 'Начать работу' : 'Далее'}
                  {currentStep < steps.length - 1 && (
                    <ChevronRight className="inline-block w-5 h-5 ml-2" />
                  )}
                </button>
              </div>

              {/* Step indicators */}
              <div className="flex gap-2 justify-center mt-8">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-[var(--success)] w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
