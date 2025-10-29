export const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Dicas para o seu Ensaio de Casamento",
      image: "https://source.unsplash.com/random/600x400?wedding,couple,photoshoot",
      excerpt: "Descubra como se preparar para ter as melhores fotos do seu casamento.",
      date: "15 de Julho, 2024",
    },
    {
      id: 2,
      title: "A Importância da Fotografia de Família",
      image: "https://source.unsplash.com/random/600x400?family,photo",
      excerpt: "Por que registrar os momentos em família é tão valioso.",
      date: "10 de Julho, 2024",
    },
    {
      id: 3,
      title: "Como Escolher o Fotógrafo Ideal para Seu Evento",
      image: "https://source.unsplash.com/random/600x400?photographer,event",
      excerpt: "Um guia completo para tomar a melhor decisão.",
      date: "01 de Julho, 2024",
    },
  ];

  return (
    <section id="blog" className="pt-32 pb-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nosso <span className="text-primary">Blog</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Artigos, dicas e histórias do mundo da fotografia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-card rounded-lg shadow-lg overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                <p className="text-xs text-gray-500">{post.date}</p>
                {/* <a href="#" className="text-primary hover:underline mt-4 inline-block">Leia Mais</a> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};