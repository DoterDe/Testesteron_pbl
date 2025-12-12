import { ArrowDown, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  onStartDemo: () => void;
}

export function HeroSection({ onStartDemo }: HeroSectionProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles for background animation
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-primary pt-16">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${6 + particle.delay}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* HPA Axis Animation */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
        <HPAAxisVisualization />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center slide-up">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 fade-in">
            <Activity size={16} className="text-white" />
            <span className="text-white text-sm">Научно валидированная диагностика</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-white mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
            Цифровая платформа диагностики тестостерона
          </h1>

          {/* Subtitle */}
          <h2 className="text-white/90 mb-12 max-w-3xl mx-auto fade-in" style={{ animationDelay: '0.2s' }}>
            Различаем возрастное и патологическое снижение тестостерона с клинической точностью
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={onStartDemo}
              className="px-8 py-4 rounded-xl gradient-success text-white shadow-2xl smooth-transition hover-scale"
            >
              Начать демо
            </button>
            <button
              onClick={() => {
                const section = document.getElementById('how-it-works');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl border-2 border-white text-white smooth-transition hover:bg-white hover:text-[#0D1F3C]"
            >
              Узнать больше
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl text-white mb-2">ISO 13485</div>
              <div className="text-white/70 text-sm">Сертификация</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-white mb-2">GDPR</div>
              <div className="text-white/70 text-sm">Соответствие</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-white mb-2">CE/MDR</div>
              <div className="text-white/70 text-sm">Одобрено</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-white mb-2">HIPAA</div>
              <div className="text-white/70 text-sm">Защищено</div>
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bounce-animation">
          <ArrowDown size={32} className="text-white/60" />
        </div>
      </div>
    </section>
  );
}

function HPAAxisVisualization() {
  return (
    <div className="relative w-64 h-96 float-animation">
      {/* Hypothalamus */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 pulse-animation" />
          </div>
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 text-white text-sm whitespace-nowrap">
            Гипоталамус
          </div>
        </div>
      </div>

      {/* Arrow 1 */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-white/40 to-white/20">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/40 rotate-45" />
      </div>

      {/* Pituitary */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 pulse-animation" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 text-white text-sm whitespace-nowrap">
            Гипофиз
          </div>
        </div>
      </div>

      {/* Arrow 2 */}
      <div className="absolute top-60 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-white/40 to-white/20">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/40 rotate-45" />
      </div>

      {/* Testes/Adrenal */}
      <div className="absolute top-80 left-1/2 -translate-x-1/2">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 pulse-animation" style={{ animationDelay: '2s' }} />
          </div>
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 text-white text-sm whitespace-nowrap">
            Тестостерон
          </div>
        </div>
      </div>

      {/* Hormone Flow Animation */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2">
        <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
      </div>
    </div>
  );
}