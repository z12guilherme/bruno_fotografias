import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Instagram, Mail, ChevronDown, Camera, Lock, Sun, Moon } from 'lucide-react';
import capaBg from '@/assets/Capa.jpg';

import logo from '@/assets/logo_sem_fundo.png';
import { QuemSou } from './components/QuemSou';
import { Stats } from './components/Stats';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { Loader2 } from 'lucide-react';

import portfolio1 from "@/assets/portfolio1.jpg";
import portfolio2 from "@/assets/portfolio2.jpg";
import portfolio3 from "@/assets/portfolio3.png";
import portfolio4 from "@/assets/portfolio4.jpg";
import portfolio5 from "@/assets/portfolio5.jpg";
import portfolio6 from "@/assets/portfolio6.jpg";
import portfolio7 from "@/assets/portfolio7.jpg";
import portfolio8 from "@/assets/portfolio8.jpg";
import portfolio9 from "@/assets/portfolio9.jpg";

export function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isPreview = queryParams.get('preview') === 'true';
  const { content, loading } = useHomepageContent(isPreview);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Fallback images if none in database
  const defaultPortfolioImages = [
    portfolio1, portfolio2, portfolio3, portfolio4, portfolio5,
    portfolio6, portfolio7, portfolio8, portfolio9,
  ];

  const portfolioImages = content.portfolio.imageUrls.length > 0
    ? content.portfolio.imageUrls
    : defaultPortfolioImages;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
      </div>
    );
  }

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'hero':
        return (
          <section id="hero" key="hero" className="relative h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
              style={{ backgroundImage: `url(${content.hero.backgroundImageUrl || capaBg})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
              >
                Bruno Fotografia de Nascimento
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl font-light text-gray-200 mb-8"
              >
                {content.hero.subtitle}
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => scrollToSection('portfolio')}
                className="px-8 py-3 border-2 border-amber-600 text-white hover:bg-amber-600 transition-all duration-300 rounded uppercase text-sm tracking-widest font-semibold"
              >
                {content.hero.ctaText}
              </motion.button>
            </div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50"
            >
              <ChevronDown size={32} />
            </motion.div>
          </section>
        );

      case 'about':
        return <QuemSou key="about" isDarkMode={isDarkMode} content={content.about} />;

      case 'stats':
        return <Stats key="stats" isDarkMode={isDarkMode} stats={content.stats} />;

      case 'portfolio':
        return (
          <section id="portfolio" key="portfolio" className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{content.portfolio.title}</h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
                <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {content.portfolio.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {portfolioImages.map((imgSrc, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className={`group relative overflow-hidden rounded-lg shadow-md aspect-[3/4] ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Portfolio ${index}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="text-white text-xl font-bold mb-2">Projeto {index + 1}</h3>
                        <p className="text-gray-300 text-sm">Fotografia</p>
                        <button className="mt-4 p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors">
                          <Camera size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'videos':
        return (
          <section id="videos" key="videos" className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{content.videos.title}</h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
                <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {content.videos.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {content.videos.urls.map((url, index) => (
                  <div key={index} className={`aspect-video rounded-lg overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <iframe
                      className="w-full h-full"
                      src={url}
                      title={`Video ${index}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section id="depoimentos" key="testimonials" className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{content.testimonials.title}</h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
                <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {content.testimonials.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {content.testimonials.items.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    whileHover={{ y: -5 }}
                    className={`p-8 rounded-lg shadow-lg flex flex-col items-center text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <p className={`italic mb-6 text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>"{testimonial.text}"</p>
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</h3>
                    <div className="flex text-amber-500 mt-2 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section id="contato" key="contact" className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Entre em Contato</h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
              </div>
              <div className={`max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="bg-gray-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Informações</h3>
                    <p className="text-gray-400 text-sm mb-6">{content.contact.availability}</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-amber-600" />
                        <span className="text-sm">{content.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Instagram size={18} className="text-amber-600" />
                        <span className="text-sm">{content.contact.instagram}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:w-2/3">
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const name = formData.get('name') as string;
                      const subject = formData.get('subject') as string;
                      const message = formData.get('message') as string;
                      const text = `Olá, me chamo ${name}. ${subject ? `Assunto: ${subject}. ` : ''}${message}`;
                      window.open(`https://wa.me/${content.contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input name="name" type="text" placeholder="Seu Nome" className={`w-full p-3 border rounded focus:outline-none focus:border-amber-600 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
                      <input name="email" type="email" placeholder="Seu Email" className={`w-full p-3 border rounded focus:outline-none focus:border-amber-600 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                    </div>
                    <input name="subject" type="text" placeholder="Assunto" className={`w-full p-3 border rounded focus:outline-none focus:border-amber-600 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                    <textarea name="message" rows={4} placeholder="Sua Mensagem" className={`w-full p-3 border rounded focus:outline-none focus:border-amber-600 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required></textarea>
                    <button type="submit" className="px-6 py-3 bg-amber-600 text-white font-bold rounded hover:bg-amber-700 transition-colors w-full md:w-auto">
                      Enviar Mensagem
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        );

      case 'footer':
        return (
          <footer key="footer" className="bg-gray-900 text-white py-12 text-center">
            <div className="container mx-auto px-6">
              <p className="text-gray-400 text-sm mb-2">{content.footer.ownerName} {content.footer.cnpj ? `- CNPJ: ${content.footer.cnpj}` : ''}</p>
              <p className="text-gray-500 text-xs mb-4">{content.footer.copyright}</p>
              <div className="w-12 h-px bg-gray-800 mx-auto mb-4"></div>
              <p className="text-gray-600 text-[10px] uppercase tracking-widest">{content.footer.developerCredit}</p>
            </div>
          </footer>
        );

      default:
        // Renderizador de Seções Personalizadas Criadas Pelo Usuário
        if (sectionName.startsWith('custom_')) {
          const customId = sectionName.replace('custom_', '');
          const customSec = content.customSections?.find(c => c.id === customId);
          if (!customSec) return null;

          return (
            <section id={`custom-${customSec.id}`} key={sectionName} className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                  <h2 className={`text-3xl md:text-4xl font-bold mb-2 uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{customSec.title}</h2>
                  <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
                  {customSec.subtitle && (
                    <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {customSec.subtitle}
                    </p>
                  )}
                </div>

                {customSec.text || customSec.imageUrl ? (
                  <div className={`grid grid-cols-1 ${customSec.imageUrl ? 'md:grid-cols-2' : ''} gap-12 items-center`}>
                    {customSec.text && (
                      <div className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {customSec.text}
                      </div>
                    )}
                    {customSec.imageUrl && (
                      <div className="flex justify-center md:justify-end">
                        <img src={customSec.imageUrl} alt={customSec.title} className="rounded-sm shadow-lg w-full max-w-sm h-auto object-cover" />
                      </div>
                    )}
                  </div>
                ) : null}

                {customSec.gallery && customSec.gallery.length > 0 && (
                  <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {customSec.gallery.map((img, i) => (
                      <motion.div key={i} whileHover={{ y: -5 }} className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="aspect-square">
                          <img src={img.url} alt={img.description || customSec.title} className="w-full h-full object-cover" />
                        </div>
                        {img.description && (
                          <div className="p-4 text-center">
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{img.description}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        }
        return null;
    }
  };

  return (
    <div className={`font-sans transition-colors duration-300 ${isDarkMode ? 'text-gray-100 bg-gray-900' : 'text-gray-800 bg-white'}`}>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? (isDarkMode ? 'bg-gray-900/90 backdrop-blur-md shadow-sm py-3' : 'bg-white/90 backdrop-blur-md shadow-sm py-3')
          : 'bg-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => scrollToSection('hero')}>
            <img src={logo} alt="Bruno Nascimento" className="h-20 md:h-24 w-auto transition-all" />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Sobre', 'Portfólio', 'Depoimentos', 'Contato'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase().replace('ó', 'o'))}
                className={`text-sm font-medium uppercase tracking-wide hover:text-amber-600 transition-colors ${isScrolled ? (isDarkMode ? 'text-gray-200' : 'text-gray-700') : 'text-white/90'
                  }`}
              >
                {item}
              </button>
            ))}

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isScrolled ? (isDarkMode ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-600') : 'text-white hover:bg-white/10'}`}
              title={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              to="/area-do-cliente"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isScrolled
                ? 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-gray-900'
                }`}
            >
              <Lock size={14} />
              <span className="text-xs font-bold uppercase">Área do Cliente</span>
            </Link>
            <Link
              to="/admin/login"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isScrolled
                ? 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-gray-900'
                }`}
            >
              <Lock size={14} />
              <span className="text-xs font-bold uppercase">Área Administrativa</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isScrolled ? (isDarkMode ? 'text-yellow-400' : 'text-gray-600') : 'text-white'}`}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button
              className="text-amber-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} className={isScrolled ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-white'} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`md:hidden absolute top-full left-0 right-0 shadow-lg py-4 px-6 flex flex-col space-y-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
          >
            {['Home', 'Sobre', 'Portfólio', 'Depoimentos', 'Contato'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase().replace('ó', 'o'))}
                className={`text-left font-medium uppercase text-sm hover:text-amber-600 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                {item}
              </button>
            ))}
            <Link to="/area-do-cliente" className="text-left text-amber-600 font-bold uppercase text-sm flex items-center gap-2">
              <Lock size={14} /> Área do Cliente
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Render sections based on database order */}
      <main>
        {content.sections.map((sectionName) => renderSection(sectionName))}
      </main>
    </div>
  );
}