import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Instagram, Linkedin, Mail, ChevronDown, Camera, Lock } from 'lucide-react';

export function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Detecta o scroll para mudar o estilo da navbar
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

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* --- Navigation --- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider uppercase cursor-pointer" onClick={() => scrollToSection('hero')}>
            <span className={isScrolled ? 'text-gray-900' : 'text-white'}>Bruno</span>
            <span className="text-amber-600">.</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Sobre', 'Portfólio', 'Contato'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase().replace('ó', 'o'))}
                className={`text-sm font-medium uppercase tracking-wide hover:text-amber-600 transition-colors ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {item}
              </button>
            ))}
            <a
              href="/cliente-login.html"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isScrolled
                  ? 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-gray-900'
              }`}
            >
              <Lock size={14} />
              <span className="text-xs font-bold uppercase">Área do Cliente</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-amber-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} className={isScrolled ? 'text-gray-900' : 'text-white'} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 flex flex-col space-y-4"
          >
            {['Home', 'Sobre', 'Portfólio', 'Contato'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase().replace('ó', 'o'))}
                className="text-left text-gray-700 hover:text-amber-600 font-medium uppercase text-sm"
              >
                {item}
              </button>
            ))}
            <a href="/cliente-login.html" className="text-left text-amber-600 font-bold uppercase text-sm flex items-center gap-2">
              <Lock size={14} /> Área do Cliente
            </a>
          </motion.div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section id="hero" className="relative h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background Image Placeholder - Substitua pela sua foto principal */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay escuro */}

        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
          >
            Bruno Nascimento
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-light text-gray-200 mb-8"
          >
            Fotógrafo Profissional & Artista Visual
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => scrollToSection('portfolio')}
            className="px-8 py-3 border-2 border-amber-600 text-white hover:bg-amber-600 transition-all duration-300 rounded uppercase text-sm tracking-widest font-semibold"
          >
            Ver Meu Trabalho
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

      {/* --- About Section --- */}
      <section id="sobre" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1554048612-387768052bf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Bruno Nascimento" 
                className="rounded shadow-xl w-full object-cover h-[500px]"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Sobre Mim</h2>
                <div className="w-16 h-1 bg-amber-600"></div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Olá, sou Bruno Nascimento. A fotografia para mim não é apenas capturar momentos, mas criar memórias eternas com uma estética de luxo e sofisticação.
                Especializado em retratos e eventos, busco a luz perfeita e a emoção genuína em cada clique.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="font-bold text-gray-900 block">Nome:</span>
                  <span className="text-gray-600">Bruno Nascimento</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">Email:</span>
                  <span className="text-gray-600">contato@brunofoto.com</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">Telefone:</span>
                  <span className="text-gray-600">+55 (11) 99999-9999</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">Cidade:</span>
                  <span className="text-gray-600">São Paulo, SP</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-amber-600 hover:text-white transition-colors">
                  <Instagram size={20} />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-amber-600 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-amber-600 hover:text-white transition-colors">
                  <Mail size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Portfolio Section --- */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Meu Portfólio</h2>
            <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Uma seleção dos meus melhores trabalhos, capturando a essência e a beleza em cada detalhe.
            </p>
          </div>

          {/* Grid de Fotos (Masonry Style Simulado) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div 
                key={item}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-lg shadow-md bg-white aspect-[3/4]"
              >
                <img 
                  src={`https://source.unsplash.com/random/800x1000?wedding,portrait&sig=${item}`} 
                  alt={`Portfolio ${item}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-4">
                    <h3 className="text-white text-xl font-bold mb-2">Título do Projeto</h3>
                    <p className="text-gray-300 text-sm">Categoria</p>
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

      {/* --- Contact Section --- */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Entre em Contato</h2>
            <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
          </div>

          <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col md:flex-row">
            <div className="bg-gray-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-4">Informações</h3>
                <p className="text-gray-400 text-sm mb-6">Estou disponível para trabalhos freelance e eventos.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-amber-600" />
                    <span className="text-sm">contato@bruno.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram size={18} className="text-amber-600" />
                    <span className="text-sm">@brunofoto</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 md:w-2/3">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Seu Nome" className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-amber-600 transition-colors" />
                  <input type="email" placeholder="Seu Email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
                <input type="text" placeholder="Assunto" className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-amber-600 transition-colors" />
                <textarea rows={4} placeholder="Sua Mensagem" className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-amber-600 transition-colors"></textarea>
                <button className="px-6 py-3 bg-amber-600 text-white font-bold rounded hover:bg-amber-700 transition-colors w-full md:w-auto">
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Bruno Nascimento Fotografia. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}