import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do IntersectionObserver (necessário para o framer-motion não quebrar nos testes)
const IntersectionObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);