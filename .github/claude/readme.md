# 🐱 Storacha Image Hosting Service

**Storacha Image Service** is a decentralized image hosting micro-CMS inspired by [http.cat](https://http.cat/) that serves HTTP status code images via IPFS/Filecoin. Built as a modern monorepo, it demonstrates Storacha's UCAN delegation flow while enabling end-users to contribute images through a decentralized workflow, showcasing the power of Web3 storage for cost-effective, performant image services.

### 🚀 [Demo Video](https://bafybeifqd3546gsizaqzxuptlnbstugqi22qhhk57uam4has6ivfqtdlf4.ipfs.w3s.link/)

## 🚀 Features

- **🔗 Decentralized Storage**: Images stored on IPFS/Filecoin via Storacha network
- **🎭 UCAN Delegation Flow**: Secure, decentralized user authentication and authorization
- **🏗️ Monorepo Architecture**: Organized with Turborepo for efficient development
- **📱 Modern CMS Interface**: React-based content management with Astro SSR
- **🎨 HTTP Status Code Images**: Complete collection of HTTP status code cat images
- **👥 User Contributions**: End-users can upload and contribute new images
- **⚡ Multi-Platform Deployment**: Support for Render, Cloudflare Pages, and Fleek
- **🎯 TypeScript First**: Full TypeScript implementation for type safety
- **📦 Component Library**: Shared UI components with shadcn/ui

## 🛠️ Tech Stack

### Frontend
- **Framework**: Astro 5.0+ with React integration
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom configuration
- **State Management**: React Hook Form with Zod validation
- **Icons**: Lucide React icons
- **TypeScript**: Full type safety across all components

### Backend/Services
- **Storage**: Storacha (IPFS/Filecoin) for decentralized asset storage
- **Authentication**: UCAN (User Controlled Authorization Networks)
- **API Routes**: Astro API endpoints with SSR support
- **File Upload**: Custom upload flow with progress tracking

### Development Tools
- **Build System**: Turborepo for monorepo management
- **Package Manager**: pnpm with workspace support
- **Code Quality**: Biome for linting and formatting
- **Bundler**: Vite for fast development and building
- **Type Checking**: TypeScript with strict configuration

### Deployment Platforms
- **Render**: Node.js adapter deployment
- **Cloudflare Pages**: Edge deployment (in progress)
- **Fleek**: IPFS hosting (planned)

## 📁 Project Structure

```
├── apps/
│   ├── cms/                    # Astro-based CMS application
│   │   ├── src/
│   │   │   ├── components/     # React UI components
│   │   │   ├── pages/          # Astro pages and API routes
│   │   │   ├── layouts/        # Page layouts
│   │   │   └── content/        # Content collections
│   │   └── public/             # Static assets
│   └── web/                    # Vite web application
│       └── src/                # TypeScript source files
├── packages/
│   ├── content/                # Content management utilities
│   │   ├── adapters/           # Storage adapters (Storacha, FS)
│   │   └── httpcat/            # HTTP cat image assets
│   ├── ui/                     # Shared UI components
│   └── typescript-config/      # Shared TypeScript configurations
├── .github/workflows/          # CI/CD workflows
└── configuration files         # Turbo, Biome, package configs
```

## 🔧 Installation & Setup

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 8.15.6+ (specified as package manager)
- **Git** for version control

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/anisharma07/storacha-image-hosting-service.git
cd storacha-image-hosting-service

# Install dependencies
pnpm install

# Set up environment variables
cp env.sample .env
# Edit .env with your Storacha credentials
```

### Environment Configuration

Create a `.env` file with the following variables:

```bash
# Storacha Configuration
STORACHA_KEY_STRING=your_storacha_key
STORACHA_PROOF_STRING=your_storacha_proof
```

## 🎯 Usage

### Development

```bash
# Start all applications in development mode
pnpm dev

# Start specific application
pnpm --filter cms dev
pnpm --filter web dev

# Run linting and formatting
pnpm lint
pnpm check
pnpm check:fix
```

### Production

```bash
# Build all applications
pnpm build

# Build specific application
pnpm --filter cms build
```

### Content Management

```bash
# Upload HTTP cat images to Storacha
env-cmd pnpm --filter content upload:httpcat
```

## 📱 Platform Support

- **Web Browsers**: Modern browsers with ES2020+ support
- **Mobile**: Responsive design for mobile devices
- **Server**: Node.js 18+ for SSR deployment
- **Edge**: Cloudflare Workers (in development)

## 🧪 Testing

The project includes test files for core functionality:

```bash
# Run tests for content package
pnpm --filter content test

# Test files available:
# - packages/content/adapters/entry.test.ts
# - packages/content/adapters/fs.test.ts
```

## 🔄 Deployment

### Render Deployment

```bash
# Deploy CMS to Render (Node.js adapter)
env-cmd pnpm --filter cms deploy
```

### Cloudflare Pages

```bash
# Build for Cloudflare deployment
pnpm --filter cms build

# Deploy using Wrangler
wrangler pages deploy
```

### Environment Variables for Deployment

Ensure the following environment variables are set in your deployment platform:

- `STORACHA_KEY_STRING`
- `STORACHA_PROOF_STRING`

## 📊 Performance & Optimization

- **Static Site Generation**: Astro pre-renders pages for optimal performance
- **Image Optimization**: IPFS content addressing ensures efficient caching
- **Code Splitting**: Vite automatically splits code for optimal loading
- **Tree Shaking**: Unused code is eliminated during build process
- **CDN Distribution**: IPFS provides global content distribution

## 🔐 UCAN Delegation Flow

The project demonstrates Storacha's UCAN delegation pattern:

1. **User Authentication**: Users authenticate with their DID (Decentralized Identifier)
2. **Delegation Creation**: Server creates UCAN delegation for user uploads
3. **Authorized Uploads**: Users can upload directly to Storacha using delegated permissions
4. **Decentralized Verification**: All operations are cryptographically verifiable

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- **Code Style**: Use Biome for consistent formatting (`pnpm check:fix`)
- **Type Safety**: Maintain full TypeScript coverage
- **Component Structure**: Follow established patterns in the UI package
- **Testing**: Add tests for new functionality in the content package
- **Documentation**: Update README and inline documentation as needed

### Adding New HTTP Status Codes

1. Add image assets to `packages/content/httpcat/`
2. Update the content adapter to include new status codes
3. Test upload functionality with `pnpm --filter content upload:httpcat`

## 📄 License

This project is open source. Please refer to the repository for license details.

## 🙏 Acknowledgments

- **Storacha Network** - For providing decentralized storage infrastructure
- **http.cat** - Original inspiration for HTTP status code images
- **shadcn/ui** - Beautiful and accessible UI components
- **Astro Team** - For the modern web framework
- **Turborepo** - For excellent monorepo tooling

## 📞 Support & Contact

- **Repository**: [anisharma07/storacha-image-hosting-service](https://github.com/anisharma07/storacha-image-hosting-service)
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions and community interaction

---

*Built with ❤️ using Storacha, Astro, and modern Web3 technologies*