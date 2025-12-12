import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { ExportButton } from './ExportButton';

interface ResultsDashboardProps {
  scenario: string;
}

const scenarioData: Record<string, any> = {
  normal: {
    freeT: 280,
    totalT: 22.5,
    lh: 5.2,
    fsh: 4.8,
    status: 'normal',
    statusText: 'Норма',
    statusColor: 'text-green-700',
    statusBg: 'bg-green-100',
    recommendation: 'Поддерживайте здоровый образ жизни',
    hypogonadismType: 'Отсутствует',
    typeColor: 'bg-green-500',
  },
  functional: {
    freeT: 180,
    totalT: 12.3,
    lh: 4.1,
    fsh: 3.9,
    status: 'warning',
    statusText: 'Функциональный',
    statusColor: 'text-yellow-700',
    statusBg: 'bg-yellow-100',
    recommendation: 'Коррекция образа жизни, снижение веса',
    hypogonadismType: 'Функциональный гипогонадизм',
    typeColor: 'bg-yellow-500',
  },
  primary: {
    freeT: 120,
    totalT: 8.5,
    lh: 15.2,
    fsh: 18.5,
    status: 'critical',
    statusText: 'Первичный',
    statusColor: 'text-red-700',
    statusBg: 'bg-red-100',
    recommendation: 'Консультация эндокринолога, рассмотреть ТЗТ',
    hypogonadismType: 'Первичный гипогонадизм',
    typeColor: 'bg-red-500',
  },
  secondary: {
    freeT: 110,
    totalT: 7.2,
    lh: 2.1,
    fsh: 1.8,
    status: 'critical',
    statusText: 'Вторичный',
    statusColor: 'text-orange-700',
    statusBg: 'bg-orange-100',
    recommendation: 'МРТ гипофиза, консультация эндокринолога',
    hypogonadismType: 'Вторичный гипогонадизм',
    typeColor: 'bg-orange-500',
  },
};

const testosteroneTrend = [
  { month: 'Янв', value: 300, normal: 225 },
  { month: 'Фев', value: 285, normal: 225 },
  { month: 'Мар', value: 275, normal: 225 },
  { month: 'Апр', value: 260, normal: 225 },
  { month: 'Май', value: 250, normal: 225 },
  { month: 'Июн', value: 240, normal: 225 },
];

const hormoneLevels = [
  { name: 'Общий T', value: 22.5, norm: 12, unit: 'нмоль/л' },
  { name: 'Свободный T', value: 280, norm: 225, unit: 'пг/мл' },
  { name: 'ЛГ', value: 5.2, norm: 5.4, unit: 'МЕ/л' },
  { name: 'ФСГ', value: 4.8, norm: 9.8, unit: 'МЕ/л' },
];

export function ResultsDashboard({ scenario = 'normal' }: ResultsDashboardProps) {
  const data = scenarioData[scenario] || scenarioData.normal;

  // Update hormone levels based on scenario
  const updatedHormoneLevels = [
    { name: 'Общий T', value: data.totalT, norm: 12, unit: 'нмоль/л' },
    { name: 'Свободный T', value: data.freeT, norm: 225, unit: 'пг/мл' },
    { name: 'ЛГ', value: data.lh, norm: 5.4, unit: 'МЕ/л' },
    { name: 'ФСГ', value: data.fsh, norm: 9.8, unit: 'МЕ/л' },
  ];

  // Update trend data based on current scenario
  const updatedTrend = testosteroneTrend.map((point, index) => ({
    ...point,
    value: data.freeT + (index - 5) * 10,
  }));

  const getBarColor = (value: number, norm: number) => {
    if (value >= norm) return '#27AE60';
    if (value >= norm * 0.7) return '#F39C12';
    return '#E74C3C';
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 mb-4">
            <Activity size={20} />
            <span className="text-sm">Результаты анализа</span>
          </div>
          <h2 className="text-4xl mb-4">Дашборд результатов</h2>
          <p className="text-xl text-gray-600">
            Комплексная оценка гормонального статуса
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className={`mb-8 p-6 rounded-2xl shadow-xl border-2 ${data.statusBg} border-current`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl ${data.typeColor} flex items-center justify-center`}>
                {data.status === 'normal' ? (
                  <CheckCircle size={32} className="text-white" />
                ) : data.status === 'warning' ? (
                  <TrendingDown size={32} className="text-white" />
                ) : (
                  <AlertCircle size={32} className="text-white" />
                )}
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Статус</div>
                <div className={`text-2xl ${data.statusColor}`}>{data.statusText}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Тип</div>
              <div className={`text-xl ${data.statusColor}`}>{data.hypogonadismType}</div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Free Testosterone Trend */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Динамика свободного тестостерона</h3>
              <TrendingUp className="text-[#3C8CE7]" size={24} />
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={updatedTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
                <ReferenceLine y={225} stroke="#27AE60" strokeDasharray="3 3" label="Норма" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#3C8CE7', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0D1F3C" />
                    <stop offset="100%" stopColor="#3C8CE7" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-700">
                <span className="">Текущий уровень:</span>
                <span className={`ml-2 ${data.freeT >= 225 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.freeT} пг/мл
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hormone Levels Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Уровни гормонов</h3>
              <Activity className="text-purple-600" size={24} />
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={updatedHormoneLevels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value} ${props.payload.unit}`,
                    'Значение',
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  radius={[8, 8, 0, 0]}
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    const color = getBarColor(payload.value, payload.norm);
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={color}
                        rx={8}
                        ry={8}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#27AE60]" />
                <span className="text-gray-600">Норма</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#F39C12]" />
                <span className="text-gray-600">Снижен</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#E74C3C]" />
                <span className="text-gray-600">Критично</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommendation Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${data.typeColor} flex items-center justify-center flex-shrink-0`}>
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl mb-3">Рекомендации</h3>
              <p className="text-gray-700 mb-4">{data.recommendation}</p>
              
              {scenario === 'functional' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Снижение веса на 5-10%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Улучшение качества сна (7-9 часов)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Регулярная физическая активность</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Управление стрессом</span>
                  </div>
                </div>
              )}

              {(scenario === 'primary' || scenario === 'secondary') && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Консультация эндокринолога в течение 1-2 недель</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Дополнительные обследования (МРТ, УЗИ)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Рассмотрение тестостерон-заместительной терапии</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Export Button */}
        <div className="text-right mt-8">
          <ExportButton />
        </div>
      </div>
    </section>
  );
}