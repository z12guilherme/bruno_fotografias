import { motion } from "framer-motion";
// 1. Importamos a imagem para que o Vite possa processá-la
// e nos fornecer a URL correta.
import photographerImageUrl from "../assets/bruno.png";

export function SobreSection() {
  return (
    // Usamos `id="sobre"` para que seja possível criar um link de navegação para esta seção
    <section id="sobre" className="container mx-auto px-4 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
          Sobre Mim
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          {/* Coluna do Texto (ocupando 3 de 5 colunas) */}
          <div className="md:col-span-3 text-lg text-gray-600 space-y-6">
            <p>
              Olá! Sou Bruno Nascimento, um fotógrafo apaixonado por capturar
              a essência dos momentos e transformá-los em memórias eternas.
              Minha jornada na fotografia começou como um hobby e rapidamente se
              tornou minha maior paixão e profissão.
            </p>
            <p>
              Com um olhar atento aos detalhes e uma abordagem artística, busco criar
              imagens que não apenas registrem um evento, mas que também contem uma
              história, transmitam emoções e revelem a beleza única de cada pessoa e
              lugar.
            </p>
            <p>
              Seja na sala de parto registrando o primeiro suspiro ou em um ensaio de família, 
              meu objetivo é sempre o mesmo: entregar um trabalho de
              luxo que supere suas expectativas e eternize o milagre da vida.
            </p>
          </div>

          {/* Coluna da Imagem (ocupando 2 de 5 colunas em telas médias/grandes) */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <img
              // 2. Usamos a variável importada no atributo 'src'.
              src={photographerImageUrl}
              alt="Retrato do Fotógrafo Bruno Nascimento"
              className="rounded-lg shadow-2xl object-cover w-full h-auto mx-auto max-w-sm md:max-w-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}