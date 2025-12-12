import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center gradient-primary"
    >
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-24 h-24 rounded-2xl gradient-success flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <Activity size={48} className="text-white" />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl text-white mb-3">TestoCheck</h2>
          <p className="text-white/80 mb-6">Загрузка платформы...</p>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-white"
            />
          </div>
        </motion.div>

        {/* Dots Animation */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-white"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
