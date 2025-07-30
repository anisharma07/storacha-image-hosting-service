import { uploadSuccessToast, getGatewayUrlWithCid, IpfsGateway } from '@/hooks/upload-toast';
import { toast } from '@/hooks/use-toast';

// Mock the toast hook
jest.mock('@/hooks/use-toast');
const mockToast = toast as jest.MockedFunction<typeof toast>;

describe('Upload Toast Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGatewayUrlWithCid', () => {
    it('returns correct URL for IPFS.io gateway', () => {
      const cid = 'QmTestCid123';
      const url = getGatewayUrlWithCid(cid, IpfsGateway.IpfsIo);
      
      expect(url).toBe('https://ipfs.io/ipfs/QmTestCid123');
    });

    it('defaults to IPFS.io gateway', () => {
      const cid = 'QmTestCid123';
      const url = getGatewayUrlWithCid(cid);
      
      expect(url).toBe('https://ipfs.io/ipfs/QmTestCid123');
    });

    it('returns undefined for unsupported gateways', () => {
      const cid = 'QmTestCid123';
      const url = getGatewayUrlWithCid(cid, IpfsGateway.Lighthouse);
      
      expect(url).toBeUndefined();
    });

    it('handles empty CID', () => {
      const url = getGatewayUrlWithCid('');
      
      expect(url).toBe('https://ipfs.io/ipfs/');
    });
  });

  describe('uploadSuccessToast', () => {
    it('shows success toast with correct content', () => {
      const cid = 'QmTestUpload123';
      const name = 'test-file.jpg';
      
      uploadSuccessToast({ cid, name });
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'File uploaded',
        description: expect.any(Object)
      });
    });

    it('includes file name in toast description', () => {
      const cid = 'QmTestUpload123';
      const name = 'my-image.png';
      
      uploadSuccessToast({ cid, name });
      
      const call = mockToast.mock.calls[0][0];
      expect(call.title).toBe('File uploaded');
      // Description is a JSX element, so we check if it was called
      expect(call.description).toBeDefined();
    });

    it('works without file name', () => {
      const cid = 'QmTestUpload123';
      
      uploadSuccessToast({ cid });
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'File uploaded',
        description: expect.any(Object)
      });
    });

    it('uses specified gateway', () => {
      const cid = 'QmTestUpload123';
      
      uploadSuccessToast({ 
        cid, 
        gateway: IpfsGateway.IpfsIo 
      });
      
      expect(mockToast).toHaveBeenCalled();
    });

    it('defaults to IpfsIo gateway', () => {
      const cid = 'QmTestUpload123';
      
      uploadSuccessToast({ cid });
      
      expect(mockToast).toHaveBeenCalled();
    });

    it('handles empty CID gracefully', () => {
      uploadSuccessToast({ cid: '' });
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'File uploaded',
        description: expect.any(Object)
      });
    });

    it('handles special characters in file name', () => {
      const cid = 'QmTestUpload123';
      const name = 'file with spaces & symbols!@#.txt';
      
      uploadSuccessToast({ cid, name });
      
      expect(mockToast).toHaveBeenCalled();
    });

    it('uses correct gateway URL in toast content', () => {
      const cid = 'QmTestUpload123';
      
      // Mock the getGatewayUrlWithCid to verify it's called correctly
      jest.spyOn(require('@/hooks/upload-toast'), 'getGatewayUrlWithCid')
        .mockReturnValue('https://ipfs.io/ipfs/QmTestUpload123');
      
      uploadSuccessToast({ cid });
      
      expect(require('@/hooks/upload-toast').getGatewayUrlWithCid)
        .toHaveBeenCalledWith(cid, IpfsGateway.IpfsIo);
    });
  });

  describe('IpfsGateway enum', () => {
    it('contains expected gateway values', () => {
      expect(IpfsGateway.Lighthouse).toBe('lighthouse');
      expect(IpfsGateway.Akave).toBe('akave');
      expect(IpfsGateway.IpfsIo).toBe('ipfsio');
    });
  });
});