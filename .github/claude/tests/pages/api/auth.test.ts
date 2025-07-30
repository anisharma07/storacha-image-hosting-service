import { GET } from '@/pages/httpcat/api/auth';

// Mock the Storacha content module
jest.mock('@repo/content', () => ({
  createDelegation: jest.fn(),
  initStorachaClient: jest.fn(),
  loadStorachaConfig: jest.fn(),
}));

import { createDelegation, initStorachaClient, loadStorachaConfig } from '@repo/content';

const mockCreateDelegation = createDelegation as jest.MockedFunction<typeof createDelegation>;
const mockInitStorachaClient = initStorachaClient as jest.MockedFunction<typeof initStorachaClient>;
const mockLoadStorachaConfig = loadStorachaConfig as jest.MockedFunction<typeof loadStorachaConfig>;

describe('Auth API Route', () => {
  const mockClient = { upload: jest.fn() };
  const mockSpace = { did: () => 'did:space:test123' };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockLoadStorachaConfig.mockReturnValue({
      keyString: 'test-key',
      proofString: 'test-proof'
    });
    
    mockInitStorachaClient.mockResolvedValue({
      client: mockClient,
      space: mockSpace
    });
    
    mockCreateDelegation.mockResolvedValue('delegation-result');
  });

  const createMockAPIRoute = (searchParams: Record<string, string>) => ({
    params: {},
    request: new Request('http://localhost/api/auth'),
    url: {
      searchParams: {
        get: (key: string) => searchParams[key] || null
      }
    }
  });

  it('returns error when DID is missing', async () => {
    const config = createMockAPIRoute({});
    
    const response = await GET(config);
    
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe('Missing DID');
  });

  it('creates delegation successfully with valid DID', async () => {
    const config = createMockAPIRoute({ did: 'did:user:test456' });
    
    const response = await GET(config);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    
    const result = await response.text();
    expect(result).toBe('delegation-result');
  });

  it('loads Storacha config correctly', async () => {
    const config = createMockAPIRoute({ did: 'did:user:test456' });
    
    await GET(config);
    
    expect(mockLoadStorachaConfig).toHaveBeenCalledTimes(1);
  });

  it('initializes Storacha client with correct parameters', async () => {
    const config = createMockAPIRoute({ did: 'did:user:test456' });
    
    await GET(config);
    
    expect(mockInitStorachaClient).toHaveBeenCalledWith({
      keyString: 'test-key',
      proofString: 'test-proof'
    });
  });

  it('creates delegation with correct parameters', async () => {
    const config = createMockAPIRoute({ did: 'did:user:test456' });
    
    await GET(config);
    
    expect(mockCreateDelegation).toHaveBeenCalledWith(
      {
        client: mockClient,
        spaceDid: 'did:space:test123'
      },
      {
        userDid: 'did:user:test456'
      }
    );
  });

  it('handles empty DID parameter', async () => {
    const config = createMockAPIRoute({ did: '' });
    
    const response = await GET(config);
    
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe('Missing DID');
  });

  it('handles Storacha client initialization failure', async () => {
    mockInitStorachaClient.mockRejectedValue(new Error('Client init failed'));
    
    const config = createMockAPIRoute({ did: 'did:user:test456' });
    
    await expect(GET(config)).rejects.toThrow('Client init failed');
  });

  it('handles delegation creation failure', async () => {
    mockCreateDelegation.mockRejectedValue(new Error('Delegation failed'));
    
    const config = createMockAPIRoute({ did: 'did:user:test456' });
    
    await expect(GET(config)).rejects.toThrow('Delegation failed');
  });

  it('handles config loading failure', async () => {
    mockLoadStorachaConfig.mockImplementation(() => {
      throw new Error('Config loading failed');
    });
    
    const config = createMockAPIRoute({ did: 'did:user:test456' });
    
    await expect(GET(config)).rejects.toThrow('Config loading failed');
  });

  it('processes different DID formats', async () => {
    const testDids = [
      'did:key:z123456789',
      'did:web:example.com',
      'did:ethr:0x123456789abcdef'
    ];
    
    for (const did of testDids) {
      const config = createMockAPIRoute({ did });
      
      const response = await GET(config);
      
      expect(response.status).toBe(200);
      expect(mockCreateDelegation).toHaveBeenCalledWith(
        expect.any(Object),
        { userDid: did }
      );
    }
  });
});