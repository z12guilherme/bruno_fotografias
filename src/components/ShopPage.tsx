export const ShopPage = () => {
  const shopItems = [
    { id: 1, image: "https://source.unsplash.com/random/600x600?photography,prints", title: "Impressão Fine Art", price: "R$ 150,00" },
    { id: 2, image: "https://source.unsplash.com/random/600x600?camera,presets", title: "Presets para Lightroom", price: "R$ 200,00" },
    { id: 3, image: "https://source.unsplash.com/random/600x600?fine-art,print", title: "Impressão Canvas", price: "R$ 180,00" },
    { id: 4, image: "https://source.unsplash.com/random/600x600?photo,album", title: "Álbum de Fotos", price: "R$ 250,00" },
    { id: 5, image: "https://source.unsplash.com/random/600x600?camera,gear", title: "Guia de Equipamentos", price: "R$ 120,00" },
    { id: 6, image: "https://source.unsplash.com/random/600x600?editing,lightroom", title: "Workshop de Edição", price: "R$ 300,00" },
  ];

  return (
    <section id="loja" className="pt-32 pb-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nossa <span className="text-primary">Loja</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Adquira presets, impressões e outros produtos exclusivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shopItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg cursor-pointer">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover aspect-square" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                <p className="text-primary text-lg font-semibold">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};