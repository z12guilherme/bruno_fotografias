// 1. Importamos o componente da seção "Sobre" que contém o texto e a foto.
// O caminho '@/components/SobreSection' é um atalho para 'src/components/SobreSection'.
import { SobreSection } from "@/components/SobreSection";

export function AboutPage() {
  return (
    // A tag <main> é semanticamente correta para o conteúdo principal de uma página.
    <main>
      {/* 2. Aqui, nós simplesmente renderizamos o componente da seção. */}
      <SobreSection />
    </main>
  );
}