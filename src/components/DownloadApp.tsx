import { motion } from "framer-motion";
import { Download, Share, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

export function DownloadApp() {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detecção simples para verificar se é dispositivo iOS
    const checkIsIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(checkIsIOS);
  }, []);

  return (
    <section id="download" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
            Leve o Portfólio com Você
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Tenha acesso rápido e exclusivo às suas galerias e ao meu portfólio diretamente do seu celular.
            Uma experiência otimizada para você.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Cartão Android */}
            <motion.div
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center transition-all ${isIOS ? 'opacity-60 grayscale' : 'opacity-100'}`}
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                <Smartphone size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Android</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm flex-grow">
                Baixe o aplicativo oficial (APK) e instale diretamente no seu dispositivo para a melhor performance.
              </p>
              <a
                href="/bruno-fotografias.apk"
                download="bruno-fotografias.apk"
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Download size={20} />
                Baixar App (APK)
              </a>
            </motion.div>

            {/* Cartão iOS / PWA */}
            <motion.div
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center transition-all ${!isIOS ? 'opacity-90' : 'ring-2 ring-blue-500'}`}
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <Share size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">iPhone (iOS)</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm flex-grow">
                A Apple não permite instalação direta de arquivos. Use a versão Web App (PWA) para a mesma experiência nativa.
              </p>
              
              <div className="w-full bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-left text-sm">
                <p className="font-semibold mb-2 text-gray-800 dark:text-white">Como instalar:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Toque no botão <span className="font-bold">Compartilhar</span> <Share size={14} className="inline" /></li>
                  <li>Role para baixo no menu</li>
                  <li>Selecione <span className="font-bold">Adicionar à Tela de Início</span></li>
                </ol>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}