export const AuthorialPage = () => {
  const authorialItems = [
    { id: 1, image: "https://source.unsplash.com/random/800x600?urban,street-photography", title: "Ensaio Urbano" },
    { id: 2, image: "https://source.unsplash.com/random/600x800?portrait,black-and-white", title: "Retratos em Preto e Branco" },
    { id: 3, image: "https://source.unsplash.com/random/800x600?abstract,nature", title: "Natureza Abstrata" },
    { id: 4, image: "https://source.unsplash.com/random/800x600?city,lights", title: "Luzes da Cidade" },
    { id: 5, image: "https://source.unsplash.com/random/600x800?minimalism,architecture", title: "Minimalismo" },
    { id: 6, image: "https://source.unsplash.com/random/800x600?street,poetry", title: "Cotidiano Poético" },
  ];

  return (
    <section id="autoral" className="pt-32 pb-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trabalho <span className="text-primary">Autoral</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma coleção de projetos pessoais que exploram minha visão artística.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {authorialItems.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <img src={item.image} alt={item.title} className="w-full h-auto object-cover rounded-lg shadow-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};