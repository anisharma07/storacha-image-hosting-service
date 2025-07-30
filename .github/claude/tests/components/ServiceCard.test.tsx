import { render, screen } from '@testing-library/react';
import { ServiceCard } from '@/components/ServiceCard';

describe('ServiceCard Component', () => {
  const defaultProps = {
    title: 'Test Service',
    description: 'This is a test service description',
    slug: 'test-service'
  };

  it('renders service card with correct content', () => {
    render(<ServiceCard {...defaultProps} />);
    
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('This is a test service description')).toBeInTheDocument();
  });

  it('creates correct link with slug', () => {
    render(<ServiceCard {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-service');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders card structure correctly', () => {
    render(<ServiceCard {...defaultProps} />);
    
    const container = document.querySelector('#container');
    expect(container).toBeInTheDocument();
    
    const card = container?.querySelector('.bg-white');
    expect(card).toHaveClass('bg-white', 'p-4', 'rounded', 'shadow');
  });

  it('handles empty props gracefully', () => {
    render(<ServiceCard title="" description="" slug="" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('handles special characters in slug', () => {
    render(<ServiceCard 
      title="Special Service" 
      description="Description" 
      slug="special-service-123" 
    />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/special-service-123');
  });

  it('renders title in header section', () => {
    render(<ServiceCard {...defaultProps} />);
    
    const title = screen.getByText('Test Service');
    expect(title).toHaveClass('text-xl', 'font-semibold', 'mb-2');
  });

  it('renders description in card content', () => {
    render(<ServiceCard {...defaultProps} />);
    
    const description = screen.getByText('This is a test service description');
    expect(description.closest('[class*="CardContent"]')).toBeInTheDocument();
  });
});