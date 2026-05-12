import { motion } from 'framer-motion';
import { Camera, Clock, Award } from 'lucide-react';

interface StatsProps {
  isDarkMode: boolean;
  stats: {
    partos: number;
    anosExperiencia: number;
    premios: number;
  };
}

export function Stats({ isDarkMode, stats }: StatsProps) {
  const items = [
    {
      label: 'Partos Registrados',
      value: stats.partos,
      icon: <Camera className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />,
      suffix: '+'
    },
    {
      label: 'Anos de Experiência',
      value: stats.anosExperiencia,
      icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />,
      suffix: ''
    },
    {
      label: 'Prêmios Recebidos',
      value: stats.premios,
      icon: <Award className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />,
      suffix: ''
    }
  ];

  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-y ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className="container mx-auto px-2 md:px-6">
        <div className="grid grid-cols-3 gap-2 md:gap-12 text-center">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="space-y-2 md:space-y-4"
            >
              <div className="flex justify-center">{item.icon}</div>
              <div>
                <span className={`text-2xl md:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.value}{item.suffix}
                </span>
                <p className={`mt-1 md:mt-2 uppercase tracking-normal md:tracking-widest text-[10px] sm:text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
