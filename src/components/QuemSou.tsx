import bruno from '@/assets/bruno.png';
// Caso não tenha a imagem local ainda, usamos uma URL externa para não quebrar o build
// import premiacao from '@/assets/premiacao.png'; 
const premiacao = "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop";

export function QuemSou() {
  return (
    <section id="sobre" className="py-20 bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap');
      `}</style>
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-widest uppercase text-gray-900">
          QUEM SOU?
        </h2>

        <div className="space-y-16">
          {/* Seção Superior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Coluna Esquerda: Texto */}
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed text-left">
              <p>
                Sou Bruno Nascimento, fotógrafo de partos, e há 2 anos vivo o propósito de eternizar nascimentos cheios de amor, força e significado. Já registrei mais de 100 partos, sempre com sensibilidade, respeito e olhar atento aos detalhes que tornam cada história única.
              </p>
              <p>
                Em 2025, tive o privilégio de ser premiado internacionalmente com uma fotografia pela Outstanding Maternity Award, um reconhecimento que reforça a credibilidade e a essência do meu trabalho.
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
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed text-left">
              <p>
                Cada parto é único e exige respeito absoluto. Meu compromisso é atuar de forma ética, discreta e responsável, sempre em harmonia com a equipe de saúde e os protocolos do ambiente cirúrgico ou da sala de parto, preservando a essência desse momento tão especial.
              </p>
              <p>
                Leia atentamente as informações abaixo, onde estão descritos os detalhes dos pacotes e serviços.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}