# RealMeta Museum PWA

A complete, production-ready Progressive Web App for museum artwork recognition, AI-powered guides, interactive maps, and visitor analytics.

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- 📱 **PWA Support** - Offline-capable, installable web app
- 🎨 **Modern UI** - Built with Radix UI components and Tailwind CSS
- 📷 **Camera Scanner** - Artwork recognition using device camera
- 🤖 **AI Chatbot** - Context-aware Q&A about artworks
- 🗺️ **Interactive Map** - Museum navigation with artwork locations
- 🎧 **Audio Narration** - Text-to-speech artwork descriptions
- 🌐 **AR View** - Augmented reality artwork preview (planned)
- 📊 **Admin Dashboard** - Analytics and content management
- 🎭 **No Login Required** - Seamless visitor experience

### Backend (Node.js + Express + TypeScript)
- 🔐 **RESTful API** - Complete API with authentication
- 🗄️ **MongoDB Database** - Scalable document storage
- 🧠 **AI Integration** - OpenAI GPT-4 for chatbot and narration
- 👁️ **Image Recognition** - Artwork identification from photos
- 📈 **Analytics Engine** - Visitor behavior tracking
- 🔒 **Security** - Helmet, CORS, rate limiting
- 📝 **Logging** - Winston logger with file rotation
- 🐳 **Docker Ready** - Containerized deployment

## 📦 Project Structure

```
RealMeta Museum PWA/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── LandingPage.tsx
│   │   ├── CameraScanner.tsx
│   │   ├── ArtworkPage.tsx
│   │   ├── ChatbotUI.tsx
│   │   ├── MapGuide.tsx
│   │   └── AdminDashboard.tsx
│   ├── lib/                     # Utilities and types
│   │   ├── types.ts
│   │   ├── apiService.ts        # API integration
│   │   └── mockData.ts
│   ├── App.tsx                  # Main application
│   └── main.tsx                 # Entry point
├── backend/                      # Backend API server
│   ├── src/
│   │   ├── server.ts            # Express server
│   │   ├── config/              # Configuration
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── middleware/          # Express middleware
│   │   └── utils/               # Utilities
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml            # Multi-container setup
├── nginx.conf                    # Web server config
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite configuration
└── DEPLOYMENT_GUIDE.md           # Deployment instructions
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **Node.js 18+** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **OpenAI API** - AI/ML capabilities
- **TensorFlow.js** - Machine learning
- **Sharp** - Image processing
- **Winston** - Logging
- **JWT** - Authentication

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server and reverse proxy
- **PM2** - Process management
- **GitHub Actions** - CI/CD pipeline

## 🚦 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB 5.0+
- npm or yarn
- (Optional) Docker & Docker Compose

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd "RealMeta Museum PWA"
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

3. **Set up environment variables**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your settings

# Frontend
cd ..
cp .env.example .env
# Edit .env with API URL
```

4. **Start MongoDB**
```bash
docker run -d -p 27017:27017 --name mongo mongo:7.0
```

5. **Start backend server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

6. **Start frontend dev server**
```bash
npm run dev
# App runs on http://localhost:5173
```

### Docker Deployment (Production)

```bash
# Configure environment
cp .env.example .env
# Edit .env with production settings

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Access app at http://localhost
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Artworks
- `GET /artworks` - List all artworks
- `GET /artworks/:id` - Get artwork by ID
- `POST /artworks` - Create artwork (admin)
- `PUT /artworks/:id` - Update artwork (admin)
- `DELETE /artworks/:id` - Delete artwork (admin)

#### Recognition
- `POST /recognition/identify` - Identify artwork from image
- `GET /recognition/ai-info/:artworkId` - Get AI-generated info
- `GET /recognition/narration/:artworkId` - Get audio narration

#### Chat
- `POST /chat/message` - Send chat message
- `GET /chat/conversation/:sessionId/:artworkId` - Get conversation history

#### Analytics
- `POST /analytics/track` - Track event
- `GET /analytics/artwork/:artworkId` - Get artwork analytics

#### Admin
- `POST /admin/login` - Admin login
- `GET /admin/summary` - Get analytics summary (auth required)
- `GET /admin/dashboard` - Get dashboard data (auth required)

#### Map
- `GET /map` - Get active museum map

## 🔧 Configuration

### Backend Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realmeta_museum
JWT_SECRET=your-secret-key
ADMIN_PASSWORD=your-password
OPENAI_API_KEY=sk-...
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

## 📊 Features in Detail

### Image Recognition
- Upload or capture artwork photos
- AI-powered artwork identification
- Confidence scoring
- Fallback suggestions

### AI Chatbot
- Context-aware conversations
- Artwork-specific knowledge
- Natural language processing
- Conversation history

### Analytics Dashboard
- Visitor engagement metrics
- Popular artworks tracking
- Dwell time analysis
- Real-time event tracking

### Museum Map
- Interactive floor plan
- Artwork locations
- Room navigation
- Route planning

## 🔐 Security

- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting
- JWT authentication for admin
- Input validation
- File upload restrictions

## 📈 Performance

- Lazy loading components
- Image optimization
- API response caching
- Database indexing
- Gzip compression
- CDN-ready assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For help and support:
- Read the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Check the logs: `docker-compose logs`
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] AR artwork viewing with WebXR
- [ ] Multi-language support
- [ ] Voice commands
- [ ] Social sharing features
- [ ] Visitor tours and paths
- [ ] Admin CMS interface
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

## 👏 Acknowledgments

- Figma design: [RealMeta Museum PWA](https://www.figma.com/design/WJdeeLMYRyvtsolH5RoPPg/)
- Built with modern web technologies
- Powered by OpenAI for AI capabilities

---

**Made with ❤️ for museums and art lovers everywhere**
