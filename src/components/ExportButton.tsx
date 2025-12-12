import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, CheckCircle } from 'lucide-react';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      
      // Reset after showing success
      setTimeout(() => {
        setExportComplete(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleExport}
        disabled={isExporting || exportComplete}
        whileHover={{ scale: isExporting || exportComplete ? 1 : 1.05 }}
        whileTap={{ scale: isExporting || exportComplete ? 1 : 0.95 }}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl smooth-transition ${
          exportComplete
            ? 'bg-green-500 text-white'
            : 'gradient-blue text-white shadow-lg'
        } ${isExporting ? 'opacity-70 cursor-wait' : ''}`}
      >
        {isExporting && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Download size={20} />
          </motion.div>
        )}
        {!isExporting && !exportComplete && <FileText size={20} />}
        {exportComplete && <CheckCircle size={20} />}
        
        <span>
          {isExporting && 'Генерация отчета...'}
          {!isExporting && !exportComplete && 'Экспорт PDF'}
          {exportComplete && 'Готово!'}
        </span>
      </motion.button>

      {/* Export overlay animation */}
      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full gradient-blue flex items-center justify-center"
                >
                  <Download size={32} className="text-white" />
                </motion.div>
                
                <h3 className="text-2xl mb-2">Генерация PDF отчета</h3>
                <p className="text-gray-600 mb-4">
                  Формирование персонализированного медицинского отчета...
                </p>
                
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    className="h-full gradient-blue"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
