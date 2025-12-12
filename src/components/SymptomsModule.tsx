import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { projectId } from '../utils/supabase/info';

interface SymptomsModuleProps {
  accessToken: string;
  onComplete: () => void;
  onBack: () => void;
}

export function SymptomsModule({ accessToken, onComplete, onBack }: SymptomsModuleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState({
    // ADAM questionnaire
    libidoDecrease: null as number | null,
    energyDecrease: null as number | null,
    strengthDecrease: null as number | null,
    heightDecrease: null as number | null,
    lifeEnjoyment: null as number | null,
    sadness: null as number | null,
    erectileWeakness: null as number | null,
    sportsAbility: null as number | null,
    sleepiness: null as number | null,
    workPerformance: null as number | null,
    
    // Sleep
    sleepHours: 7,
    sleepQuality: 5,
    
    // Weight and lifestyle
    weight: 80,
    height: 175,
    exerciseFrequency: 3,
    stressLevel: 5,
  });

  const steps = [
    {
      title: 'ADAM Опросник',
      subtitle: 'Androgen Deficiency in Aging Males',
      questions: [
        { key: 'libidoDecrease', text: 'Снизилось ли ваше половое влечение (либидо)?', tooltip: 'Либидо — это интерес к сексуальной активности. Снижение может указывать на низкий тестостерон.' },
        { key: 'energyDecrease', text: 'Чувствуете ли вы нехватку энергии?', tooltip: 'Хроническая усталость и снижение энергии — частые симптомы низкого тестостерона.' },
        { key: 'strengthDecrease', text: 'Уменьшилась ли ваша сила и/или выносливость?', tooltip: 'Тестостерон влияет на мышечную массу и физическую работоспособность.' },
        { key: 'sadness', text: 'Чувствуете ли вы грусть или раздражительность?', tooltip: 'Настроение тесно связано с уровнем гормонов, включая тестостерон.' },
        { key: 'erectileWeakness', text: 'Ухудшилась ли сила эрекций?', tooltip: 'Эректильная дисфункция может быть ранним признаком низкого тестостерона.' },
      ],
    },
    {
      title: 'Качество сна',
      subtitle: 'Сон критически важен для выработки тестостерона',
      questions: [
        { key: 'sleepHours', text: 'Сколько часов вы спите в среднем за ночь?', type: 'slider', min: 4, max: 12, tooltip: 'Оптимально 7-9 часов. Недостаток сна снижает выработку тестостерона на 10-15%.' },
        { key: 'sleepQuality', text: 'Оцените качество вашего сна (1-10)', type: 'slider', min: 1, max: 10, tooltip: 'Глубокий сон необходим для пиковой выработки тестостерона ночью.' },
      ],
    },
    {
      title: 'Образ жизни',
      subtitle: 'Факторы, влияющие на гормональный баланс',
      questions: [
        { key: 'weight', text: 'Ваш вес (кг)', type: 'number', tooltip: 'Избыточный вес снижает тестостерон из-за конверсии в эстроген в жировой ткани.' },
        { key: 'height', text: 'Ваш рост (см)', type: 'number', tooltip: 'Используется для расчёта ИМТ' },
        { key: 'exerciseFrequency', text: 'Сколько раз в неделю вы занимаетесь физическими упражнениями?', type: 'slider', min: 0, max: 7, tooltip: 'Силовые тренировки повышают тестостерон. Оптимально 3-5 раз в неделю.' },
        { key: 'stressLevel', text: 'Уровень стресса (1-10)', type: 'slider', min: 1, max: 10, tooltip: 'Хронический стресс повышает кортизол, который подавляет выработку тестостерона.' },
      ],
    },
  ];

  const calculateRisk = () => {
    let riskScore = 0;
    
    // ADAM positive if any answer is yes (value >= 3)
    const adamQuestions = ['libidoDecrease', 'energyDecrease', 'strengthDecrease', 'sadness', 'erectileWeakness'];
    adamQuestions.forEach(q => {
      if ((responses[q as keyof typeof responses] as number) >= 3) riskScore += 1;
    });
    
    // Sleep
    if (responses.sleepHours < 7) riskScore += 1;
    if (responses.sleepQuality < 5) riskScore += 1;
    
    // BMI
    const bmi = responses.weight / ((responses.height / 100) ** 2);
    if (bmi > 25) riskScore += 1;
    if (bmi > 30) riskScore += 1;
    
    // Exercise
    if (responses.exerciseFrequency < 3) riskScore += 1;
    
    // Stress
    if (responses.stressLevel > 7) riskScore += 1;
    
    if (riskScore <= 2) return { level: 'low', color: 'var(--success)', text: 'Низкий риск' };
    if (riskScore <= 5) return { level: 'moderate', color: 'var(--warning)', text: 'Умеренный риск' };
    return { level: 'high', color: 'var(--danger)', text: 'Высокий риск' };
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const risk = calculateRisk();
      const bmi = responses.weight / ((responses.height / 100) ** 2);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12079b1e/symptoms`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...responses,
            bmi,
            risk: risk.level,
            riskText: risk.text,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to save symptoms');
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving symptoms:', error);
      alert('Ошибка сохранения данных. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const isStepComplete = () => {
    const currentQuestions = steps[currentStep].questions;
    return currentQuestions.every(q => responses[q.key as keyof typeof responses] !== null);
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const risk = calculateRisk();

  return (
    <div className="min-h-screen bg-[var(--bg-light)] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--text-muted)]">
              Шаг {currentStep + 1} из {steps.length}
            </span>
            <span className="text-sm text-[var(--text-muted)]">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[var(--success)] h-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Content card */}
        <div className="card p-8 animate-fade-in">
          <div className="mb-6">
            <h2 className="text-[var(--primary-navy)] mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-[var(--text-muted)]">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-6 mb-8">
            {steps[currentStep].questions.map((question, index) => (
              <div key={question.key} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <label className="block mb-3 text-[var(--text-dark)] flex items-center gap-2">
                  {question.text}
                  <Tooltip content={question.tooltip} />
                </label>

                {(!question.type || question.type === 'slider') && (
                  <div>
                    {question.key.includes('libido') || question.key.includes('energy') || question.key.includes('strength') || question.key.includes('sadness') || question.key.includes('erectile') ? (
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            onClick={() => setResponses({ ...responses, [question.key]: value })}
                            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                              responses[question.key as keyof typeof responses] === value
                                ? 'border-[var(--primary-blue)] bg-[var(--primary-blue)] text-white'
                                : 'border-gray-300 hover:border-[var(--primary-blue)]'
                            }`}
                          >
                            {value === 1 ? 'Нет' : value === 5 ? 'Да, очень' : value}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <input
                          type="range"
                          min={question.min}
                          max={question.max}
                          value={responses[question.key as keyof typeof responses] as number}
                          onChange={(e) => setResponses({ ...responses, [question.key]: Number(e.target.value) })}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-[var(--text-muted)] mt-1">
                          <span>{question.min}</span>
                          <span className="font-semibold text-[var(--primary-blue)]">
                            {responses[question.key as keyof typeof responses]}
                          </span>
                          <span>{question.max}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {question.type === 'number' && (
                  <input
                    type="number"
                    value={responses[question.key as keyof typeof responses] as number}
                    onChange={(e) => setResponses({ ...responses, [question.key]: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Risk indicator */}
          {currentStep === steps.length - 1 && (
            <div
              className="p-4 rounded-lg border-2 mb-6 animate-fade-in"
              style={{ borderColor: risk.color, backgroundColor: `${risk.color}15` }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" style={{ color: risk.color }} />
                <div>
                  <p className="font-semibold" style={{ color: risk.color }}>
                    Предварительная оценка риска: {risk.text}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    На основе ваших ответов. Для точной диагностики необходимы лабораторные анализы.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            {currentStep > 0 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 py-3 border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] rounded-lg hover:bg-[var(--primary-blue)] hover:text-white transition-all"
              >
                <ChevronLeft className="inline-block w-5 h-5 mr-2" />
                Назад
              </button>
            ) : (
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-[var(--text-muted)] rounded-lg hover:border-[var(--primary-blue)] hover:text-[var(--primary-blue)] transition-all"
              >
                Вернуться в меню
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepComplete()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее
                <ChevronRight className="inline-block w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepComplete()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Сохранение...' : 'Завершить опрос'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
