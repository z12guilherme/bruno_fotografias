import Masonry from "react-masonry-css";

const portfolioImages = [
  // Adicione as URLs das suas imagens aqui
  "/portfolio/1.jpg",
  "/portfolio/2.jpg",
  "/portfolio/3.jpg",
  "/portfolio/4.jpg",
  "/portfolio/5.jpg",
  "/portfolio/6.jpg",
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-12">Portfólio</h2>
      {/* O componente Masonry será adicionado aqui */}
    </section>
  );
};