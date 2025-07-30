import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UploadForm, UploadFormType } from '@/components/ui/UploadForm';
import { uploadSuccessToast } from '@/hooks/upload-toast';

// Mock the upload toast
jest.mock('@/hooks/upload-toast');
const mockUploadSuccessToast = uploadSuccessToast as jest.MockedFunction<typeof uploadSuccessToast>;

describe('File Upload Flow Integration', () => {
  const mockUploadFiles = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes single file upload flow', async () => {
    mockUploadFiles.mockResolvedValue({
      success: true,
      cid: 'QmTestCid123'
    });

    render(
      <UploadForm 
        uploadFiles={mockUploadFiles}
        isShowProgress={true}
      />
    );

    // Select file upload type
    const fileTab = screen.getByText('File');
    fireEvent.click(fileTab);

    // Upload a file
    const fileInput = screen.getByRole('textbox');
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(submitButton);

    // Wait for upload to complete
    await waitFor(() => {
      expect(mockUploadFiles).toHaveBeenCalledWith({
        file,
        uploadProgressCallback: expect.any(Function)
      });
    });

    expect(mockUploadSuccessToast).toHaveBeenCalledWith({
      cid: 'QmTestCid123',
      name: 'test.txt'
    });
  });

  it('completes multifield upload flow', async () => {
    mockUploadFiles.mockResolvedValue({
      success: true,
      cid: 'QmTestCid456'
    });

    render(
      <UploadForm 
        uploadFiles={mockUploadFiles}
        isShowProgress={true}
      />
    );

    // Select multifield type
    const multifieldTab = screen.getByText('Multifields as Directory');
    fireEvent.click(multifieldTab);

    // Fill in the code field
    const codeInput = screen.getByLabelText(/code/i);
    fireEvent.change(codeInput, { target: { value: '404' } });

    // Fill in description
    const descriptionTextarea = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionTextarea, { target: { value: 'Not Found' } });

    // Upload a file
    const fileInput = screen.getByRole('textbox');
    const file = new File(['cat image'], 'cat.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUploadFiles).toHaveBeenCalledWith({
        file,
        code: 404,
        description: 'Not Found',
        uploadProgressCallback: expect.any(Function)
      });
    });
  });

  it('shows progress during upload', async () => {
    let progressCallback: ((progress: any) => void) | undefined;
    
    mockUploadFiles.mockImplementation((params) => {
      progressCallback = params.uploadProgressCallback;
      return new Promise(resolve => {
        setTimeout(() => {
          if (progressCallback) {
            progressCallback({ percent: 50 });
          }
          setTimeout(() => {
            if (progressCallback) {
              progressCallback({ percent: 100 });
            }
            resolve({ success: true, cid: 'QmTestCid789' });
          }, 100);
        }, 100);
      });
    });

    render(
      <UploadForm 
        uploadFiles={mockUploadFiles}
        isShowProgress={true}
      />
    );

    // Upload a file
    const fileInput = screen.getByRole('textbox');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(submitButton);

    // Check for progress bar
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    // Wait for completion
    await waitFor(() => {
      expect(mockUploadSuccessToast).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('handles upload errors gracefully', async () => {
    mockUploadFiles.mockRejectedValue(new Error('Upload failed'));

    render(
      <UploadForm 
        uploadFiles={mockUploadFiles}
        isShowProgress={true}
      />
    );

    const fileInput = screen.getByRole('textbox');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUploadFiles).toHaveBeenCalled();
    });

    // Should not show success toast on error
    expect(mockUploadSuccessToast).not.toHaveBeenCalled();
  });

  it('validates required fields before upload', async () => {
    render(
      <UploadForm 
        uploadFiles={mockUploadFiles}
        isShowProgress={true}
      />
    );

    // Try to submit without selecting a file
    const submitButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(submitButton);

    // Should not call upload function
    expect(mockUploadFiles).not.toHaveBeenCalled();
  });

  it('disables form during upload', async () => {
    mockUploadFiles.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({ success: true, cid: 'QmTest' }), 1000);
    }));

    render(
      <UploadForm 
        uploadFiles={mockUploadFiles}
        isShowProgress={true}
      />
    );

    const fileInput = screen.getByRole('textbox');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(submitButton);

    // Button should be disabled during upload
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});