import { render, screen, fireEvent } from '@testing-library/react';
import { SignInButton } from '@/components/SignInButton';

// Mock the Account type
const createMockAccount = (email: string, did: string) => ({
  toEmail: () => email,
  did: () => did,
});

describe('SignInButton Component', () => {
  const mockHandleSignIn = jest.fn();
  const mockHandleSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in button when not authenticated', () => {
    render(
      <SignInButton 
        account={null}
        handleSignIn={mockHandleSignIn}
        handleSignOut={mockHandleSignOut}
      />
    );
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  it('calls handleSignIn when sign in button is clicked', () => {
    render(
      <SignInButton 
        account={null}
        handleSignIn={mockHandleSignIn}
        handleSignOut={mockHandleSignOut}
      />
    );
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    
    expect(mockHandleSignIn).toHaveBeenCalledTimes(1);
  });

  it('renders user dropdown when authenticated', () => {
    const mockAccount = createMockAccount('test@example.com', 'did:test:123');
    
    render(
      <SignInButton 
        account={mockAccount}
        handleSignIn={mockHandleSignIn}
        handleSignOut={mockHandleSignOut}
      />
    );
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument(); // Avatar fallback
  });

  it('opens dropdown menu when user button is clicked', () => {
    const mockAccount = createMockAccount('test@example.com', 'did:test:123');
    
    render(
      <SignInButton 
        account={mockAccount}
        handleSignIn={mockHandleSignIn}
        handleSignOut={mockHandleSignOut}
      />
    );
    
    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);
    
    expect(screen.getByText('Account Info')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('DID')).toBeInTheDocument();
  });

  it('displays user information in dropdown', () => {
    const mockAccount = createMockAccount('john@example.com', 'did:key:abc123');
    
    render(
      <SignInButton 
        account={mockAccount}
        handleSignIn={mockHandleSignIn}
        handleSignOut={mockHandleSignOut}
      />
    );
    
    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('did:key:abc123')).toBeInTheDocument();
  });

  it('calls handleSignOut when sign out is clicked', () => {
    const mockAccount = createMockAccount('test@example.com', 'did:test:123');
    
    render(
      <SignInButton 
        account={mockAccount}
        handleSignIn={mockHandleSignIn}
        handleSignOut={mockHandleSignOut}
      />
    );
    
    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);
    
    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);
    
    expect(mockHandleSignOut).toHaveBeenCalledTimes(1);
  });

  it('generates correct avatar fallback letter', () => {
    const mockAccount = createMockAccount('alice@example.com', 'did:test:456');
    
    render(
      <SignInButton 
        account={mockAccount}
        handleSignIn={mockHandleSignIn}
        handleSignOut={mockHandleSignOut}
      />
    );
    
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('handles account without DID', () => {
    const mockAccountNoDid = {
      toEmail: () => 'test@example.com',
      did: () => null,
    };
    
    render(
      <SignInButton 
        account={mockAccountNoDid}
        handleSignIn={mockHandleSignIn}
        handleSignOut={mockHandleSignOut}
      />
    );
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  it('hides email on small screens', () => {
    const mockAccount = createMockAccount('test@example.com', 'did:test:123');
    
    render(
      <SignInButton 
        account={mockAccount}
        handleSignIn={mockHandleSignIn}
        handleSignOut={mockHandleSignOut}
      />
    );
    
    const emailSpan = screen.getByText('test@example.com');
    expect(emailSpan).toHaveClass('hidden', 'md:inline');
  });
});