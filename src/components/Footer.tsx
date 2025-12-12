import { motion } from 'motion/react';
import { ExternalLink, Shield, BookOpen, Award } from 'lucide-react';

export function Footer() {
  const links = {
    scientific: [
      { name: 'Harvard Medical School', url: '#' },
      { name: 'Endocrine Society Guidelines', url: '#' },
      { name: 'EAU Guidelines', url: '#' },
      { name: 'AUA Clinical Guidelines', url: '#' },
    ],
    regulatory: [
      { name: 'FDA Guidance', url: '#' },
      { name: 'ISO 13485 Certification', url: '#' },
      { name: 'CE/MDR Compliance', url: '#' },
      { name: 'HIPAA & GDPR', url: '#' },
    ],
    publications: [
      { name: 'Vermeulen et al. (1999)', url: '#' },
      { name: 'Corona et al. (2021)', url: '#' },
      { name: 'Bhasin et al. (2018)', url: '#' },
      { name: 'Wu et al. (2010)', url: '#' },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Scientific References */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-[#3C8CE7]" />
              <h3 className="text-lg">Научные источники</h3>
            </div>
            <ul className="space-y-3">
              {links.scientific.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="smooth-transition"
                >
                  <a
                    href={link.url}
                    className="text-sm text-gray-600 hover:text-[#3C8CE7] flex items-center gap-2 group"
                  >
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 smooth-transition" />
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Regulatory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-[#3C8CE7]" />
              <h3 className="text-lg">Регуляторное соответствие</h3>
            </div>
            <ul className="space-y-3">
              {links.regulatory.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="smooth-transition"
                >
                  <a
                    href={link.url}
                    className="text-sm text-gray-600 hover:text-[#3C8CE7] flex items-center gap-2 group"
                  >
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 smooth-transition" />
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Publications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} className="text-[#3C8CE7]" />
              <h3 className="text-lg">Ключевые публикации</h3>
            </div>
            <ul className="space-y-3">
              {links.publications.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="smooth-transition"
                >
                  <a
                    href={link.url}
                    className="text-sm text-gray-600 hover:text-[#3C8CE7] flex items-center gap-2 group"
                  >
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 smooth-transition" />
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-300 pt-8"
        >
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-start gap-3">
              <Shield className="text-orange-600 mt-0.5 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h4 className="text-lg mb-2 text-orange-900">Важное уведомление</h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  <strong>Это демо-платформа для демонстрации концепции.</strong> Данный инструмент не заменяет консультацию с квалифицированным медицинским специалистом. 
                  Все решения о диагностике и лечении должны приниматься только врачом на основании полного клинического обследования.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Платформа разработана как Software as Medical Device (SaМD) категории Clinical Decision Support (CDS) 
                  в соответствии с требованиями FDA, EMA/MDR, ISO 13485, HIPAA и GDPR.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-8 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          {/* Logo and Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white text-sm">T+</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2025 TestoCheck. Демо-платформа.
            </div>
          </div>

          {/* Certification Badges */}
          <div className="flex items-center gap-4">
            {['ISO 13485', 'CE/MDR', 'HIPAA', 'GDPR'].map((cert, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm"
              >
                <span className="text-xs text-gray-700">{cert}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
