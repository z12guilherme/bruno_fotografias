import { Link } from "react-router-dom";

export const HomePage = () => {
  // Para colocar suas próprias imagens, substitua as URLs abaixo.
  // O ideal é importar as imagens do seu projeto, como:
  // import imgCasamento from '@/assets/casamento.jpg';
  // E depois usar a variável: image: imgCasamento
  const categories = [
    // Onde colocar a imagem para a categoria "Casamentos"
    { id: "casamentos", title: "Casamentos", image: "src/assets/portfolio-casamento.jpg"},
    // Onde colocar a imagem para a categoria "Família"
    { id: "familia", title: "Família", image: "src/assets/portfolio-family.jpg"},
    // Onde colocar a imagem para a categoria "Batizados"
    { id: "batizados", title: "Batizados", image: "src/assets/portfolio-batismo.jpg" },
    // Onde colocar a imagem para a categoria "Eventos"
    { id: "eventos", title: "Eventos", image: "src/assets/portfolio-event.jpg" },
  ];

  return (
    <main className="pt-20"> {/* pt-20 to offset the fixed header */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/portfolio/${category.id}`}
            className="group relative block h-[50vh] lg:h-screen overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="relative h-full flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-4xl font-bold tracking-wider uppercase">
                {category.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};