RealMeta Museum PWA

A complete, production-ready Progressive Web App for museum artwork recognition, AI-powered guides, interactive maps, and visitor analytics.

🚀 Features
Frontend (React + TypeScript + Vite)
📱 PWA Support – Offline-capable, installable web app
🎨 Modern UI – Built with Radix UI components and Tailwind CSS
📷 Camera Scanner – Artwork recognition using device camera
🤖 AI Chatbot – Context-aware Q&A about artworks
🗺️ Interactive Map – Museum navigation with artwork locations
🎧 Audio Narration – Text-to-speech artwork descriptions
🌐 AR View – Augmented reality artwork preview (planned)
📊 Admin Dashboard – Analytics and content management
🎭 No Login Required – Seamless visitor experience

Backend (Node.js + Express + TypeScript) :
🔐 RESTful API – Complete API with authentication
🗄️ MongoDB Database – Scalable document storage
🧠 AI Integration – OpenAI GPT-4 for chatbot and narration
👁️ Image Recognition – Artwork identification from photos
📈 Analytics Engine – Visitor behavior tracking
🔒 Security – Helmet, CORS, rate limiting
📝 Logging – Winston logger with file rotation
🐳 Docker Ready – Containerized deployment

📦 Project Structure
RealMeta Museum PWA/
├── src/                          # Frontend source code
│   ├── components/              
│   │   ├── ui/                  # Reusable UI components
│   │   ├── LandingPage.tsx
│   │   ├── CameraScanner.tsx
│   │   ├── ArtworkPage.tsx
│   │   ├── ChatbotUI.tsx
│   │   ├── MapGuide.tsx
│   │   └── AdminDashboard.tsx
│   ├── lib/                     
│   │   ├── types.ts
│   │   ├── apiService.ts        
│   │   └── mockData.ts
│   ├── App.tsx                  
│   └── main.tsx                 
├── backend/                      
│   ├── src/
│   │   ├── server.ts            
│   │   ├── config/              
│   │   ├── models/              
│   │   ├── routes/              
│   │   ├── services/            
│   │   ├── middleware/          
│   │   └── utils/               
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml            
├── nginx.conf                    
├── package.json                  
├── vite.config.ts                
└── DEPLOYMENT_GUIDE.md 

🛠️ Tech Stack
Frontend
React 18 – UI library
TypeScript – Type safety
Vite – Build tool and dev server
Radix UI – Accessible component primitives
Tailwind CSS – Utility-first styling
Lucide React – Icon library

Backend :
Node.js 18+ – Runtime environment
Express – Web framework
TypeScript – Type safety
MongoDB – NoSQL database
Mongoose – ODM for MongoDB
OpenAI API – AI/ML capabilities
TensorFlow.js – Machine learning
Sharp – Image processing
Winston – Logging
JWT – Authentication
DevOps
Docker – Containerization
Docker Compose – Multi-container orchestration
Nginx – Web server and reverse proxy
PM2 – Process management
GitHub Actions – CI/CD pipeline

🚦 Getting Started
Prerequisites
Node.js 18+
MongoDB 5.0+
npm or yarn

(Optional) Docker & Docker Compose
Quick Start
# Clone repository
git clone <repository-url>
cd "RealMeta Museum PWA"

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
# Set up environment variables

# Backend
cd backend
cp .env.example .env
# Edit .env with your settings

# Frontend
cd ..
cp .env.example .env
# Edit .env with API URL
# Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7.0

# Start backend server
cd backend
npm run dev
# Server runs on http://localhost:5000

# Start frontend dev server
npm run dev
# App runs on http://localhost:5173
Docker Deployment
# Configure environment
cp .env.example .env
# Edit .env for production

# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Access app at http://localhost
📚 API Endpoints
Base URL
http://localhost:5000/api
Key Endpoints

Artworks:
GET /artworks – List artworks
GET /artworks/:id – Artwork by ID
POST /artworks – Create artwork (admin)
PUT /artworks/:id – Update artwork (admin)
DELETE /artworks/:id – Delete artwork (admin)
Recognition
POST /recognition/identify – Identify artwork from image
GET /recognition/ai-info/:artworkId – AI-generated info
GET /recognition/narration/:artworkId – Audio narration
Chat
POST /chat/message – Send message
GET /chat/conversation/:sessionId/:artworkId – Conversation history
Analytics
POST /analytics/track – Track event
GET /analytics/artwork/:artworkId – Artwork analytics
Admin
POST /admin/login – Admin login
GET /admin/summary – Analytics summary (auth)
GET /admin/dashboard – Dashboard data (auth)
Map
GET /map – Get active museum map

🔐 Security
Helmet.js for secure headers
CORS configuration
Rate limiting
JWT authentication for admin
Input validation
File upload restrictions

📈 Performance
Lazy loading components
Image optimization
API response caching
Database indexing
Gzip compression
CDN-ready assets

🧪 Testing
# Backend tests
cd backend
npm test

# Frontend tests
npm test

🎯 Roadmap
 AR artwork viewing with WebXR
 Multi-language support
 Voice commands
 Social sharing features
 Visitor tours and paths
 Admin CMS interface
 Mobile app (React Native)
 Advanced analytics dashboard

🤝 Contributing
Fork the repository
Create a feature branch
Commit your changes
Push to branch
Open a Pull Request

📝 License
This project is licensed under MIT License.

🆘 Support
Read DEPLOYMENT_GUIDE.md
Check logs: docker-compose logs
Open a GitHub issue
Made with ❤️ for museums and art lovers everywhere
