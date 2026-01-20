import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Instagram, Mail, ChevronDown, Camera, Lock, Sun, Moon } from 'lucide-react';
import capaBg from '@/assets/Capa.jpg';

import logo from '@/assets/logo.jpg';
import { QuemSou } from './QuemSou';
import portfolio1 from "@/assets/portfolio1.jpg";
import portfolio2 from "@/assets/portfolio2.jpg";
import portfolio3 from "@/assets/portfolio3.png";
import portfolio4 from "@/assets/portfolio4.jpg";
import portfolio5 from "@/assets/portfolio5.jpg";
import portfolio6 from "@/assets/portfolio6.jpg";
import portfolio7 from "@/assets/portfolio7.jpg";
import portfolio8 from "@/assets/portfolio8.jpg";
import portfolio9 from "@/assets/portfolio9.jpg";
import videoPortfolio from "@/assets/videos/video_portfolio.mp4";
import videoPortfolio2 from "@/assets/videos/video_portfolio2.mp4";

export function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Imagens de exemplo para o portfólio
  const portfolioImages = [
    portfolio1,
    portfolio2,
    portfolio3,
    portfolio4,
    portfolio5,
    portfolio6,
    portfolio7,
    portfolio8,
    portfolio9,
  ];

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
    <div className={`font-sans transition-colors duration-300 ${isDarkMode ? 'text-gray-100 bg-gray-900' : 'text-gray-800 bg-white'}`}>
      {/* --- Navigation --- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? (isDarkMode ? 'bg-gray-900/90 backdrop-blur-md shadow-sm py-3' : 'bg-white/90 backdrop-blur-md shadow-sm py-3') 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <img src={logo} alt="Bruno Nascimento" className="h-10 w-10 rounded-full object-cover" />
            <div className="text-2xl font-bold tracking-wider uppercase">
              <span className={isScrolled ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-white'}>Bruno | Fotografia de Nascimento </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Sobre', 'Portfólio', 'Contato'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase().replace('ó', 'o'))}
                className={`text-sm font-medium uppercase tracking-wide hover:text-amber-600 transition-colors ${
                  isScrolled ? (isDarkMode ? 'text-gray-200' : 'text-gray-700') : 'text-white/90'
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isScrolled
                  ? 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-gray-900'
              }`}
            >
              <Lock size={14} />
              <span className="text-xs font-bold uppercase">Área do Cliente</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`md:hidden absolute top-full left-0 right-0 shadow-lg py-4 px-6 flex flex-col space-y-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
          >
            {['Home', 'Sobre', 'Portfólio', 'Contato'].map((item) => (
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

      {/* --- Hero Section --- */}
      <section id="hero" className="relative h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background Image Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: `url(${capaBg})` }}
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
            Especialista em Fotografia de Nascimento & Família
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

      {/* --- Quem Sou Section --- */}
      <QuemSou isDarkMode={isDarkMode} />

      {/* --- Portfolio Section --- */}
      <section id="portfolio" className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Meu Portfólio</h2>
            <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
            <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Uma seleção dos meus melhores trabalhos, capturando a essência e a beleza em cada detalhe.
            </p>
          </div>

          {/* Grid de Fotos */}
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

      {/* --- Video Portfolio Section --- */}
      <section id="videos" className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Filmes</h2>
            <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
            <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Histórias contadas através de movimento e som.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vídeo 1 - Local */}
            <div className={`aspect-video rounded-lg overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <video className="w-full h-full" controls preload="none">
                <source src={videoPortfolio} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>

            {/* Vídeo 2 */}
            <div className={`aspect-video rounded-lg overflow-hidden shadow-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <video className="w-full h-full" controls preload="none">
                <source src={videoPortfolio2} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section id="contato" className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Entre em Contato</h2>
            <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
          </div>

          <div className={`max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="bg-gray-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-4">Informações</h3>
                <p className="text-gray-400 text-sm mb-6">Estou disponível para trabalhos freelance e eventos.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-amber-600" />
                    <span className="text-sm">brunofotografia111@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram size={18} className="text-amber-600" />
                    <span className="text-sm">@brunofotografias_</span>
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
                  window.open(`https://wa.me/5581993162157?text=${encodeURIComponent(text)}`, '_blank');
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

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Bruno Nascimento Fotografia. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}