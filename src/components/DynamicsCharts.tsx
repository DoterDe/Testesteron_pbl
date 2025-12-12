import { motion } from 'motion/react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Weight, Moon, Activity } from 'lucide-react';

const testosteroneData = [
  { month: 'Янв', value: 280, baseline: 225 },
  { month: 'Фев', value: 275, baseline: 225 },
  { month: 'Мар', value: 268, baseline: 225 },
  { month: 'Апр', value: 260, baseline: 225 },
  { month: 'Май', value: 255, baseline: 225 },
  { month: 'Июн', value: 250, baseline: 225 },
];

const weightData = [
  { month: 'Янв', weight: 92, target: 85 },
  { month: 'Фев', weight: 91, target: 85 },
  { month: 'Мар', weight: 89.5, target: 85 },
  { month: 'Апр', weight: 88, target: 85 },
  { month: 'Май', weight: 86.5, target: 85 },
  { month: 'Июн', weight: 85.2, target: 85 },
];

const sleepData = [
  { day: 'Пн', hours: 6.5, target: 7.5 },
  { day: 'Вт', hours: 7, target: 7.5 },
  { day: 'Ср', hours: 6, target: 7.5 },
  { day: 'Чт', hours: 7.5, target: 7.5 },
  { day: 'Пт', hours: 8, target: 7.5 },
  { day: 'Сб', hours: 8.5, target: 7.5 },
  { day: 'Вс', hours: 8, target: 7.5 },
];

const activityData = [
  { day: 'Пн', steps: 8500, target: 8000 },
  { day: 'Вт', steps: 9200, target: 8000 },
  { day: 'Ср', steps: 7800, target: 8000 },
  { day: 'Чт', steps: 10500, target: 8000 },
  { day: 'Пт', steps: 9800, target: 8000 },
  { day: 'Сб', steps: 11200, target: 8000 },
  { day: 'Вс', steps: 8900, target: 8000 },
];

export function DynamicsCharts() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-200">
          <p className="text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span>{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 mb-4">
            <TrendingUp size={20} />
            <span className="text-sm">Динамика показателей</span>
          </div>
          <h2 className="text-4xl mb-4">Графики прогресса</h2>
          <p className="text-xl text-gray-600">
            Отслеживание ключевых метрик для оценки эффективности вмешательств
          </p>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Testosterone Trend */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg">Свободный тестостерон</h3>
                  <p className="text-sm text-gray-500">Динамика за 6 месяцев</p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={testosteroneData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3C8CE7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3C8CE7" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={225} stroke="#27AE60" strokeDasharray="3 3" label="Норма" />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3C8CE7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Текущий: 250 пг/мл</span>
                <span className="text-blue-600">↓ 10.7% за период</span>
              </div>
            </div>
          </motion.div>

          {/* Weight Trend */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-success flex items-center justify-center">
                  <Weight size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg">Динамика веса</h3>
                  <p className="text-sm text-gray-500">Программа снижения веса</p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" domain={[80, 95]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={85} stroke="#27AE60" strokeDasharray="3 3" label="Цель" />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#27AE60"
                  strokeWidth={3}
                  dot={{ fill: '#27AE60', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Текущий: 85.2 кг</span>
                <span className="text-green-600">↓ 7.4% достигнуто</span>
              </div>
            </div>
          </motion.div>

          {/* Sleep Quality */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Moon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg">Качество сна</h3>
                  <p className="text-sm text-gray-500">Последняя неделя</p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={sleepData}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" domain={[5, 9]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={7.5} stroke="#27AE60" strokeDasharray="3 3" label="Цель" />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#9333ea"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSleep)"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Средний сон: 7.4 часа</span>
                <span className="text-purple-600">98% от цели</span>
              </div>
            </div>
          </motion.div>

          {/* Activity/Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Activity size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg">Физическая активность</h3>
                  <p className="text-sm text-gray-500">Шаги за неделю</p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={8000} stroke="#27AE60" strokeDasharray="3 3" label="Цель" />
                <Line
                  type="monotone"
                  dataKey="steps"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Средние шаги: 9,414</span>
                <span className="text-orange-600">↑ 118% от цели</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center flex-shrink-0">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl mb-3">Анализ прогресса</h3>
              <p className="text-gray-700 mb-4">
                За последние 6 месяцев наблюдается позитивная динамика по всем ключевым показателям образа жизни.
                Снижение веса на 7.4% коррелирует с улучшением качества сна и увеличением физической активности.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Вес</div>
                  <div className="text-lg text-green-600">↓ 7.4%</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Сон</div>
                  <div className="text-lg text-purple-600">↑ 23%</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Активность</div>
                  <div className="text-lg text-orange-600">↑ 18%</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Общий прогресс</div>
                  <div className="text-lg text-blue-600">Отлично</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
