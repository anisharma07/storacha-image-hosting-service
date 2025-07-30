import { render, screen } from '@testing-library/react';
import { Progress } from '@/components/ui/progress';

describe('Progress Component', () => {
  it('renders progress bar correctly', () => {
    render(<Progress value={50} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('applies correct progress value', () => {
    render(<Progress value={75} />);
    
    const indicator = document.querySelector('[data-state="loading"]') || 
                     document.querySelector('.bg-primary');
    
    // Check if the transform style is applied correctly
    expect(indicator).toHaveStyle({ transform: 'translateX(-25%)' });
  });

  it('handles zero progress', () => {
    render(<Progress value={0} />);
    
    const indicator = document.querySelector('.bg-primary');
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('handles 100% progress', () => {
    render(<Progress value={100} />);
    
    const indicator = document.querySelector('.bg-primary');
    expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' });
  });

  it('handles undefined value', () => {
    render(<Progress />);
    
    const indicator = document.querySelector('.bg-primary');
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('applies custom className', () => {
    render(<Progress value={50} className="custom-progress" />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('custom-progress');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={50} />);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts additional props', () => {
    render(<Progress value={50} data-testid="custom-progress" />);
    
    const progressBar = screen.getByTestId('custom-progress');
    expect(progressBar).toBeInTheDocument();
  });
});