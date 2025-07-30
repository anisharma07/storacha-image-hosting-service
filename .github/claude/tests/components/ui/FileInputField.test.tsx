import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FileInputField } from '@/components/ui/FileInputField';

const TestWrapper = ({ 
  isMultipleFiles = false, 
  isAcceptDirectory = false,
  onFileChange = jest.fn()
}) => {
  const methods = useForm({
    defaultValues: { file: undefined }
  });
  
  return (
    <FormProvider {...methods}>
      <FileInputField 
        field={{
          value: methods.watch('file'),
          onChange: onFileChange,
          name: 'file',
          onBlur: jest.fn(),
          ref: jest.fn()
        }}
        isMultipleFiles={isMultipleFiles}
        isAcceptDirectory={isAcceptDirectory}
      />
    </FormProvider>
  );
};

describe('FileInputField Component', () => {
  it('renders file input correctly', () => {
    render(<TestWrapper />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
  });

  it('handles single file upload', () => {
    const onFileChange = jest.fn();
    render(<TestWrapper onFileChange={onFileChange} />);
    
    const input = screen.getByRole('textbox');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(onFileChange).toHaveBeenCalledWith(file);
  });

  it('handles multiple file upload', () => {
    const onFileChange = jest.fn();
    render(<TestWrapper isMultipleFiles onFileChange={onFileChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('multiple');
    
    const files = [
      new File(['content1'], 'test1.txt', { type: 'text/plain' }),
      new File(['content2'], 'test2.txt', { type: 'text/plain' })
    ];
    
    fireEvent.change(input, { target: { files } });
    
    expect(onFileChange).toHaveBeenCalledWith(files);
  });

  it('handles directory selection', () => {
    render(<TestWrapper isAcceptDirectory />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('webkitdirectory', 'true');
  });

  it('displays filename when file is selected', () => {
    const TestWrapperWithFile = () => {
      const methods = useForm({
        defaultValues: { 
          file: { fileName: 'selected-file.txt' }
        }
      });
      
      return (
        <FormProvider {...methods}>
          <FileInputField 
            field={{
              value: { fileName: 'selected-file.txt' },
              onChange: jest.fn(),
              name: 'file',
              onBlur: jest.fn(),
              ref: jest.fn()
            }}
          />
        </FormProvider>
      );
    };

    render(<TestWrapperWithFile />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('selected-file.txt');
  });

  it('handles empty file selection', () => {
    const onFileChange = jest.fn();
    render(<TestWrapper onFileChange={onFileChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { files: [] } });
    
    expect(onFileChange).toHaveBeenCalledWith(undefined);
  });
});