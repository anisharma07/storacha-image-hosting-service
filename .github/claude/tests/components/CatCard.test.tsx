import { render, screen } from '@testing-library/react';
import { CatCard } from '@/components/CatCard';
import * as gateway from '@/lib/gateway';

// Mock the gateway utility
jest.mock('@/lib/gateway');
const mockGetIpfsGatewayUrl = gateway.getIpfsGatewayUrl as jest.MockedFunction<typeof gateway.getIpfsGatewayUrl>;

describe('CatCard Component', () => {
  const defaultProps = {
    id: '404',
    imageSrc: 'QmTestCid/404.jpg'
  };

  beforeEach(() => {
    mockGetIpfsGatewayUrl.mockReturnValue('https://ipfs.io/ipfs/QmTestCid/404.jpg');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders cat card with correct content', () => {
    render(<CatCard {...defaultProps} />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    
    const image = screen.getByAltText('HTTP Cat 404');
    expect(image).toBeInTheDocument();
  });

  it('creates correct link to cat page', () => {
    render(<CatCard {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/httpcat/404');
  });

  it('uses gateway URL for image source', () => {
    render(<CatCard {...defaultProps} />);
    
    expect(mockGetIpfsGatewayUrl).toHaveBeenCalledWith('QmTestCid/404.jpg');
    
    const image = screen.getByAltText('HTTP Cat 404');
    expect(image).toHaveAttribute('src', 'https://ipfs.io/ipfs/QmTestCid/404.jpg');
  });

  it('renders image with correct styling', () => {
    render(<CatCard {...defaultProps} />);
    
    const image = screen.getByAltText('HTTP Cat 404');
    expect(image).toHaveClass('w-full', 'h-auto', 'rounded');
  });

  it('renders card with correct styling', () => {
    render(<CatCard {...defaultProps} />);
    
    const card = document.querySelector('.bg-white');
    expect(card).toHaveClass('bg-white', 'p-4', 'rounded', 'shadow');
  });

  it('handles different HTTP status codes', () => {
    const { rerender } = render(<CatCard id="200" imageSrc="QmTest/200.jpg" />);
    
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByAltText('HTTP Cat 200')).toBeInTheDocument();
    
    rerender(<CatCard id="500" imageSrc="QmTest/500.jpg" />);
    
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByAltText('HTTP Cat 500')).toBeInTheDocument();
  });

  it('handles empty or invalid props', () => {
    render(<CatCard id="" imageSrc="" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/httpcat/');
    
    expect(mockGetIpfsGatewayUrl).toHaveBeenCalledWith('');
  });

  it('renders title in card header', () => {
    render(<CatCard {...defaultProps} />);
    
    const title = screen.getByText('404');
    expect(title).toHaveClass('text-xl', 'font-semibold', 'mb-2');
  });
});