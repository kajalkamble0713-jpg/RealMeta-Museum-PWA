# RealMeta Technical Documentation

Complete technical reference for the RealMeta museum PWA.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Type System](#type-system)
3. [Mock Services](#mock-services)
4. [Component Reference](#component-reference)
5. [State Management](#state-management)
6. [Analytics System](#analytics-system)
7. [API Contract](#api-contract)
8. [Backend Integration Guide](#backend-integration-guide)

---

## Architecture Overview

### Technology Stack

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
├─────────────────────────────────────┤
│  • TypeScript                       │
│  • Tailwind CSS                     │
│  • Shadcn/ui Components            │
│  • Lucide Icons                     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│       Mock Service Layer            │
├─────────────────────────────────────┤
│  • /lib/mockServices.ts             │
│  • localStorage for persistence     │
│  • Simulated network delays         │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         Data Layer                  │
├─────────────────────────────────────┤
│  • /lib/mockData.ts                 │
│  • 8 sample artworks                │
│  • Museum map structure             │
└─────────────────────────────────────┘
```

### Component Hierarchy

```
App.tsx
├── LandingPage
│   ├── Feature Cards
│   ├── Artwork Gallery Grid
│   └── Privacy Section
├── CameraScanner
│   ├── Video Stream
│   ├── File Upload
│   └── Recognition Results
├── ArtworkPage
│   ├── Hero Image
│   ├── AudioPlayer
│   ├── Content Tabs
│   ├── ChatbotUI (modal)
│   ├── MapGuide (modal)
│   └── ARView (modal)
├── AdminDashboard
│   ├── Metrics Cards
│   ├── Charts
│   └── Data Tables
└── ConsentBanner
```

---

## Type System

### Core Types (`/lib/types.ts`)

#### Artwork

```typescript
interface Artwork {
  id: string;                    // Unique slug (e.g., "starry-night")
  title: string;                 // Display title
  artist: string;                // Artist name
  year: number;                  // Year created
  shortBlurb: string;            // ~100 char summary
  longStory: string;             // Full HTML content
  technique: string;             // Medium and technique
  provenance: string;            // History and ownership
  imageUrl: string;              // Primary image URL
  audioUrl?: string;             // Audio narration URL
  videoUrl?: string;             // Video content URL
  tags: string[];                // Categorization tags
  related: string[];             // Related artwork IDs
  galleryLocation: {
    room: string;                // Gallery room name
    x: number;                   // Map X coordinate
    y: number;                   // Map Y coordinate
  };
  arMarker?: {
    markerId: string;            // AR marker identifier
    markerFile: string;          // Marker image URL
  };
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

#### AnalyticsEvent

```typescript
interface AnalyticsEvent {
  id: string;                    // UUID
  sessionId: string;             // Anonymous session ID
  artworkId: string;             // Related artwork
  event: 'view' | 'audio_play' | 'chat_query' | 
         'exit' | 'map_route' | 'recognize';
  timestamp: string;             // ISO timestamp
  durationSeconds?: number;      // For timed events
  meta?: {
    userAgent?: string;
    approximateLocation?: string;
  };
}
```

#### MuseumMap

```typescript
interface MuseumMap {
  name: string;
  imageUrl: string;
  rooms: Array<{
    id: string;
    name: string;
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    description: string;
  }>;
  artworks: Array<{
    artworkId: string;
    x: number;
    y: number;
  }>;
}
```

---

## Mock Services

### Service Layer (`/lib/mockServices.ts`)

All services simulate network delays and return promises.

#### Session Management

```typescript
export const getSessionId = (): string
```
Returns or creates anonymous session ID (UUID).

**Storage:** `localStorage.realmeta_session_id`

#### Analytics Consent

```typescript
export const hasAnalyticsConsent = (): boolean
export const setAnalyticsConsent = (consent: boolean): void
```

**Storage:** `localStorage.realmeta_analytics_consent`

#### Image Recognition

```typescript
export const identifyArtwork = async (
  imageFile: File
): Promise<IdentifyResult>
```

**Implementation:**
1. Simulate 1500ms delay
2. Extract filename
3. Match keywords against `MOCK_RECOGNITION_DATABASE`
4. Return match with confidence score or alternatives

**Recognition Database:**
```typescript
{
  'starry': 'starry-night',
  'pearl': 'girl-with-pearl',
  'scream': 'the-scream',
  // ... etc
}
```

#### Artwork Retrieval

```typescript
export const getArtwork = async (
  id: string
): Promise<Artwork | null>
```

**Implementation:**
- 300ms simulated delay
- Linear search through `MOCK_ARTWORKS`
- Returns null if not found

#### AI Content Generation

```typescript
export const getAIInfo = async (
  artworkId: string,
  type: 'background' | 'analysis'
): Promise<{ text: string }>
```

**Implementation:**
- 1200ms simulated delay
- Template-based generation using artwork data
- Returns ~300 words for background, ~150 for analysis

#### Chat Service

```typescript
export const sendChatMessage = async (
  sessionId: string,
  artworkId: string,
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<{ replyText: string }>
```

**Implementation:**
- Keyword-based response matching
- Artwork-scoped only
- Predefined response templates
- ~120 word limit per response

**Keyword Patterns:**
- `when/year/created` → Creation date info
- `artist/who` → Artist information
- `technique/how` → Technique details
- `meaning/symbolism` → Interpretation
- `location/where` → Gallery location
- `similar/related` → Related works

#### Analytics Tracking

```typescript
export const trackEvent = async (
  event: Omit<AnalyticsEvent, 'id'>
): Promise<void>
```

**Implementation:**
- Check consent first
- Generate UUID for event
- Append to localStorage array
- No network call in demo mode

**Storage:** `localStorage.realmeta_analytics` (JSON array)

#### Admin Services

```typescript
export const getAdminSummary = async (
  adminPass: string
): Promise<AdminSummary>

export const getAdminEvents = async (
  adminPass: string,
  limit: number = 100
): Promise<AnalyticsEvent[]>
```

**Password Check:** Hardcoded `demo123` in mock mode

---

## Component Reference

### LandingPage

**Props:**
```typescript
interface LandingPageProps {
  onStartScan: () => void;
  onViewMap: () => void;
  onViewArtwork: (artworkId: string) => void;
  onViewAdmin: () => void;
}
```

**Features:**
- Hero section with CTA buttons
- Feature cards (3-column grid)
- Searchable artwork gallery
- Privacy section
- Footer with admin link

**State:**
- `artworks: Artwork[]` - Full collection
- `searchQuery: string` - Search filter
- `filteredArtworks: Artwork[]` - Filtered results

### CameraScanner

**Props:**
```typescript
interface CameraScannerProps {
  onArtworkIdentified: (artworkId: string) => void;
  onClose: () => void;
}
```

**Features:**
- MediaDevices API for camera access
- Canvas capture for photo
- File input fallback
- Recognition processing UI
- Success/error states

**State:**
- `stream: MediaStream | null`
- `useCamera: boolean`
- `isProcessing: boolean`
- `result: IdentifyResult | null`
- `error: string`

**Camera Flow:**
1. Request permissions
2. Start video stream
3. User captures frame
4. Convert to Blob
5. Call recognition service
6. Display results
7. Auto-navigate on success

### ArtworkPage

**Props:**
```typescript
interface ArtworkPageProps {
  artworkId: string;
  onBack: () => void;
  onNavigate: (artworkId: string) => void;
}
```

**Features:**
- Hero image with overlay
- Audio player integration
- Tabbed content (Story, Technique, AI)
- Favorite toggle (localStorage)
- Share functionality
- Related artworks
- Modal triggers (Chat, Map, AR)

**State:**
- `artwork: Artwork | null`
- `aiBackground: string`
- `aiAnalysis: string`
- `loadingAI: boolean`
- `isChatOpen: boolean`
- `isMapOpen: boolean`
- `isAROpen: boolean`
- `isFavorite: boolean`

**Analytics Tracking:**
- `view` event on mount
- `exit` event on unmount (with dwell time)

### AudioPlayer

**Props:**
```typescript
interface AudioPlayerProps {
  audioUrl?: string;
  artworkId: string;
  artworkTitle: string;
  fallbackText?: string;
}
```

**Features:**
- HTML5 audio playback
- Custom controls (play, pause, seek, volume)
- Web Speech API fallback
- Progress bar with time display
- Analytics on play/pause

**State:**
- `isPlaying: boolean`
- `currentTime: number`
- `duration: number`
- `volume: number`
- `isMuted: boolean`
- `useFallback: boolean` (for TTS)

### ChatbotUI

**Props:**
```typescript
interface ChatbotUIProps {
  artworkId: string;
  artworkTitle: string;
  isOpen: boolean;
  onClose: () => void;
}
```

**Features:**
- Real-time message UI
- Suggested questions
- Auto-scroll to new messages
- Loading indicator
- Mobile-optimized modal

**State:**
- `messages: ChatMessage[]`
- `input: string`
- `isLoading: boolean`

**Initial Message:**
System greeting with artwork title

**Suggested Questions:**
- "When was this created?"
- "What technique was used?"
- "Tell me about the artist"
- "What does it symbolize?"
- "Where is it located?"

### MapGuide

**Props:**
```typescript
interface MapGuideProps {
  currentArtworkId?: string;
  onNavigateToArtwork?: (artworkId: string) => void;
  onClose: () => void;
}
```

**Features:**
- SVG-based floor plan
- Interactive room highlighting
- Artwork markers (clickable)
- Current location animation
- Artwork detail panel
- Navigation button

**State:**
- `map: MuseumMap | null`
- `selectedArtworkId: string | null`
- `selectedArtwork: Artwork | null`
- `hoveredRoom: string | null`

**Map Coordinates:**
- Canvas: 750x550 viewBox
- Rooms defined by bounds (x, y, width, height)
- Artworks positioned at (x, y) coordinates

### ARView

**Props:**
```typescript
interface ARViewProps {
  artwork: Artwork;
  onClose: () => void;
}
```

**Features:**
- Camera video feed
- Marker scanning UI
- Simulated marker detection
- AR content overlay
- Instructions panel

**State:**
- `stream: MediaStream | null`
- `error: string`
- `isScanning: boolean`
- `markerDetected: boolean`

**AR Flow:**
1. Request camera
2. Display scanning frame
3. Simulate marker detection (3 sec delay)
4. Show overlay with artwork info
5. User can close or continue

### AdminDashboard

**Props:**
```typescript
interface AdminDashboardProps {
  onBack: () => void;
}
```

**Features:**
- Password authentication
- Key metrics cards
- Top viewed artworks chart
- Recent activity feed
- Artwork collection table
- Data export (JSON download)
- Refresh functionality

**State:**
- `isAuthenticated: boolean`
- `password: string`
- `summary: AdminSummary | null`
- `events: AnalyticsEvent[]`
- `artworks: Artwork[]`

**Metrics Calculated:**
- Total views: Count of 'view' events
- Total scans: Count of 'recognize' events
- Avg dwell: Mean of durationSeconds
- Total interactions: Total event count

---

## State Management

### Global State (localStorage)

```typescript
// Session
localStorage.getItem('realmeta_session_id')
// Analytics consent
localStorage.getItem('realmeta_analytics_consent')
// Events
localStorage.getItem('realmeta_analytics')
// Favorites
localStorage.getItem('realmeta_favorites')
```

### Component State

All components use React hooks:
- `useState` for local state
- `useEffect` for side effects
- `useRef` for DOM references and values that don't trigger re-render

### No Global State Manager

Intentionally simple:
- Props drilling for shared data
- localStorage for persistence
- Services called directly from components

**Reason:** Demo simplicity, easy to understand, production would use Context or Redux.

---

## Analytics System

### Event Types

```typescript
type EventType = 
  | 'view'        // Artwork page viewed
  | 'audio_play'  // Audio narration played
  | 'chat_query'  // Chat question asked
  | 'exit'        // User left artwork page
  | 'map_route'   // Map interaction
  | 'recognize';  // Recognition attempted
```

### Event Schema

```json
{
  "id": "evt-1699123456789-abc123",
  "sessionId": "sess-1699123400000-xyz789",
  "artworkId": "starry-night",
  "event": "view",
  "timestamp": "2025-11-03T10:30:00Z",
  "durationSeconds": 45,
  "meta": {
    "userAgent": "Mozilla/5.0...",
    "approximateLocation": "Gallery A"
  }
}
```

### Privacy Measures

1. **Session IDs:** Random UUID, no PII
2. **No IP Storage:** Not collected
3. **Optional Meta:** Only if useful for UX
4. **Consent Required:** User must opt-in
5. **Local Storage:** No server in demo

### Aggregation Logic

```typescript
// Top Viewed
events
  .filter(e => e.event === 'view')
  .reduce((acc, e) => {
    acc[e.artworkId] = (acc[e.artworkId] || 0) + 1;
    return acc;
  }, {});

// Average Dwell
events
  .filter(e => e.durationSeconds)
  .reduce((sum, e) => sum + e.durationSeconds, 0) 
  / events.length;
```

---

## API Contract

### Public Endpoints (Future Backend)

#### POST /api/identify

**Request:**
```typescript
// Multipart form
{
  image: File
}
// Or JSON
{
  imageBase64: string
}
```

**Response (Success):**
```json
{
  "found": true,
  "artworkId": "starry-night",
  "confidence": 0.92
}
```

**Response (Not Found):**
```json
{
  "found": false,
  "alternatives": [
    { "tag": "painting", "score": 0.45 },
    { "tag": "landscape", "score": 0.38 }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid image
- `413` - File too large
- `429` - Rate limited
- `500` - Server error

#### GET /api/artwork/:id

**Response:**
```json
{
  "id": "starry-night",
  "title": "The Starry Night",
  "artist": "Vincent van Gogh",
  // ... full Artwork object
}
```

**Status Codes:**
- `200` - Found
- `404` - Not found

#### GET /api/ai-info/:id

**Query Params:**
- `type`: `background` | `analysis`

**Response:**
```json
{
  "id": "starry-night",
  "type": "background",
  "text": "Generated content..."
}
```

#### POST /api/chat

**Request:**
```json
{
  "sessionId": "sess-123",
  "artworkId": "starry-night",
  "userMessage": "When was this painted?"
}
```

**Response:**
```json
{
  "replyText": "The Starry Night was painted in..."
}
```

#### GET /api/narrate/:id

**Query Params:**
- `voice`: TTS voice (optional)
- `format`: `mp3` | `wav` (default mp3)

**Response:**
- Content-Type: `audio/mpeg`
- Stream or redirect to cached URL

#### POST /api/analytics

**Request:**
```json
{
  "sessionId": "sess-123",
  "artworkId": "starry-night",
  "event": "view",
  "timestamp": "2025-11-03T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true
}
```

#### GET /api/map

**Response:**
```json
{
  "name": "Museum Floor Plan",
  "rooms": [...],
  "artworks": [...]
}
```

### Admin Endpoints (Protected)

**Authentication:**
Header: `x-admin-pass: <password>`  
Or: `Authorization: Bearer <token>`

#### GET /api/admin/summary

**Response:**
```json
{
  "topViewed": [
    { "artworkId": "...", "views": 42, "title": "..." }
  ],
  "avgDwell": 45.2,
  "totalScans": 123,
  "totalInteractions": 456
}
```

#### GET /api/admin/events

**Query Params:**
- `limit`: number (default 100)

**Response:**
```json
[
  { "id": "...", "sessionId": "...", "event": "view", ... }
]
```

---

## Backend Integration Guide

### Step 1: Create API Service Layer

Replace mock services with real API calls:

```typescript
// lib/apiService.ts
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const identifyArtwork = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch(`${API_BASE}/api/identify`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) throw new Error('Recognition failed');
  return await response.json();
};
```

### Step 2: Update Component Imports

```typescript
// Before
import { identifyArtwork } from '../lib/mockServices';

// After
import { identifyArtwork } from '../lib/apiService';
```

### Step 3: Add Error Handling

```typescript
try {
  const result = await identifyArtwork(file);
  // ...
} catch (error) {
  if (error.response?.status === 429) {
    setError('Too many requests. Please wait.');
  } else {
    setError('Recognition failed. Please try again.');
  }
}
```

### Step 4: Environment Configuration

```typescript
// .env.local
REACT_APP_API_URL=https://api.realmeta.com
REACT_APP_USE_MOCK=false
```

### Step 5: Feature Toggle

```typescript
// lib/services.ts
const useMock = process.env.REACT_APP_USE_MOCK === 'true';

export const identifyArtwork = useMock
  ? mockServices.identifyArtwork
  : apiService.identifyArtwork;
```

---

## Performance Considerations

### Current Optimizations

- Lazy loading images (native `loading="lazy"`)
- React component memoization potential
- localStorage caching
- Debounced search input

### Future Optimizations

- Code splitting by route
- Image optimization (WebP, responsive)
- Service worker for offline
- IndexedDB for large datasets
- Virtual scrolling for long lists
- Request deduplication
- Response caching (React Query)

---

## Testing Strategy

### Unit Tests (Future)

```typescript
// Example: mockServices.test.ts
describe('identifyArtwork', () => {
  it('should match starry keyword', async () => {
    const file = new File([''], 'starry-test.jpg');
    const result = await identifyArtwork(file);
    expect(result.found).toBe(true);
    expect(result.artworkId).toBe('starry-night');
  });
});
```

### Integration Tests (Future)

- API endpoint testing with supertest
- Component interaction testing
- E2E with Playwright/Cypress

---

## Security Checklist

- [ ] HTTPS only
- [ ] Input validation (file size, type)
- [ ] Rate limiting (per session)
- [ ] CORS configuration
- [ ] CSP headers
- [ ] Admin authentication
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React automatic)
- [ ] CSRF tokens (for mutations)

---

This technical documentation provides the foundation for understanding, extending, and deploying RealMeta to production.
