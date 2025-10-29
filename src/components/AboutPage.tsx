import { Camera, Award, Heart, Users } from "lucide-react";

export const AboutPage = () => {
  const features = [
    {
      icon: Camera,
      title: "Equipamento Premium",
      description: "Utilizamos equipamentos de última geração para garantir a melhor qualidade",
    },
    {
      icon: Award,
      title: "Profissional Certificado",
      description: "Anos de experiência e reconhecimento no mercado fotográfico",
    },
    {
      icon: Heart,
      title: "Paixão pelo Detalhe",
      description: "Cada foto é tratada com cuidado e atenção aos mínimos detalhes",
    },
    {
      icon: Users,
      title: "Clientes Satisfeitos",
      description: "Centenas de famílias e casais felizes com nosso trabalho",
    },
  ];

  return (
    <section id="sobre" className="pt-32 pb-20 px-4 bg-card">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre <span className="text-primary">Mim</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sou apaixonado por capturar os momentos mais especiais da vida. Com mais de 10 anos de experiência, 
            meu objetivo é transformar cada sessão em uma experiência única e memorável.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center p-6 rounded-lg bg-secondary/50 hover:bg-secondary transition-all hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};