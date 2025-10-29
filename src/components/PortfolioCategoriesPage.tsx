import { Link } from "react-router-dom";

export const PortfolioCategoriesPage = () => {
  // Para colocar suas próprias imagens, substitua as URLs abaixo.
  // O ideal é importar as imagens do seu projeto, como:
  // import imgCasamento from '@/assets/casamento.jpg';
  // E depois usar a variável: image: imgCasamento
  const categories = [
    {
      id: "casamentos",
      title: "Casamentos",
      image: "src/assets/portfolio-casamento.jpg", // Onde colocar a imagem para "Casamentos"
      description: "A celebração do amor em momentos inesquecíveis.",
    },
    {
      id: "familia",
      title: "Família",
      image: "src/assets/portfolio-family.jpg", // Onde colocar a imagem para "Família"
      description: "Capture a essência e o amor da sua família.",
    },
    {
      id: "batizados",
      title: "Batizados",
      image: "src/assets/portfolio-batismo.jpg", // Onde colocar a imagem para "Batizados"
      description: "A celebração da fé e da família em momentos sagrados.",
    },
    {
      id: "eventos",
      title: "Eventos",
      image: "src/assets/portfolio-event.jpg", // Onde colocar a imagem para "Eventos"
      description: "Cobertura completa para seus eventos especiais.",
    },
  ];

  return (
    <section id="portfolio-categorias" className="pt-32 pb-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nosso <span className="text-primary">Portfólio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore nossas categorias e descubra a beleza em cada clique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} to={`/portfolio/${category.id}`}>
              <div className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};