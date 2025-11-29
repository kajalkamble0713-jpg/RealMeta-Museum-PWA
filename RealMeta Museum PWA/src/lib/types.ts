// Core type definitions for RealMeta PWA

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  shortBlurb: string;
  longStory: string;
  technique: string;
  provenance: string;
  imageUrl: string;
  audioUrl?: string;
  videoUrl?: string;
  tags: string[];
  related: string[];
  galleryLocation: {
    room: string;
    x: number;
    y: number;
  };
  arMarker?: {
    markerId: string;
    markerFile: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  artworkId: string;
  event: 'view' | 'audio_play' | 'chat_query' | 'exit' | 'map_route' | 'recognize';
  timestamp: string;
  durationSeconds?: number;
  meta?: {
    userAgent?: string;
    approximateLocation?: string;
  };
}

export interface MuseumMap {
  name: string;
  imageUrl: string;
  rooms: Array<{
    id: string;
    name: string;
    bounds: { x: number; y: number; width: number; height: number };
    description: string;
  }>;
  artworks: Array<{
    artworkId: string;
    x: number;
    y: number;
  }>;
}

export interface IdentifyResult {
  found: boolean;
  artworkId?: string;
  confidence?: number;
  alternatives?: Array<{ tag: string; score: number }>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AdminSummary {
  topViewed: Array<{ artworkId: string; views: number; title: string }>;
  avgDwell: number;
  totalScans: number;
  totalInteractions: number;
}

