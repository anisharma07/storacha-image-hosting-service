import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock Radix UI components
jest.mock('@radix-ui/react-toast', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
  Viewport: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-viewport">{children}</div>,
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-root">{children}</div>,
  Title: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-title">{children}</div>,
  Description: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-description">{children}</div>,
  Action: ({ children }: { children: React.ReactNode }) => <button data-testid="toast-action">{children}</button>,
  Close: ({ children }: { children: React.ReactNode }) => <button data-testid="toast-close">{children}</button>,
}));

// Mock W3UI React components
jest.mock('@w3ui/react', () => ({
  Authenticator: {
    Form: ({ children }: { children: React.ReactNode }) => <form data-testid="auth-form">{children}</form>,
    EmailInput: (props: any) => <input data-testid="auth-email" {...props} />,
    CancelButton: ({ children }: { children: React.ReactNode }) => <button data-testid="auth-cancel">{children}</button>,
  },
  useAuthenticator: () => [{ 
    submitted: false, 
    email: 'test@example.com',
    accounts: [],
    client: {}
  }],
  useW3: () => [{ 
    client: {}, 
    accounts: [] 
  }],
  Provider: ({ children }: { children: React.ReactNode }) => children,
}));