import { Check } from 'lucide-react';

interface DemoNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

const steps = [
  { id: 1, label: 'Симптомы', short: 'Symptoms' },
  { id: 2, label: 'Лаборатория', short: 'Lab' },
  { id: 3, label: 'Интерпретация', short: 'Analysis' },
  { id: 4, label: 'Дашборд', short: 'Dashboard' },
  { id: 5, label: 'Рекомендации', short: 'Actions' },
];

export function DemoNavigation({ currentStep, onStepClick, completedSteps }: DemoNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <button
                onClick={() => onStepClick(step.id)}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full smooth-transition ${
                  currentStep === step.id
                    ? 'gradient-blue text-white shadow-lg scale-110'
                    : completedSteps.includes(step.id)
                    ? 'bg-[#27AE60] text-white'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
              >
                {completedSteps.includes(step.id) ? (
                  <Check size={20} />
                ) : (
                  <span>{step.id}</span>
                )}
              </button>

              {/* Step Label */}
              <div className="hidden md:block ml-3">
                <div className={`text-sm ${currentStep === step.id ? 'text-[#3C8CE7]' : 'text-gray-600'}`}>
                  {step.label}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={`h-1 rounded-full smooth-transition ${
                      completedSteps.includes(step.id) ? 'bg-[#27AE60]' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Step Label */}
        <div className="md:hidden text-center mt-3">
          <div className="text-sm text-[#3C8CE7]">
            {steps.find(s => s.id === currentStep)?.label}
          </div>
        </div>
      </div>
    </div>
  );
}
