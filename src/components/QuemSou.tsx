import bruno from '@/assets/bruno.png';
import premiacao from '@/assets/premiacao.png';

interface QuemSouProps {
  isDarkMode: boolean;
}

export function QuemSou({ isDarkMode }: QuemSouProps) {
  return (
    <section id="sobre" className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 tracking-widest uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          QUEM SOU?
        </h2>

        <div className="space-y-16">
          {/* Seção Superior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Coluna Esquerda: Texto */}
            <div className={`space-y-6 text-lg leading-relaxed text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                Sou Bruno Nascimento, fotógrafo de partos, e há 2 anos vivo o propósito de eternizar nascimentos cheios de amor, força e significado. Já registrei mais de 100 partos, sempre com sensibilidade, respeito e olhar atento aos detalhes que tornam cada história única.
              </p>
              <p>
                Em 2025, tive o privilégio de ser premiado internacionalmente com uma fotografia pela Outstanding Maternity Award, um reconhecimento que reforça minha credibilidade e a essência do meu trabalho.
              </p>
            </div>
            {/* Coluna Direita: Imagem do fotógrafo */}
            <div className="flex justify-center md:justify-end">
              <img
                src={bruno}
                alt="Bruno Nascimento"
                className="object-cover rounded-sm w-full max-w-sm shadow-lg"
              />
            </div>
          </div>

          {/* Seção Inferior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Coluna Esquerda: Imagem do prêmio */}
            <div className="flex justify-center md:justify-start">
              <img
                src={premiacao}
                alt="Prêmio Outstanding Maternity Award"
                className="object-cover rounded-sm w-full max-w-sm shadow-lg"
              />
            </div>
            {/* Coluna Direita: Texto */}
            <div className={`space-y-6 text-lg leading-relaxed text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                Cada parto é único e exige respeito absoluto. Meu compromisso é atuar de forma ética, discreta e responsável, sempre em harmonia com a equipe de saúde e os protocolos do ambiente cirúrgico ou da sala de parto, preservando a essência desse momento tão especial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
