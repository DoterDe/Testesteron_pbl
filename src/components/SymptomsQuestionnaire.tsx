import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  category: 'ADAM' | 'AMS' | 'IIEF' | 'PHQ-9' | 'Sleep';
  question: string;
  options: { value: number; label: string; color: string }[];
}

const questions: Question[] = [
  {
    id: 'adam1',
    category: 'ADAM',
    question: 'Снизилось ли ваше либидо (половое влечение)?',
    options: [
      { value: 0, label: 'Нет', color: 'bg-green-500' },
      { value: 1, label: 'Да', color: 'bg-red-500' },
    ],
  },
  {
    id: 'adam2',
    category: 'ADAM',
    question: 'Чувствуете ли вы недостаток энергии?',
    options: [
      { value: 0, label: 'Нет', color: 'bg-green-500' },
      { value: 1, label: 'Да', color: 'bg-red-500' },
    ],
  },
  {
    id: 'ams1',
    category: 'AMS',
    question: 'Насколько выражено ухудшение общего самочувствия?',
    options: [
      { value: 1, label: 'Нет', color: 'bg-green-500' },
      { value: 2, label: 'Слабое', color: 'bg-yellow-500' },
      { value: 3, label: 'Умеренное', color: 'bg-orange-500' },
      { value: 4, label: 'Сильное', color: 'bg-red-500' },
    ],
  },
  {
    id: 'ams2',
    category: 'AMS',
    question: 'Боли в суставах и мышцах?',
    options: [
      { value: 1, label: 'Нет', color: 'bg-green-500' },
      { value: 2, label: 'Слабые', color: 'bg-yellow-500' },
      { value: 3, label: 'Умеренные', color: 'bg-orange-500' },
      { value: 4, label: 'Сильные', color: 'bg-red-500' },
    ],
  },
  {
    id: 'iief1',
    category: 'IIEF',
    question: 'Как часто вы могли достигать эрекции во время сексуальной активности?',
    options: [
      { value: 5, label: 'Почти всегда', color: 'bg-green-500' },
      { value: 4, label: 'Часто', color: 'bg-yellow-500' },
      { value: 3, label: 'Иногда', color: 'bg-orange-500' },
      { value: 2, label: 'Редко', color: 'bg-red-500' },
      { value: 1, label: 'Почти никогда', color: 'bg-red-600' },
    ],
  },
  {
    id: 'phq1',
    category: 'PHQ-9',
    question: 'Как часто вы испытывали потерю интереса или удовольствия от обычных занятий?',
    options: [
      { value: 0, label: 'Никогда', color: 'bg-green-500' },
      { value: 1, label: 'Несколько дней', color: 'bg-yellow-500' },
      { value: 2, label: 'Более половины дней', color: 'bg-orange-500' },
      { value: 3, label: 'Почти каждый день', color: 'bg-red-500' },
    ],
  },
  {
    id: 'sleep1',
    category: 'Sleep',
    question: 'Качество вашего сна за последний месяц?',
    options: [
      { value: 0, label: 'Отличное', color: 'bg-green-500' },
      { value: 1, label: 'Хорошее', color: 'bg-yellow-500' },
      { value: 2, label: 'Плохое', color: 'bg-orange-500' },
      { value: 3, label: 'Очень плохое', color: 'bg-red-500' },
    ],
  },
];

interface SymptomsQuestionnaireProps {
  onComplete: (answers: Record<string, number>) => void;
}

export function SymptomsQuestionnaire({ onComplete }: SymptomsQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(1);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const isAnswered = answers[question.id] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleNext = () => {
    if (isLastQuestion && isAnswered) {
      onComplete(answers);
    } else if (isAnswered) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl mb-4">Анкета симптомов</h2>
          <p className="text-xl text-gray-600">
            Пожалуйста, ответьте на следующие вопросы для оценки вашего состояния
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Вопрос {currentQuestion + 1} из {questions.length}</span>
            <span className="text-sm text-[#3C8CE7]">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 mb-6">
              <span className="text-sm">{question.category}</span>
            </div>

            {/* Question */}
            <h3 className="text-2xl mb-8">{question.question}</h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-xl border-2 text-left smooth-transition flex items-center justify-between ${
                    answers[question.id] === option.value
                      ? `${option.color} text-white border-transparent shadow-lg`
                      : 'bg-gray-50 border-gray-200 hover:border-[#3C8CE7] hover:bg-gray-100'
                  }`}
                >
                  <span>{option.label}</span>
                  {answers[question.id] === option.value && (
                    <CheckCircle size={24} className="text-white" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            whileHover={{ scale: currentQuestion === 0 ? 1 : 1.05 }}
            whileTap={{ scale: currentQuestion === 0 ? 1 : 0.95 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl smooth-transition ${
              currentQuestion === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#3C8CE7] shadow-lg'
            }`}
          >
            <ChevronLeft size={20} />
            <span>Назад</span>
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!isAnswered}
            whileHover={{ scale: isAnswered ? 1.05 : 1 }}
            whileTap={{ scale: isAnswered ? 0.95 : 1 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl smooth-transition ${
              isAnswered
                ? 'gradient-blue text-white shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{isLastQuestion ? 'Завершить' : 'Следующий'}</span>
            {!isLastQuestion && <ChevronRight size={20} />}
            {isLastQuestion && <CheckCircle size={20} />}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
