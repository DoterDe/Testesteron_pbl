import { useState } from 'react';
import { motion } from 'motion/react';
import { Beaker, Calculator, Info, TrendingUp } from 'lucide-react';

interface LabData {
  totalT: string;
  freeT: string;
  lh: string;
  fsh: string;
  shbg: string;
  albumin: string;
}

interface LabDataInputProps {
  onCalculate: (data: LabData) => void;
}

export function LabDataInput({ onCalculate }: LabDataInputProps) {
  const [labData, setLabData] = useState<LabData>({
    totalT: '15.5',
    freeT: '',
    lh: '5.2',
    fsh: '4.8',
    shbg: '35',
    albumin: '43',
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const labFields = [
    {
      id: 'totalT',
      label: 'Общий тестостерон',
      unit: 'нмоль/л',
      placeholder: '10-35',
      norm: '10.4-34.7 нмоль/л',
      info: 'Общий уровень тестостерона в крови. Норма для мужчин: 10.4-34.7 нмоль/л',
    },
    {
      id: 'freeT',
      label: 'Свободный тестостерон',
      unit: 'пг/мл',
      placeholder: 'Будет рассчитан',
      norm: 'Рассчитывается по формуле Vermeulen',
      info: 'Биологически активная фракция тестостерона. Будет рассчитан автоматически по формуле Vermeulen',
    },
    {
      id: 'lh',
      label: 'Лютеинизирующий гормон (ЛГ)',
      unit: 'МЕ/л',
      placeholder: '1.5-9.3',
      norm: '1.5-9.3 МЕ/л',
      info: 'Гормон гипофиза, стимулирующий выработку тестостерона',
    },
    {
      id: 'fsh',
      label: 'Фолликулостимулирующий гормон (ФСГ)',
      unit: 'МЕ/л',
      placeholder: '1.4-18.1',
      norm: '1.4-18.1 МЕ/л',
      info: 'Гормон гипофиза, влияющий на сперматогенез',
    },
    {
      id: 'shbg',
      label: 'Глобулин, связывающий половые гормоны (SHBG)',
      unit: 'нмоль/л',
      placeholder: '13-71',
      norm: '13-71 нмоль/л',
      info: 'Белок, связывающий тестостерон и снижающий его биодоступность',
    },
    {
      id: 'albumin',
      label: 'Альбумин',
      unit: 'г/л',
      placeholder: '35-50',
      norm: '35-50 г/л',
      info: 'Основной белок крови, частично связывающий тестостерон',
    },
  ];

  const handleChange = (id: string, value: string) => {
    setLabData({ ...labData, [id]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate free testosterone using Vermeulen formula (simplified demo)
    const totalT = parseFloat(labData.totalT) || 0;
    const shbg = parseFloat(labData.shbg) || 1;
    const calculatedFreeT = ((totalT * 1000) / (shbg + 10)).toFixed(1);
    
    const updatedData = { ...labData, freeT: calculatedFreeT };
    setLabData(updatedData);
    onCalculate(updatedData);
  };

  const getValueStatus = (id: string, value: string) => {
    if (!value || id === 'freeT') return 'border-gray-300';
    
    const numValue = parseFloat(value);
    const ranges: Record<string, [number, number]> = {
      totalT: [10.4, 34.7],
      lh: [1.5, 9.3],
      fsh: [1.4, 18.1],
      shbg: [13, 71],
      albumin: [35, 50],
    };

    const range = ranges[id];
    if (!range) return 'border-gray-300';

    if (numValue < range[0]) return 'border-red-400 bg-red-50';
    if (numValue > range[1]) return 'border-orange-400 bg-orange-50';
    return 'border-green-400 bg-green-50';
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 mb-4">
            <Beaker size={20} />
            <span className="text-sm">Лабораторные данные</span>
          </div>
          <h2 className="text-4xl mb-4">Введите результаты анализов</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Для точной оценки и расчета свободного тестостерона по формуле Vermeulen
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lab Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {labFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Label with Info Icon */}
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={field.id} className="text-sm">
                      {field.label}
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTooltip(field.id)}
                        onMouseLeave={() => setShowTooltip(null)}
                        className="p-1 text-gray-400 hover:text-[#3C8CE7] smooth-transition"
                      >
                        <Info size={16} />
                      </button>
                      
                      {/* Tooltip */}
                      {showTooltip === field.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-0 top-8 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-10"
                        >
                          <div className="mb-1">{field.info}</div>
                          <div className="text-gray-300">Норма: {field.norm}</div>
                          <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="relative">
                    <input
                      id={field.id}
                      type="text"
                      value={labData[field.id as keyof LabData]}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={field.id === 'freeT'}
                      className={`w-full px-4 py-3 pr-20 rounded-xl border-2 smooth-transition outline-none ${
                        field.id === 'freeT'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : getValueStatus(field.id, labData[field.id as keyof LabData])
                      } focus:border-[#3C8CE7] focus:ring-2 focus:ring-[#3C8CE7]/20`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {field.unit}
                    </span>
                  </div>

                  {/* Norm Hint */}
                  <div className="mt-1 text-xs text-gray-500">
                    Норма: {field.norm}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="text-purple-600 mt-0.5" size={20} />
                <div className="flex-1">
                  <div className="mb-1">Автоматический расчет</div>
                  <div className="text-sm text-gray-600">
                    Свободный тестостерон будет рассчитан по формуле Vermeulen на основе общего тестостерона, SHBG и альбумина
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Calculate Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl gradient-blue text-white shadow-xl smooth-transition"
            >
              <Calculator size={20} />
              <span className="text-lg">Рассчитать и перейти к интерпретации</span>
            </motion.button>
          </form>
        </motion.div>

        {/* Demo Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-6 bg-white rounded-xl border border-gray-200"
        >
          <div className="text-center mb-4 text-sm text-gray-600">Или попробуйте готовые сценарии:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Норма', data: { totalT: '22.5', lh: '5.2', fsh: '4.8', shbg: '35', albumin: '43' } },
              { label: 'Функциональный', data: { totalT: '12.3', lh: '4.1', fsh: '3.9', shbg: '42', albumin: '44' } },
              { label: 'Первичный', data: { totalT: '8.5', lh: '15.2', fsh: '18.5', shbg: '38', albumin: '42' } },
              { label: 'Вторичный', data: { totalT: '7.2', lh: '2.1', fsh: '1.8', shbg: '32', albumin: '45' } },
            ].map((scenario, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => setLabData({ ...labData, ...scenario.data, freeT: '' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-[#3C8CE7] smooth-transition text-sm"
              >
                {scenario.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
