import React, { useState } from 'react';
import { BookOpen, Video, HelpCircle, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface EducationModuleProps {
  onBack: () => void;
}

export function EducationModule({ onBack }: EducationModuleProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const videos = [
    {
      id: 1,
      title: 'Что такое тестостерон и зачем его измерять?',
      duration: '5:30',
      thumbnail: 'https://images.unsplash.com/photo-1758691463610-3c2ecf5fb3fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFsdGhjYXJlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjU0NjU5OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Основы гормональной системы и роль тестостерона в мужском здоровье',
    },
    {
      id: 2,
      title: 'Как правильно сдать анализ на тестостерон',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1614308456595-a59d48697ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwbGFib3JhdG9yeXxlbnwxfHx8fDE3NjU0NTk5MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Подготовка к анализу: время, диета, факторы влияния',
    },
    {
      id: 3,
      title: 'Формула Vermeulen: расчёт свободного тестостерона',
      duration: '6:15',
      thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwYnJhaW4lMjBhbmF0b215fGVufDF8fHx8MTc2NTU1NzI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Почему свободный тестостерон важнее общего и как его считают',
    },
    {
      id: 4,
      title: 'Образ жизни и тестостерон: сон, питание, стресс',
      duration: '8:20',
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzY1NTUwMDIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Как образ жизни влияет на уровень тестостерона',
    },
  ];

  const faqs = [
    {
      question: 'Что означает "общий" и "свободный" тестостерон?',
      answer: 'Общий тестостерон (Total T) — это сумма всего тестостерона в крови. Большая часть (60-70%) связана с SHBG (глобулин), около 30% с альбумином, и только 1-3% существует в свободной форме. Свободный тестостерон (Free T) — это биологически активная форма, которая может проникать в клетки и оказывать гормональное действие. Именно свободный тестостерон — наиболее важный показатель для оценки андрогенного статуса.',
    },
    {
      question: 'Почему важно сдавать анализ утром?',
      answer: 'Тестостерон секретируется циркадно (по суточному ритму), с пиком в 6-8 утра. К вечеру уровень может снизиться на 20-30%. Чтобы получить объективный результат и сравнивать его с референсными значениями, анализ следует сдавать утром натощак (8-11 утра). Также важно хорошо выспаться накануне — недосып снижает тестостерон.',
    },
    {
      question: 'Что такое формула Vermeulen?',
      answer: 'Формула Vermeulen — это математическая модель для расчёта свободного тестостерона на основе общего тестостерона, SHBG и альбумина. Прямое измерение свободного Т сложное и дорогое, поэтому используется расчёт. Формула учитывает константы связывания с белками и решает квадратное уравнение для нахождения свободной фракции.',
    },
    {
      question: 'Какие нормы для тестостерона?',
      answer: 'Норма зависит от возраста и метода измерения. Общие ориентиры: общий Т 300-1000 нг/дл, свободный Т 5-15 нг/дл (или 50-200 пг/мл). У молодых мужчин (20-30 лет) оптимально >500 нг/дл, после 40 лет уровень естественно снижается на 1-2% в год. Важнее абсолютного значения — наличие симптомов (ADAM опросник).',
    },
    {
      question: 'Что влияет на уровень тестостерона?',
      answer: 'Сон (недосып снижает на 10-15%), стресс (кортизол подавляет тестостерон), вес (жировая ткань конвертирует Т в эстроген через ароматазу), физическая активность (силовые тренировки повышают), питание (цинк, витамин D, здоровые жиры важны), алкоголь и курение (снижают), возраст (естественное снижение).',
    },
    {
      question: 'Когда нужна заместительная терапия (ЗТТ)?',
      answer: 'ЗТТ рассматривается при: (1) низком уровне тестостерона по двум анализам, (2) наличии симптомов (низкое либидо, эректильная дисфункция, усталость, снижение мышечной массы), (3) после исключения вторичных причин (опухоли гипофиза, гипотиреоз). Решение принимается врачом индивидуально, с учётом рисков (сердечно-сосудистые заболевания, рак простаты). Всегда сначала пробуют коррекцию образа жизни.',
    },
  ];

  const glossary = [
    { term: 'SHBG', definition: 'Sex Hormone Binding Globulin — белок, связывающий половые гормоны. Высокий SHBG снижает свободный тестостерон.' },
    { term: 'ЛГ (LH)', definition: 'Лютеинизирующий гормон — стимулирует выработку тестостерона клетками Лейдига в яичках.' },
    { term: 'ФСГ (FSH)', definition: 'Фолликулостимулирующий гормон — регулирует сперматогенез.' },
    { term: 'HPA-ось', definition: 'Гипоталамус-Гипофиз-Яички — эндокринная ось контроля тестостерона.' },
    { term: 'ADAM', definition: 'Androgen Deficiency in Aging Males — опросник для скрининга низкого тестостерона.' },
    { term: 'HOMA-IR', definition: 'Индекс инсулинорезистентности. Высокий HOMA-IR связан с низким тестостероном и метаболическим синдромом.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-light)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-blue)] rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[var(--primary-navy)] mb-4">
            Образовательный центр
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto">
            Научно обоснованная информация о тестостероне, диагностике и лечении
          </p>
        </div>

        {/* Video library */}
        <div className="mb-16">
          <h2 className="text-[var(--primary-navy)] mb-6 text-center">
            Видеолекции
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="card overflow-hidden cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedVideo(selectedVideo === video.id ? null : video.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-10 h-10 text-[var(--primary-blue)]" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded text-sm">
                    {video.duration}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-[var(--primary-navy)] mb-2 group-hover:text-[var(--primary-blue)] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-[var(--primary-navy)] mb-6 text-center">
            Часто задаваемые вопросы
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <HelpCircle className="w-6 h-6 text-[var(--primary-blue)] flex-shrink-0 mt-1" />
                    <h4 className="text-[var(--primary-navy)] pr-4">
                      {faq.question}
                    </h4>
                  </div>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-6 h-6 text-[var(--text-muted)] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[var(--text-muted)] flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 pt-0 animate-fade-in">
                    <div className="pl-10 text-[var(--text-dark)] leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Medical Glossary */}
        <div className="mb-16">
          <h2 className="text-[var(--primary-navy)] mb-6 text-center">
            Медицинский глоссарий
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {glossary.map((item, index) => (
              <div
                key={index}
                className="card p-6 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--primary-blue)] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-[var(--primary-navy)] mb-2">
                      {item.term}
                    </h4>
                    <p className="text-sm text-[var(--text-dark)]">
                      {item.definition}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infographic */}
        <div className="card p-8 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 animate-fade-in">
          <h2 className="text-[var(--primary-navy)] mb-6 text-center">
            Инфографика: Факторы влияния на тестостерон
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '😴', title: 'Сон', impact: '7-9 часов', effect: '+15%' },
              { emoji: '🏋️', title: 'Тренировки', impact: '3-5 раз/нед', effect: '+20%' },
              { emoji: '🥗', title: 'Питание', impact: 'Цинк, Вит D', effect: '+10%' },
              { emoji: '😌', title: 'Стресс', impact: 'Низкий', effect: '+12%' },
            ].map((factor, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{factor.emoji}</div>
                <h4 className="text-[var(--primary-navy)] mb-2">
                  {factor.title}
                </h4>
                <p className="text-sm text-[var(--text-muted)] mb-2">{factor.impact}</p>
                <span className="text-lg font-bold text-[var(--success)]">{factor.effect}</span>
              </div>
            ))}
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
