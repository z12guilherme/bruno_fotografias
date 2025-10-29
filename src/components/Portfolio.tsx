import familyImg from "@/assets/portfolio-family.jpg";
import eventImg from "@/assets/portfolio-event.jpg";
import portraitImg from "@/assets/portfolio-portrait.jpg";
import kidsImg from "@/assets/portfolio-kids.jpg";
import maternityImg from "@/assets/portfolio-maternity.jpg";
import heroImg from "@/assets/hero-wedding.jpg";

export const Portfolio = () => {
  const portfolioItems = [
    {
      id: 1,
      image: heroImg,
      title: "Casamentos",
      category: "Casamentos",
    },
    {
      id: 2,
      image: familyImg,
      title: "Família",
      category: "Família",
    },
    {
      id: 3,
      image: eventImg,
      title: "Eventos",
      category: "Eventos",
    },
    {
      id: 4,
      image: portraitImg,
      title: "Retratos",
      category: "Retratos",
    },
    {
      id: 5,
      image: kidsImg,
      title: "Infantil",
      category: "Infantil",
    },
    {
      id: 6,
      image: maternityImg,
      title: "Gestante",
      category: "Gestante",
    },
  ];

  return (
    <section id="portfolio" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meu <span className="text-primary">Portfólio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore alguns dos momentos especiais que tive o prazer de capturar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-primary text-sm font-semibold mb-1">{item.category}</p>
                  <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
