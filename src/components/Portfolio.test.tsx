// @vitest-environment jsdom
import '../setupTests';

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Portfolio } from './Portfolio';
import { useHomepageContent } from '@/hooks/useHomepageContent';

// Moca o hook que criamos para evitar chamadas reais ao banco (Supabase) durante o teste
vi.mock('@/hooks/useHomepageContent', () => ({
    useHomepageContent: vi.fn(),
}));

describe('Componente Portfolio', () => {
    it('deve exibir o loader enquanto os dados estão sendo buscados no Supabase', () => {
        vi.mocked(useHomepageContent).mockReturnValue({
            content: null,
            loading: true,
        } as any);

        const { container } = render(<Portfolio />);
        // O nosso ícone de loading usa a classe 'animate-spin'
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('deve exibir as imagens estáticas de fallback quando o painel de adm estiver vazio', () => {
        vi.mocked(useHomepageContent).mockReturnValue({
            content: {
                portfolio: {
                    title: 'Meu Portfólio',
                    imageUrls: [], // Vazio, para forçar o fallback
                },
            },
            loading: false,
        } as any);

        render(<Portfolio />);
        expect(screen.getByText('Meu Portfólio')).toBeInTheDocument();
        // O nosso array estático original possui 9 imagens importadas da pasta assets
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(9);
    });

    it('deve exibir as imagens dinâmicas e título personalizado quando cadastradas', () => {
        vi.mocked(useHomepageContent).mockReturnValue({
            content: {
                portfolio: {
                    title: 'Trabalhos Recentes - Dinâmico',
                    imageUrls: ['https://banco.com/foto1.jpg', 'https://banco.com/foto2.jpg'],
                },
            },
            loading: false,
        } as any);

        render(<Portfolio />);
        expect(screen.getByText('Trabalhos Recentes - Dinâmico')).toBeInTheDocument();
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2); // Deve carregar exatamente as 2 imagens dinâmicas e ignorar as 9 locais
        expect(images[0]).toHaveAttribute('src', 'https://banco.com/foto1.jpg');
    });
});