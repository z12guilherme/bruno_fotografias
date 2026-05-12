import bruno from '@/assets/bruno.png';
import { HomepageContent } from '@/hooks/useHomepageContent';

interface QuemSouProps {
  isDarkMode: boolean;
  content: HomepageContent['about'];
}

export function QuemSou({ isDarkMode, content }: QuemSouProps) {
  return (
    <section id="sobre" className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 tracking-widest uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {content.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Coluna Esquerda: Textos */}
          <div className={`space-y-6 text-lg leading-relaxed text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <p>{content.bio1}</p>
            {content.bio2 && <p>{content.bio2}</p>}
            {content.bio3 && <p>{content.bio3}</p>}
          </div>
          {/* Coluna Direita: Imagem do fotógrafo */}
          <div className="flex justify-center md:justify-end">
            <img
              src={content.photographerImageUrl || bruno}
              alt="Bruno Nascimento"
              className="object-cover rounded-sm w-full max-w-sm shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
