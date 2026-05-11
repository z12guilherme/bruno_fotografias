// @vitest-environment jsdom
import '../setupTests';

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SobreSection } from './SobreSection';
import { useHomepageContent } from '@/hooks/useHomepageContent';

vi.mock('@/hooks/useHomepageContent', () => ({
    useHomepageContent: vi.fn(),
}));

describe('Componente SobreSection', () => {
    it('deve usar a imagem e texto de fallback se o conteúdo principal estiver vazio', () => {
        vi.mocked(useHomepageContent).mockReturnValue({
            content: {
                about: {
                    title: 'Sobre Mim Padrão',
                    bio1: 'Sou Bruno Nascimento, um fotógrafo apaixonado...',
                    photographerImageUrl: '', // Imagem vazia no banco
                },
            },
            loading: false,
        } as any);

        render(<SobreSection />);
        expect(screen.getByText('Sobre Mim Padrão')).toBeInTheDocument();
        expect(screen.getByText(/apaixonado/i)).toBeInTheDocument();
    });

    it('deve refletir a imagem dinâmica da biografia quando houver upload no painel', () => {
        vi.mocked(useHomepageContent).mockReturnValue({
            content: {
                about: {
                    title: 'Quem é Bruno?',
                    photographerImageUrl: 'https://exemplo.com/fotodinamica.jpg',
                },
            },
            loading: false,
        } as any);

        render(<SobreSection />);
        const img = screen.getByRole('img', { name: 'Quem é Bruno?' });
        expect(img).toHaveAttribute('src', 'https://exemplo.com/fotodinamica.jpg');
    });
});