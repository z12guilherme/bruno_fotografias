import { useParams } from "react-router-dom";

// Dados de exemplo. Em um projeto real, isso viria de um backend/CMS.
const blogPosts = [
  {
    id: 1,
    title: "Dicas para o seu Ensaio de Casamento",
    image: "https://source.unsplash.com/random/1200x600?wedding,couple,photoshoot",
    excerpt: "Descubra como se preparar para ter as melhores fotos do seu casamento.",
    date: "15 de Julho, 2024",
    content: `
      <p>Preparar-se para o ensaio de casamento é fundamental para garantir fotos incríveis. A primeira dica é escolher um local que tenha significado para o casal. Pode ser onde se conheceram, onde foi o primeiro encontro, ou simplesmente um lugar que ambos amam.</p>
      <p>Outro ponto importante é a roupa. Escolham peças que harmonizem entre si e com o cenário. Cores neutras e pastéis costumam funcionar muito bem. O mais importante é que vocês se sintam confortáveis e bonitos.</p>
      <p>Por fim, relaxem e confiem no fotógrafo! A melhor foto é aquela que captura a espontaneidade e o amor de vocês. Interajam, divirtam-se e deixem a mágica acontecer.</p>
    `
  },
  {
    id: 2,
    title: "A Importância da Fotografia de Família",
    image: "https://source.unsplash.com/random/1200x600?family,photo",
    excerpt: "Por que registrar os momentos em família é tão valioso.",
    date: "10 de Julho, 2024",
    content: `
      <p>A fotografia de família é mais do que um simples registro; é a criação de um legado. Essas imagens se tornam tesouros que passam de geração em geração, contando a história e fortalecendo os laços familiares.</p>
      <p>Em um mundo cada vez mais digital, ter fotos impressas ou em um álbum de qualidade proporciona uma experiência tátil e emocional única. É uma forma de pausar o tempo e reviver momentos preciosos sempre que desejarem.</p>
    `
  },
  {
    id: 3,
    title: "Como Escolher o Fotógrafo Ideal para Seu Evento",
    image: "https://source.unsplash.com/random/1200x600?photographer,event",
    excerpt: "Um guia completo para tomar a melhor decisão.",
    date: "01 de Julho, 2024",
    content: `
      <p>A escolha do fotógrafo é uma das decisões mais importantes no planejamento de um evento. O primeiro passo é pesquisar o portfólio. Veja se o estilo do profissional combina com o que você imagina para suas fotos.</p>
      <p>Depois, agende uma conversa. É essencial que haja uma boa conexão entre vocês. O fotógrafo acompanhará momentos íntimos e importantes, então a confiança e a simpatia são fundamentais.</p>
      <p>Por fim, não se esqueça de verificar o que está incluso no pacote: número de fotos, tratamento, prazo de entrega e se há álbum físico. Alinhar as expectativas é a chave para uma experiência de sucesso.</p>
    `
  },
];

export const BlogPostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = blogPosts.find(p => p.id.toString() === postId);

  if (!post) {
    return <div className="pt-32 text-center">Post não encontrado.</div>;
  }

  return (
    <section className="pt-32 pb-20 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted-foreground mb-8">{post.date}</p>
        <img src={post.image} alt={post.title} className="w-full h-auto rounded-lg shadow-lg mb-8" />
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </section>
  );
};