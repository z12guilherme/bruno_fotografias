import heroImage from "@/assets/hero-casamento.jpg";

export const Hero = () => {
  return (
    <section id="inicio" className="relative h-screen w-full">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Fotografia de Casamento Profissional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Capturando Momentos
            <span className="block text-primary mt-2">Inesquecíveis</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Fotografia profissional que transforma seus momentos especiais em memórias eternas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#portfolio"
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              Ver Portfólio
            </a>
            <a
              href="#contato"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-md hover:bg-white/20 transition-all border border-white/20"
            >
              Entre em Contato
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
