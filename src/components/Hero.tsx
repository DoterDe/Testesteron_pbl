import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export function Hero({ onGetStarted, onLearnMore }: HeroProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-blue)]">
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10 animate-float"
            style={{
              width: Math.random() * 100 + 20 + 'px',
              height: Math.random() * 100 + 20 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 5 + 5 + 's',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-screen">
        {/* Left side - Text content */}
        <div className="flex-1 text-white animate-slide-in text-center lg:text-left">
          <h1 className="mb-6">
            Ваш цифровой эндокринолог
          </h1>
          <p className="text-2xl mb-8 text-white/90 max-w-2xl mx-auto lg:mx-0">
            Точная диагностика тестостерона с научной валидацией
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button onClick={onGetStarted} className="btn-primary">
              Начать диагностику
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
            <button onClick={onLearnMore} className="btn-secondary">
              Узнать больше
            </button>
          </div>
          
          {/* Key features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl mb-2">🔬</div>
              <h4 className="text-white mb-2">Клиническая точность</h4>
              <p className="text-white/80 text-sm">Научно обоснованные методы диагностики</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="text-white mb-2">Визуализация данных</h4>
              <p className="text-white/80 text-sm">Интерактивные графики и отчёты</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="text-white mb-2">Безопасность</h4>
              <p className="text-white/80 text-sm">HIPAA/GDPR соответствие</p>
            </div>
          </div>
        </div>

        {/* Right side - HPA Axis visualization */}
        <div className="flex-1 relative animate-fade-in">
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwYnJhaW4lMjBhbmF0b215fGVufDF8fHx8MTc2NTU1NzI1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="HPA Axis"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            
            {/* Interactive hotspots */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
              <div className="relative group/hotspot">
                <div className="w-4 h-4 bg-[var(--success)] rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-[var(--success)] rounded-full"></div>
                <div className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-300 absolute left-8 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                  <div className="bg-white text-[var(--primary-navy)] px-4 py-2 rounded-lg shadow-xl">
                    <p className="font-semibold">Гипоталамус</p>
                    <p className="text-sm">Секретирует GnRH</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2">
              <div className="relative group/hotspot">
                <div className="w-4 h-4 bg-[var(--warning)] rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-[var(--warning)] rounded-full"></div>
                <div className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-300 absolute left-8 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                  <div className="bg-white text-[var(--primary-navy)] px-4 py-2 rounded-lg shadow-xl">
                    <p className="font-semibold">Гипофиз</p>
                    <p className="text-sm">Выделяет ЛГ и ФСГ</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
              <div className="relative group/hotspot">
                <div className="w-4 h-4 bg-[var(--primary-blue)] rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-[var(--primary-blue)] rounded-full"></div>
                <div className="opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-300 absolute left-8 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                  <div className="bg-white text-[var(--primary-navy)] px-4 py-2 rounded-lg shadow-xl">
                    <p className="font-semibold">Яички</p>
                    <p className="text-sm">Производят тестостерон</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HPA Axis explanation with tooltip */}
          <div className="mt-6 flex items-center justify-center gap-2 text-white">
            <span className="text-lg">Ось HPA (Гипоталамус-Гипофиз-Яички)</span>
            <Tooltip content="Гипоталамо-гипофизарно-яичковая ось контролирует выработку тестостерона через каскад гормональных сигналов" />
          </div>
        </div>
      </div>
    </div>
  );
}