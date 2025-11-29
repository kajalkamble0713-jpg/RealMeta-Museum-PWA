# RealMeta - AI-Powered Museum PWA

**RealMeta** is a no-login Progressive Web App (PWA) that transforms the museum experience through AI-powered artwork recognition, interactive audio guides, real-time chatbot assistance, interactive floor maps, and WebAR overlays.

## 🎯 Project Overview

**Pitch:** *No-login PWA that recognizes artworks via camera or upload and instantly delivers rich content (text, audio, video), guided tours on a floor map, WebAR overlays, an artwork-scoped chatbot, and anonymized analytics with an admin dashboard.*

**Audience:** Museum visitors (mobile-first), museum staff/admins (dashboard)

**Tech Stack:**
- **Frontend:** React + TypeScript + Tailwind CSS
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **State:** React hooks + localStorage (for demo)
- **Services:** Mock services simulating backend APIs
- **PWA:** Manifest.json + service worker ready

## ✨ Features

### Visitor Features

1. **🔍 Artwork Recognition**
   - Camera-based image capture
   - File upload fallback
   - Mock recognition engine (keyword-based for demo)
   - Confidence scoring

2. **🎵 Audio Narration**
   - Pre-generated audio guides
   - Web Speech API fallback
   - Playback controls (play/pause, seek, volume)
   - Analytics tracking

3. **💬 AI Art Guide Chatbot**
   - Artwork-scoped Q&A
   - Context-aware responses
   - Suggested questions
   - Conversation history

4. **🗺️ Interactive Museum Map**
   - Floor plan visualization
   - Artwork locations
   - Room information
   - Navigation assistance
   - Current location indicator

5. **📱 WebAR Experience**
   - Camera-based AR overlay
   - Artwork marker detection (simulated)
   - Augmented content display
   - Fallback instructions

6. **📚 Rich Content**
   - High-quality artwork images
   - Artist information
   - Historical context
   - Technique details
   - AI-generated insights
   - Related artworks

### Admin Features

7. **📊 Analytics Dashboard**
   - Password-protected access (demo: `demo123`)
   - Top viewed artworks
   - Average dwell time
   - Total scans and interactions
   - Recent activity log
   - Data export (JSON)

8. **🔒 Privacy & Consent**
   - Anonymous session tracking
   - GDPR-compliant consent banner
   - No PII collection
   - Local storage only (demo mode)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for backend in production)
- Modern browser with camera access
- (Optional) HTTPS for camera/AR features

### Installation

This is a frontend-only demo. Simply open in a browser:

1. **Clone or download** the project
2. **Open** `index.html` in your browser
3. **Grant camera permissions** when prompted (for scan/AR features)

### Demo Mode

The application runs in **mock mode** by default:
- All data is stored in browser localStorage
- No external API calls
- Recognition based on filename keywords
- Chatbot uses predefined responses
- Audio uses Web Speech API fallback

### Demo Credentials

- **Admin Password:** `demo123`

### Sample Recognition Keywords

Upload or name files with these keywords to match artworks:
- `starry` → The Starry Night
- `pearl` → Girl with a Pearl Earring
- `scream` → The Scream
- `kiss` → The Kiss
- `venus` → The Birth of Venus
- `guernica` → Guernica
- `gothic` → American Gothic
- `dali` or `clock` → The Persistence of Memory

## 📱 PWA Features

### Installation

On supported devices:
1. Visit the app in a browser
2. Look for "Add to Home Screen" prompt
3. Install for offline access

### Offline Support

- Service worker caching (manifest ready)
- Artwork data cached in localStorage
- Previously viewed artworks available offline

## 🎨 Design System

### Color Palette

- **Primary Brown:** `#8B4513` - Buttons, accents
- **Warm Beige:** `#FAF6F1` - Background, cards
- **Accent Tan:** `#D4A574` - Borders, highlights
- **Dark Brown:** `#6D3410` - Hover states
- **Charcoal:** `#2C2C2C` - Text, headings
- **Medium Gray:** `#6B6B6B` - Secondary text

### Typography

- Headings: Default system font stack
- Body: Default system font stack
- All responsive and accessible

## 🏗️ Architecture

### Frontend Structure

```
/
├── components/
│   ├── ArtworkPage.tsx        # Main artwork detail view
│   ├── CameraScanner.tsx      # Recognition interface
│   ├── ChatbotUI.tsx          # AI chatbot
│   ├── MapGuide.tsx           # Interactive map
│   ├── ARView.tsx             # WebAR overlay
│   ├── AudioPlayer.tsx        # Audio narration
│   ├── AdminDashboard.tsx     # Analytics & admin
│   ├── ConsentBanner.tsx      # Privacy consent
│   ├── LandingPage.tsx        # Home screen
│   └── ui/                    # Shadcn components
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── mockData.ts            # Sample artwork data
│   └── mockServices.ts        # API simulation
├── App.tsx                    # Main router
└── styles/globals.css         # Global styles
```

### Data Flow

1. **User scans artwork** → CameraScanner captures image
2. **Image sent to recognition** → mockServices.identifyArtwork()
3. **Artwork matched** → Navigate to ArtworkPage
4. **User interacts** → Analytics tracked (if consented)
5. **User asks question** → ChatbotUI sends to mockServices
6. **Admin views stats** → AdminDashboard fetches from localStorage

## 🔧 Mock Services

All backend functionality is simulated:

### Recognition Service
- Matches keywords in filenames
- Returns confidence scores
- Simulates network delay

### AI Services
- Chatbot: Keyword-based responses
- Content generation: Template-based
- Rate limiting: Client-side

### Storage
- Artworks: In-memory mock data
- Analytics: localStorage
- Favorites: localStorage

## 📊 Analytics

### Tracked Events

- `view` - Artwork page view
- `recognize` - Image scan attempt
- `audio_play` - Audio playback
- `chat_query` - Chatbot question
- `map_route` - Map interaction
- `exit` - Page exit (with dwell time)

### Privacy

- Session IDs are random UUIDs
- No IP addresses stored
- No personal information collected
- User can opt out via consent banner

## 🎯 Usage Guide

### For Visitors

1. **Start Tour**
   - Click "Start Tour" on landing page
   - Grant camera permissions
   - Point at artwork or upload image
   - View recognition results

2. **Explore Artwork**
   - Read description and history
   - Play audio narration
   - Ask chatbot questions
   - View on museum map
   - Try AR experience (if available)

3. **Browse Collection**
   - Search by title, artist, or tag
   - Click any artwork card
   - Navigate related works

### For Admins

1. **Access Dashboard**
   - Click "Admin Dashboard" in footer
   - Enter password: `demo123`
   - View analytics summary

2. **Export Data**
   - Click "Export" button
   - Downloads JSON file with analytics

## 🔐 Security Notes

**Demo Mode:**
- Admin password is hardcoded for demo
- All data stored locally in browser
- No server-side validation

**Production Recommendations:**
- Use OAuth 2.0 for admin access
- Implement server-side rate limiting
- Use HTTPS everywhere
- Implement CORS properly
- Hash/anonymize IP addresses
- Use environment variables for secrets

## 🌐 Browser Support

- **Chrome/Edge:** Full support
- **Safari:** Full support (iOS 11.3+)
- **Firefox:** Full support
- **Camera/AR:** Requires HTTPS (except localhost)

## 🎁 Sample Data

### Included Artworks (8)

1. The Starry Night - Vincent van Gogh (1889)
2. Girl with a Pearl Earring - Johannes Vermeer (1665)
3. The Scream - Edvard Munch (1893)
4. The Kiss - Gustav Klimt (1908)
5. The Birth of Venus - Sandro Botticelli (1485)
6. Guernica - Pablo Picasso (1937)
7. American Gothic - Grant Wood (1930)
8. The Persistence of Memory - Salvador Dalí (1931)

## 🚧 Future Enhancements

### Backend Integration
- Real Google Vision API for recognition
- OpenAI/Gemini for chatbot
- Cloud TTS for narration
- Firebase/Supabase for database
- Real-time analytics

### Features
- Multi-language support
- Voice input for chatbot
- Social sharing
- User profiles (optional)
- Artwork favorites sync
- Push notifications for events
- Advanced AR with 3D models
- Accessibility improvements

### Infrastructure
- Service worker implementation
- CDN for assets
- Redis caching
- Rate limiting middleware
- Monitoring & logging

## 📄 License

Demo/Educational Project

## 🤝 Contributing

This is a demo/prototype. For production use, implement:
1. Real backend API
2. Authentication system
3. Database integration
4. Security hardening
5. Testing suite
6. CI/CD pipeline

## 🐛 Troubleshooting

### Camera not working
- Check browser permissions
- Ensure HTTPS (or localhost)
- Try file upload fallback

### Recognition not matching
- Use demo keywords in filename
- Check file size (<5MB)
- Ensure image format (JPEG/PNG)

### Admin login fails
- Use password: `demo123`
- Check browser console for errors

### Data not persisting
- Check localStorage is enabled
- Try clearing cache
- Verify browser compatibility

## 📞 Support

For questions or issues with this demo:
- Check browser console for errors
- Review mock data in `/lib/mockData.ts`
- Verify localStorage permissions

---

**Built with ❤️ for Museum Visitors Everywhere**

*Demo Mode - Ready for Backend Integration*
