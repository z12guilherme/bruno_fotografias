import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface TestimonialItem {
  id: string;
  name: string;
  text: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  text: string;
  imageUrl?: string;
  gallery?: { url: string; description: string }[];
}

export interface HomepageContent {
  hero: {
    subtitle: string;
    ctaText: string;
    backgroundImageUrl?: string;
  };
  about: {
    title: string;
    bio1: string;
    bio2: string;
    bio3: string;
    photographerImageUrl?: string;
    awardImageUrl?: string;
  };
  stats: {
    partos: number;
    anosExperiencia: number;
    premios: number;
  };
  portfolio: {
    title: string;
    subtitle: string;
    imageUrls: string[];
  };
  videos: {
    title: string;
    subtitle: string;
    urls: string[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  contact: {
    email: string;
    instagram: string;
    whatsapp: string;
    availability: string;
  };
  footer: {
    ownerName: string;
    cnpj: string;
    copyright: string;
    developerCredit: string;
  };
  sections: string[];
  customSections: CustomSectionItem[];
}

export const defaultContent: HomepageContent = {
  hero: {
    subtitle: 'Especialista em Fotografia de Nascimento & Família',
    ctaText: 'Ver Meu Trabalho',
  },
  about: {
    title: 'QUEM SOU?',
    bio1: 'Sou Bruno Nascimento, fotógrafo de partos, e há 2 anos vivo o propósito de eternizar nascimentos cheios de amor, força e significado. Já registrei mais de 100 partos, sempre com sensibilidade, respeito e olhar atento aos detalhes que tornam cada história única.',
    bio2: 'Em 2025, tive o privilégio de ser premiado internacionalmente com uma fotografia pela Outstanding Maternity Award, um reconhecimento que reforça minha credibilidade e a essência do meu trabalho.',
    bio3: 'Cada parto é único e exige respeito absoluto. Meu compromisso é atuar de forma ética, discreta e responsável, sempre em harmonia com a equipe de saúde e os protocolos do ambiente cirúrgico ou da sala de parto.',
  },
  stats: {
    partos: 100,
    anosExperiencia: 2,
    premios: 1,
  },
  portfolio: {
    title: 'Meu Portfólio',
    subtitle: 'Uma seleção dos meus melhores trabalhos, capturando a essência e a beleza em cada detalhe.',
    imageUrls: [],
  },
  videos: {
    title: 'Filmes',
    subtitle: 'Histórias contadas através de movimento e som.',
    urls: ['https://www.youtube.com/embed/eIbfqoUCnYo', 'https://www.youtube.com/embed/JwPPpDyG3xw'],
  },
  testimonials: {
    title: 'Depoimentos',
    subtitle: 'Histórias reais de quem confiou seus momentos mais preciosos ao meu olhar.',
    items: [
      { id: '1', name: 'Josefa Tavares', text: 'Obrigada Bruno em participar da nossa alegria, foram muitas emoções, você faz um trabalho maravilhoso parabéns.' },
      { id: '2', name: 'Laiara Lima', text: 'Agradeço a você por toda sua atenção e profissionalismo! Que Deus continue abençoando esse trabalho lindo!' },
      { id: '3', name: 'Rayane Valentim', text: 'Muito especial, você é um profissional incrível, superou minhas expectativas pra esse dia.' },
    ],
  },
  contact: {
    email: 'brunofotografia111@gmail.com',
    instagram: '@brunofotografias_',
    whatsapp: '5581993162157',
    availability: 'Estou disponível para trabalhos freelance e eventos.',
  },
  footer: {
    ownerName: 'Bruno José do Nascimento Silva',
    cnpj: '55.883.381/0001-96',
    copyright: 'Bruno Nascimento Fotografia. Todos os direitos reservados.',
    developerCredit: 'Desenvolvido por Inove Dev',
  },
  sections: ['hero', 'about', 'stats', 'portfolio', 'videos', 'testimonials', 'contact', 'footer'],
  customSections: [],
};

function mergeContent(source: any): HomepageContent {
  return {
    hero: { ...defaultContent.hero, ...(source?.hero || {}) },
    about: { ...defaultContent.about, ...(source?.about || {}) },
    stats: { ...defaultContent.stats, ...(source?.stats || {}) },
    portfolio: { ...defaultContent.portfolio, ...(source?.portfolio || {}) },
    videos: { ...defaultContent.videos, ...(source?.videos || {}) },
    testimonials: { ...defaultContent.testimonials, ...(source?.testimonials || {}) },
    contact: { ...defaultContent.contact, ...(source?.contact || {}) },
    footer: { ...defaultContent.footer, ...(source?.footer || {}) },
    sections: source?.sections || defaultContent.sections,
    customSections: source?.customSections || [],
  };
}

export function useHomepageContent(previewMode = false) {
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [previewMode]);

  async function loadContent() {
    setLoading(true);

    if (previewMode) {
      const previewData = localStorage.getItem('homepage_preview');
      if (previewData) {
        try {
          const parsed = JSON.parse(previewData);
          setContent(mergeContent(parsed));
          setLoading(false);
          return;
        } catch { }
      }
    }

    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('value')
        .eq('key', 'content')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar conteúdo da home:', error);
      }

      if (data?.value) {
        setContent(mergeContent(data.value));
      }
    } catch (err) {
      console.error('Error fetching homepage content:', err);
    } finally {
      setLoading(false);
    }
  }

  async function saveContent(newContent: HomepageContent): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .upsert(
          { key: 'content', value: newContent, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      if (error) throw error;
      setContent(newContent);
      return true;
    } catch (err) {
      console.error('Error saving homepage content:', err);
      return false;
    }
  }

  function setPreviewContent(previewContent: HomepageContent) {
    localStorage.setItem('homepage_preview', JSON.stringify(previewContent));
    setContent(previewContent);
  }

  function clearPreview() {
    localStorage.removeItem('homepage_preview');
    loadContent();
  }

  return { content, loading, saveContent, setPreviewContent, clearPreview, refetch: loadContent };
}
