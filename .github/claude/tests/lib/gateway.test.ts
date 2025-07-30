import { getIpfsGatewayUrl } from '@/lib/gateway';

describe('Gateway Utilities', () => {
  describe('getIpfsGatewayUrl', () => {
    it('returns correct IPFS gateway URL', () => {
      const cidWithPath = 'QmTestCid123/image.jpg';
      const url = getIpfsGatewayUrl(cidWithPath);
      
      expect(url).toBe('https://ipfs.io/ipfs/QmTestCid123/image.jpg');
    });

    it('handles CID without path', () => {
      const cid = 'QmTestCid123';
      const url = getIpfsGatewayUrl(cid);
      
      expect(url).toBe('https://ipfs.io/ipfs/QmTestCid123');
    });

    it('handles empty string', () => {
      const url = getIpfsGatewayUrl('');
      
      expect(url).toBe('https://ipfs.io/ipfs/');
    });

    it('handles complex paths', () => {
      const cidWithPath = 'QmTestCid123/folder/subfolder/file.png';
      const url = getIpfsGatewayUrl(cidWithPath);
      
      expect(url).toBe('https://ipfs.io/ipfs/QmTestCid123/folder/subfolder/file.png');
    });

    it('handles special characters in path', () => {
      const cidWithPath = 'QmTestCid123/file%20with%20spaces.jpg';
      const url = getIpfsGatewayUrl(cidWithPath);
      
      expect(url).toBe('https://ipfs.io/ipfs/QmTestCid123/file%20with%20spaces.jpg');
    });

    it('preserves URL encoding', () => {
      const cidWithPath = 'QmTestCid123/file%2Bwith%2Bplus.jpg';
      const url = getIpfsGatewayUrl(cidWithPath);
      
      expect(url).toBe('https://ipfs.io/ipfs/QmTestCid123/file%2Bwith%2Bplus.jpg');
    });

    it('handles very long CIDs', () => {
      const longCid = 'QmVeryLongCidHashThatExceedsNormalLengthButShouldStillWork123456789';
      const url = getIpfsGatewayUrl(longCid);
      
      expect(url).toBe(`https://ipfs.io/ipfs/${longCid}`);
    });

    it('handles query parameters in path', () => {
      const cidWithQuery = 'QmTestCid123/file.jpg?param=value';
      const url = getIpfsGatewayUrl(cidWithQuery);
      
      expect(url).toBe('https://ipfs.io/ipfs/QmTestCid123/file.jpg?param=value');
    });

    it('handles hash fragments in path', () => {
      const cidWithHash = 'QmTestCid123/file.html#section';
      const url = getIpfsGatewayUrl(cidWithHash);
      
      expect(url).toBe('https://ipfs.io/ipfs/QmTestCid123/file.html#section');
    });
  });
});