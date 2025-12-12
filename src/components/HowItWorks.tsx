import { ClipboardList, Beaker, Brain, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';

export function HowItWorks() {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Симптомы',
      description: 'Комплексная оценка симптомов по валидированным опросникам ADAM, AMS, IIEF, PHQ-9',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Beaker,
      title: 'Лабораторные данные',
      description: 'Анализ общего и свободного тестостерона, ЛГ, ФСГ, SHBG с автокалькулятором',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Brain,
      title: 'Алгоритм',
      description: 'Дифференциация возрастного и патологического снижения тестостерона',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: FileCheck,
      title: 'Рекомендации',
      description: 'Персонализированные рекомендации по образу жизни и медицинским вмешательствам',
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl mb-4">Как это работает</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Научно обоснованный подход к диагностике и дифференциации гипогонадизма
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="relative group"
            >
              {/* Card */}
              <div className="h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl smooth-transition border border-gray-100">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition`}>
                  <step.icon size={32} className="text-white" />
                </div>

                {/* Step Number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-sm text-gray-600">{index + 1}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl mb-3">{step.title}</h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="text-gray-600 text-sm leading-relaxed"
                >
                  {step.description}
                </motion.p>

                {/* Hover Gradient Border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 smooth-transition -z-10`} />
              </div>

              {/* Arrow Connector (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 -translate-y-1/2 z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rotate-45 translate-x-1" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
