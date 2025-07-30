import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from '@/hooks/use-toast';

describe('useToast Hook', () => {
  beforeEach(() => {
    // Clear any existing toasts
    act(() => {
      const { dismiss } = renderHook(() => useToast()).result.current;
      dismiss();
    });
  });

  it('returns empty toasts initially', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.toasts).toEqual([]);
  });

  it('adds toast when toast function is called', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ title: 'Test Toast', description: 'Test Description' });
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('Test Description');
  });

  it('generates unique IDs for toasts', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' });
    });
    
    const toastIds = result.current.toasts.map(t => t.id);
    expect(toastIds[0]).not.toBe(toastIds[1]);
  });

  it('limits number of toasts to TOAST_LIMIT', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' });
    });
    
    // Based on TOAST_LIMIT = 1 in the source
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Toast 2');
  });

  it('dismisses specific toast by ID', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ title: 'Test Toast' });
    });
    
    const toastId = result.current.toasts[0].id;
    
    act(() => {
      result.current.dismiss(toastId);
    });
    
    // Toast should be marked as dismissed, but still in array until timeout
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('dismisses all toasts when no ID provided', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ title: 'Toast 1' });
    });
    
    act(() => {
      result.current.dismiss();
    });
    
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('updates existing toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ title: 'Original Title' });
    });
    
    const toastId = result.current.toasts[0].id;
    
    act(() => {
      toast({ 
        id: toastId,
        title: 'Updated Title',
        description: 'Updated Description'
      });
    });
    
    expect(result.current.toasts[0].title).toBe('Updated Title');
    expect(result.current.toasts[0].description).toBe('Updated Description');
  });

  it('handles toast with action element', () => {
    const { result } = renderHook(() => useToast());
    const mockAction = { type: 'button', props: { children: 'Undo' } };
    
    act(() => {
      toast({ 
        title: 'Test Toast',
        action: mockAction
      });
    });
    
    expect(result.current.toasts[0].action).toBe(mockAction);
  });

  it('handles different toast variants', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ 
        title: 'Error Toast',
        variant: 'destructive'
      });
    });
    
    expect(result.current.toasts[0].variant).toBe('destructive');
  });

  it('provides working toast function from hook', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({ title: 'Hook Toast' });
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Hook Toast');
  });
});