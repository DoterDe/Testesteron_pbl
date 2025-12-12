import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, AlertCircle, CheckCircle, TrendingDown, TrendingUp, Info } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  description: string;
  criteria: string[];
}

const scenarios: Scenario[] = [
  {
    id: 'normal',
    name: 'Норма',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Уровни гормонов в пределах нормы',
    criteria: [
      'Общий T > 12 нмоль/л',
      'Свободный T > 225 пг/мл',
      'ЛГ/ФСГ в норме',
      'Минимум симптомов',
    ],
  },
  {
    id: 'functional',
    name: 'Функциональный гипогонадизм',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    description: 'Обратимое снижение тестостерона, связанное с образом жизни',
    criteria: [
      'Общий T: 8-12 нмоль/л',
      'ЛГ нормальный или низко-нормальный',
      'Ожирение / нарушение сна',
      'Стресс / гиподинамия',
    ],
  },
  {
    id: 'primary',
    name: 'Первичный гипогонадизм',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    description: 'Нарушение функции яичек',
    criteria: [
      'Общий T < 8 нмоль/л',
      'ЛГ ↑↑ (> 9.3 МЕ/л)',
      'ФСГ ↑↑ (> 18 МЕ/л)',
      'Требуется ТЗТ',
    ],
  },
  {
    id: 'secondary',
    name: 'Вторичный гипогонадизм',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    description: 'Нарушение гипоталамо-гипофизарной оси',
    criteria: [
      'Общий T < 8 нмоль/л',
      'ЛГ ↓ (< 1.5 МЕ/л)',
      'ФСГ ↓ (< 1.4 МЕ/л)',
      'Проверить гипофиз',
    ],
  },
];

interface InterpretationAlgorithmProps {
  onScenarioSelect?: (scenario: string) => void;
}

export function InterpretationAlgorithm({ onScenarioSelect }: InterpretationAlgorithmProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleScenarioClick = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    onScenarioSelect?.(scenarioId);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 mb-4">
            <Activity size={20} />
            <span className="text-sm">Алгоритм интерпретации</span>
          </div>
          <h2 className="text-4xl mb-4">Дифференциальная диагностика</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Различие возрастного и патологического снижения тестостерона
          </p>
        </motion.div>

        {/* Flowchart */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            {/* Start Node */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
              >
                <div className="text-center">
                  <div className="text-sm mb-1">Старт</div>
                  <div className="text-lg">Симптомы + Анализы</div>
                </div>
              </motion.div>
              <div className="w-0.5 h-12 bg-gray-300 my-2" />
            </div>

            {/* Decision Diamond */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredNode('decision1')}
                onHoverEnd={() => setHoveredNode(null)}
                className="relative w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-400 rotate-45 shadow-lg cursor-pointer"
              >
                <div className="-rotate-45 absolute inset-0 flex items-center justify-center text-white text-center p-4">
                  <div>
                    <div className="text-sm mb-1">Общий T</div>
                    <div className="text-lg">{'< 12 нмоль/л?'}</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Hover Info */}
              <AnimatePresence>
                {hoveredNode === 'decision1' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl max-w-xs"
                  >
                    Первичный критерий для оценки уровня тестостерона. Значения ниже 12 нмоль/л требуют дальнейшей диагностики.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Branches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Yes Branch */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">Да</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => setHoveredNode('decision2')}
                  onHoverEnd={() => setHoveredNode(null)}
                  className="relative w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rotate-45 shadow-lg cursor-pointer my-4"
                >
                  <div className="-rotate-45 absolute inset-0 flex items-center justify-center text-white text-center p-3">
                    <div>
                      <div className="text-xs mb-1">ЛГ/ФСГ</div>
                      <div className="text-sm">Повышены?</div>
                    </div>
                  </div>
                </motion.div>
                
                <AnimatePresence>
                  {hoveredNode === 'decision2' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl max-w-xs"
                    >
                      Повышенные ЛГ/ФСГ указывают на первичный гипогонадизм (проблема в яичках)
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* No Branch */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">Нет</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => setHoveredNode('decision3')}
                  onHoverEnd={() => setHoveredNode(null)}
                  className="relative w-40 h-40 bg-gradient-to-br from-teal-400 to-cyan-400 rotate-45 shadow-lg cursor-pointer my-4"
                >
                  <div className="-rotate-45 absolute inset-0 flex items-center justify-center text-white text-center p-3">
                    <div>
                      <div className="text-xs mb-1">Факторы</div>
                      <div className="text-sm">образа жизни?</div>
                    </div>
                  </div>
                </motion.div>
                
                <AnimatePresence>
                  {hoveredNode === 'decision3' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl max-w-xs"
                    >
                      Проверяем наличие обратимых факторов: ожирение, стресс, недосыпание, гиподинамия
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scenario Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl text-center mb-8">Выберите сценарий для демонстрации</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scenarios.map((scenario, index) => (
              <motion.button
                key={scenario.id}
                onClick={() => handleScenarioClick(scenario.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-6 rounded-xl border-2 smooth-transition ${
                  selectedScenario === scenario.id
                    ? `${scenario.bgColor} border-current ${scenario.color} shadow-xl`
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg'
                }`}
              >
                {/* Icon */}
                <div className="mb-4">
                  {scenario.id === 'normal' && <CheckCircle size={32} className={scenario.color} />}
                  {scenario.id === 'functional' && <TrendingDown size={32} className={scenario.color} />}
                  {scenario.id === 'primary' && <AlertCircle size={32} className={scenario.color} />}
                  {scenario.id === 'secondary' && <TrendingUp size={32} className={scenario.color} />}
                </div>

                {/* Name */}
                <h4 className={`text-lg mb-2 ${selectedScenario === scenario.id ? scenario.color : ''}`}>
                  {scenario.name}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>

                {/* Criteria */}
                <div className="space-y-2">
                  {scenario.criteria.map((criterion, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${scenario.bgColor}`} />
                      <span className="text-xs text-gray-700">{criterion}</span>
                    </div>
                  ))}
                </div>

                {/* Selected Indicator */}
                {selectedScenario === scenario.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 pt-4 border-t border-current"
                  >
                    <div className={`flex items-center gap-2 ${scenario.color}`}>
                      <CheckCircle size={16} />
                      <span className="text-sm">Выбран</span>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
        >
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 mt-0.5" size={24} />
            <div className="flex-1">
              <div className="mb-2 text-lg">Ключевое различие</div>
              <div className="text-sm text-gray-700 leading-relaxed">
                <strong>Функциональный гипогонадизм</strong> обратим при изменении образа жизни (снижение веса, улучшение сна, снижение стресса).
                <strong className="ml-1">Первичный и вторичный</strong> требуют медицинского вмешательства, включая возможную тестостерон-заместительную терапию (ТЗТ).
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
