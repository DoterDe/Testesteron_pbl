import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { SymptomsQuestionnaire } from './components/SymptomsQuestionnaire';
import { LabDataInput } from './components/LabDataInput';
import { InterpretationAlgorithm } from './components/InterpretationAlgorithm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { LifestyleRecommendations } from './components/LifestyleRecommendations';
import { DynamicsCharts } from './components/DynamicsCharts';
import { Footer } from './components/Footer';
import { DemoNavigation } from './components/DemoNavigation';
import { AuthModal } from './components/AuthModal';
import { ExportButton } from './components/ExportButton';
import { ScrollToTop } from './components/ScrollToTop';

type DemoStep = 'intro' | 'symptoms' | 'lab' | 'interpretation' | 'dashboard' | 'recommendations';

export default function App() {
  const [demoMode, setDemoMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Demo state
  const [currentStep, setCurrentStep] = useState<DemoStep>('intro');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [symptomsAnswers, setSymptomsAnswers] = useState<Record<string, number>>({});
  const [labData, setLabData] = useState<any>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('normal');

  const handleLoginClick = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  const handleStartDemo = () => {
    setDemoMode(true);
    setCurrentStep('symptoms');
    // Scroll to demo section
    setTimeout(() => {
      const demoSection = document.getElementById('demo');
      demoSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSymptomsComplete = (answers: Record<string, number>) => {
    setSymptomsAnswers(answers);
    setCompletedSteps([...completedSteps, 1]);
    setCurrentStep('lab');
    
    // Scroll to next section
    setTimeout(() => {
      const element = document.getElementById('demo-content');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLabDataCalculate = (data: any) => {
    setLabData(data);
    setCompletedSteps([...completedSteps, 2]);
    setCurrentStep('interpretation');
    
    setTimeout(() => {
      const element = document.getElementById('demo-content');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleScenarioSelect = (scenario: string) => {
    setSelectedScenario(scenario);
    setCompletedSteps([...completedSteps, 3]);
    setCurrentStep('dashboard');
    
    setTimeout(() => {
      const element = document.getElementById('demo-content');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStepClick = (step: number) => {
    const stepMap: Record<number, DemoStep> = {
      1: 'symptoms',
      2: 'lab',
      3: 'interpretation',
      4: 'dashboard',
      5: 'recommendations',
    };
    
    setCurrentStep(stepMap[step]);
    
    setTimeout(() => {
      const element = document.getElementById('demo-content');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getStepNumber = (step: DemoStep): number => {
    const stepNumbers: Record<DemoStep, number> = {
      intro: 0,
      symptoms: 1,
      lab: 2,
      interpretation: 3,
      dashboard: 4,
      recommendations: 5,
    };
    return stepNumbers[step];
  };

  return (
    <div className="min-h-screen">
      <Header 
        onLoginClick={handleLoginClick} 
        onSignupClick={handleSignupClick}
        isDemoMode={demoMode}
      />
      
      {/* Hero Section */}
      <div id="home">
        <HeroSection onStartDemo={handleStartDemo} />
      </div>

      {/* How It Works Section */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Demo Section */}
      {demoMode && (
        <div id="demo" className="bg-white">
          <DemoNavigation
            currentStep={getStepNumber(currentStep)}
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
          />
          
          <div id="demo-content">
            {/* Step 1: Symptoms Questionnaire */}
            {currentStep === 'symptoms' && (
              <SymptomsQuestionnaire onComplete={handleSymptomsComplete} />
            )}

            {/* Step 2: Lab Data Input */}
            {currentStep === 'lab' && (
              <LabDataInput onCalculate={handleLabDataCalculate} />
            )}

            {/* Step 3: Interpretation Algorithm */}
            {currentStep === 'interpretation' && (
              <div id="algorithm">
                <InterpretationAlgorithm onScenarioSelect={handleScenarioSelect} />
              </div>
            )}

            {/* Step 4: Results Dashboard */}
            {currentStep === 'dashboard' && (
              <>
                <ResultsDashboard scenario={selectedScenario} />
                
                {/* Quick Scenario Switcher */}
                <div className="py-8 bg-gray-50">
                  <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-xl mb-4 text-center">Попробуйте другие сценарии</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['normal', 'functional', 'primary', 'secondary'].map((scenario) => (
                          <button
                            key={scenario}
                            onClick={() => setSelectedScenario(scenario)}
                            className={`px-4 py-3 rounded-xl smooth-transition ${
                              selectedScenario === scenario
                                ? 'gradient-blue text-white shadow-lg'
                                : 'border-2 border-gray-200 hover:border-[#3C8CE7] text-gray-700'
                            }`}
                          >
                            {scenario === 'normal' && 'Норма'}
                            {scenario === 'functional' && 'Функциональный'}
                            {scenario === 'primary' && 'Первичный'}
                            {scenario === 'secondary' && 'Вторичный'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue to Recommendations */}
                <div className="py-8 bg-white">
                  <div className="max-w-4xl mx-auto px-6 text-center">
                    <button
                      onClick={() => {
                        setCompletedSteps([...completedSteps, 4]);
                        setCurrentStep('recommendations');
                        setTimeout(() => {
                          const element = document.getElementById('demo-content');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="px-8 py-4 rounded-xl gradient-success text-white shadow-xl smooth-transition hover-scale"
                    >
                      Перейти к рекомендациям
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Lifestyle Recommendations */}
            {currentStep === 'recommendations' && (
              <>
                <LifestyleRecommendations />
                
                {/* Complete Demo */}
                <div className="py-20 bg-gradient-to-b from-white to-gray-50">
                  <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-12 border border-gray-100">
                      <div className="w-20 h-20 rounded-full gradient-success flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-4xl mb-4">Демо завершено!</h2>
                      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Вы прошли полный цикл диагностики и получили персонализированные рекомендации. 
                        Это демонстрация возможностей платформы для дифференциации возрастного и патологического гипогонадизма.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                          onClick={() => {
                            setCurrentStep('symptoms');
                            setCompletedSteps([]);
                            setSymptomsAnswers({});
                            setLabData(null);
                            setSelectedScenario('normal');
                            setTimeout(() => {
                              const element = document.getElementById('demo-content');
                              element?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className="px-8 py-4 rounded-xl gradient-blue text-white shadow-xl smooth-transition hover-scale"
                        >
                          Начать заново
                        </button>
                        <button
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:border-[#3C8CE7] smooth-transition"
                        >
                          Вернуться наверх
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Algorithm Section - Always visible */}
      {!demoMode && (
        <div id="algorithm">
          <InterpretationAlgorithm />
        </div>
      )}

      {/* Footer */}
      <div id="contacts">
        <Footer />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}