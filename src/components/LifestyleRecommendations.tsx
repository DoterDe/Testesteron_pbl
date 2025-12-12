import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Brain, Heart, Moon, Utensils, Activity } from 'lucide-react';

type Tab = 'metabolic' | 'physical' | 'psycho';

interface Recommendation {
  title: string;
  description: string;
  tips: string[];
  icon: any;
}

const recommendations: Record<Tab, Recommendation> = {
  metabolic: {
    title: 'Метаболическая оптимизация',
    description: 'Коррекция веса и метаболических нарушений для восстановления гормонального баланса',
    icon: Utensils,
    tips: [
      'Снижение веса на 5-10% при ИМТ > 25 кг/м²',
      'Средиземноморская диета или низкоуглеводная диета',
      'Дефицит калорий 300-500 ккал/день',
      'Интервальное голодание 16/8 (опционально)',
      'Ограничение простых углеводов и трансжиров',
      'Достаточное потребление белка (1.6-2 г/кг массы тела)',
      'Омега-3 жирные кислоты (рыба, льняное масло)',
      'Контроль уровня витамина D (цель: >30 нг/мл)',
    ],
  },
  physical: {
    title: 'Физическая активность',
    description: 'Тренировки для стимуляции выработки тестостерона и улучшения композиции тела',
    icon: Dumbbell,
    tips: [
      'Силовые тренировки 3-4 раза в неделю',
      'Приоритет базовым упражнениям (приседания, становая, жим)',
      'Интенсивность: 70-85% от 1ПМ, 6-12 повторений',
      'Высокоинтенсивные интервальные тренировки (HIIT) 2-3 раза в неделю',
      'Избегать перетренированности (адекватное восстановление)',
      'Аэробные нагрузки умеренной интенсивности 150 мин/неделю',
      'Ходьба 8000-10000 шагов в день',
      'Гибкость и мобильность (йога, стретчинг)',
    ],
  },
  psycho: {
    title: 'Психофизиология и сон',
    description: 'Управление стрессом и оптимизация сна для восстановления гормональной оси',
    icon: Brain,
    tips: [
      'Продолжительность сна 7-9 часов в сутки',
      'Регулярный режим сна (засыпание и пробуждение в одно время)',
      'Темная, прохладная, тихая спальня (18-20°C)',
      'Избегать синего света за 2 часа до сна',
      'Техники управления стрессом (медитация, дыхательные практики)',
      'Ограничение алкоголя (максимум 1-2 порции в день)',
      'Отказ от курения',
      'Социальная активность и хобби для ментального здоровья',
    ],
  },
};

export function LifestyleRecommendations() {
  const [activeTab, setActiveTab] = useState<Tab>('metabolic');
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const currentRec = recommendations[activeTab];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-700 mb-4">
            <Heart size={20} />
            <span className="text-sm">Образ жизни</span>
          </div>
          <h2 className="text-4xl mb-4">Рекомендации по образу жизни</h2>
          <p className="text-xl text-gray-600">
            Научно обоснованные методы для коррекции функционального гипогонадизма
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            {[
              { id: 'metabolic' as Tab, label: 'Метаболика', icon: Utensils },
              { id: 'physical' as Tab, label: 'Физическая активность', icon: Dumbbell },
              { id: 'psycho' as Tab, label: 'Психофизиология', icon: Brain },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl smooth-transition ${
                  activeTab === tab.id
                    ? 'gradient-blue text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl gradient-success flex items-center justify-center flex-shrink-0">
                <currentRec.icon size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl mb-2">{currentRec.title}</h3>
                <p className="text-gray-600">{currentRec.description}</p>
              </div>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentRec.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => setExpandedTip(expandedTip === index ? null : index)}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-[#3C8CE7] smooth-transition cursor-pointer bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full gradient-success flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 leading-relaxed">{tip}</p>
                      
                      {expandedTip === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-200"
                        >
                          <p className="text-xs text-gray-600">
                            Детальная информация доступна в образовательном центре
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
            >
              <div className="flex items-start gap-3">
                <Activity className="text-blue-600 mt-0.5 flex-shrink-0" size={24} />
                <div className="flex-1">
                  <div className="mb-2 text-lg">Важно</div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {activeTab === 'metabolic' && (
                      <>
                        Снижение веса на 5-10% может повысить уровень тестостерона на 2-3 нмоль/л у мужчин с избыточным весом.
                        Эффект обычно проявляется через 6-12 недель.
                      </>
                    )}
                    {activeTab === 'physical' && (
                      <>
                        Силовые тренировки стимулируют острое повышение тестостерона на 15-30% в течение 1-2 часов после тренировки.
                        Хронический эффект проявляется через 8-12 недель регулярных занятий.
                      </>
                    )}
                    {activeTab === 'psycho' && (
                      <>
                        Качественный сон критичен для выработки тестостерона: 80% дневной продукции происходит во время сна.
                        Недосыпание (менее 5 часов) снижает уровень T на 10-15%.
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Evidence Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 bg-white rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Основано на клинических рекомендациях EAU, AUA и Endocrine Society</span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
