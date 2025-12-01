import { Link } from "react-router-dom";

// 1. Importamos cada imagem para que o Vite possa processá-las.
import imgCasamento from '@/assets/portfolio-casamento.jpg';
import imgFamilia from '@/assets/portfolio-family.jpg';
import imgBatizados from '@/assets/portfolio-batismo.jpg';
import imgEventos from '@/assets/portfolio-event.jpg';

export const HomePage = () => {
  const categories = [
    // 2. Usamos as variáveis importadas em vez dos caminhos de texto.
    { id: "casamentos", title: "Casamentos", image: imgCasamento},
    { id: "familia", title: "Família", image: imgFamilia},
    { id: "batizados", title: "Batizados", image: imgBatizados },
    { id: "eventos", title: "Eventos", image: imgEventos },
  ];

  return (
    <main> {/* Removemos o pt-20 que estava empurrando o conteúdo para baixo */}
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