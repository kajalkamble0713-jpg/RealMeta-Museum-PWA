// Mock service implementations simulating backend API responses
// In production, these would call real backend endpoints

import { 
  Artwork, 
  IdentifyResult, 
  MuseumMap, 
  AnalyticsEvent, 
  AdminSummary,
  ChatMessage 
} from './types';
import { MOCK_ARTWORKS, MOCK_MUSEUM_MAP, MOCK_RECOGNITION_DATABASE } from './mockData';

// Simulated network delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Session ID generation
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('realmeta_session_id');
  if (!sessionId) {
    sessionId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('realmeta_session_id', sessionId);
  }
  return sessionId;
};

// Analytics consent management
export const hasAnalyticsConsent = (): boolean => {
  return localStorage.getItem('realmeta_analytics_consent') === 'true';
};

export const setAnalyticsConsent = (consent: boolean): void => {
  localStorage.setItem('realmeta_analytics_consent', consent.toString());
};

// Mock Image Recognition Service
export const identifyArtwork = async (imageFile: File): Promise<IdentifyResult> => {
  await delay(1500); // Simulate API call
  
  const filename = imageFile.name.toLowerCase();
  console.log('Analyzing image:', filename);
  
  // Check filename for keywords
  for (const [keyword, artworkId] of Object.entries(MOCK_RECOGNITION_DATABASE)) {
    if (filename.includes(keyword)) {
      console.log(`Match found! Keyword "${keyword}" -> Artwork: ${artworkId}`);
      return {
        found: true,
        artworkId,
        confidence: 0.88 + Math.random() * 0.10
      };
    }
  }
  
  // If no filename match, try to intelligently match based on image content analysis
  // For demo: default to Starry Night as it's most recognizable
  console.log('No keyword match, defaulting to Starry Night');
  
  return {
    found: true,
    artworkId: 'starry-night',
    confidence: 0.78,
    alternatives: [
      { tag: 'painting', score: 0.45 },
      { tag: 'art', score: 0.38 },
      { tag: 'canvas', score: 0.22 }
    ]
  };
};

// Store scanned artwork from API
export const storeScannedArtwork = (artwork: any): void => {
  const scannedArtworks = JSON.parse(localStorage.getItem('realmeta_scanned') || '{}');
  scannedArtworks[artwork.id] = artwork;
  localStorage.setItem('realmeta_scanned', JSON.stringify(scannedArtworks));
};

// Mock Artwork Retrieval
export const getArtwork = async (id: string): Promise<Artwork | null> => {
  await delay(300);
  
  // First check if it's a scanned artwork from API
  const scannedArtworks = JSON.parse(localStorage.getItem('realmeta_scanned') || '{}');
  if (scannedArtworks[id]) {
    return scannedArtworks[id];
  }
  
  // Otherwise return from mock data
  return MOCK_ARTWORKS.find(artwork => artwork.id === id) || null;
};

// Mock AI Info Generation
export const getAIInfo = async (
  artworkId: string, 
  type: 'background' | 'analysis'
): Promise<{ text: string }> => {
  await delay(1200);
  
  const artwork = MOCK_ARTWORKS.find(a => a.id === artworkId);
  if (!artwork) throw new Error('Artwork not found');
  
  if (type === 'background') {
    return {
      text: `${artwork.title} by ${artwork.artist} (${artwork.year}) is a masterpiece of ${artwork.tags[0]}. ${artwork.longStory.replace(/<[^>]*>/g, ' ').substring(0, 300)}... The work exemplifies the artist's unique approach to ${artwork.technique.split(' ')[0].toLowerCase()} and remains influential to this day.`
    };
  } else {
    return {
      text: `Artistic analysis of ${artwork.title}: The ${artwork.technique.toLowerCase()} demonstrates masterful control. Notable techniques include ${artwork.tags.slice(0, 2).join(' and ')} elements. The composition reflects the ${artwork.year}s aesthetic while pushing boundaries of traditional representation. The artist's choice of subject matter and execution created lasting impact on subsequent movements.`
    };
  }
};

// Mock Chat Service (artwork-scoped chatbot)
export const sendChatMessage = async (
  sessionId: string,
  artworkId: string,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<{ replyText: string }> => {
  // Try real backend first if configured
  const API_URL = (import.meta as any).env?.VITE_API_URL as string | undefined;
  if (API_URL) {
    try {
      const resp = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, artwork_id: artworkId, history: conversationHistory })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data?.response) {
          return { replyText: data.response };
        }
      }
    } catch (e) {
      // fall back to mock
      console.warn('Chat API failed, falling back to mock:', e);
    }
  }

  await delay(1000);
  
  const artwork = MOCK_ARTWORKS.find(a => a.id === artworkId);
  if (!artwork) {
    return { 
      replyText: "I can only answer questions about artworks in our collection. Please select an artwork first." 
    };
  }
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Simple mock responses based on keywords
  if (lowerMessage.includes('year') || lowerMessage.includes('when') || lowerMessage.includes('created')) {
    return { 
      replyText: `${artwork.title} was created in ${artwork.year} by ${artwork.artist}. This was during a significant period in art history when ${artwork.tags[0]} was flourishing.` 
    };
  }
  
  if (lowerMessage.includes('artist') || lowerMessage.includes('who')) {
    return { 
      replyText: `This masterpiece was created by ${artwork.artist}, a renowned artist known for ${artwork.tags[0]} style. ${artwork.artist} was active during the ${Math.floor(artwork.year / 100)}00s and created many influential works.` 
    };
  }
  
  if (lowerMessage.includes('technique') || lowerMessage.includes('how') || lowerMessage.includes('painted')) {
    return { 
      replyText: `The technique used is ${artwork.technique}. This approach was characteristic of the artist's style and the ${artwork.tags[0]} movement.` 
    };
  }
  
  if (lowerMessage.includes('meaning') || lowerMessage.includes('symbolism') || lowerMessage.includes('represent')) {
    return { 
      replyText: `${artwork.title} carries deep symbolic meaning. ${artwork.shortBlurb} The work reflects themes common in ${artwork.tags[0]}, inviting viewers to contemplate its layers of meaning.` 
    };
  }
  
  if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('find')) {
    return { 
      replyText: `You can find ${artwork.title} in ${artwork.galleryLocation.room}. Use the museum map to navigate there, or ask staff for directions.` 
    };
  }
  
  if (lowerMessage.includes('similar') || lowerMessage.includes('related') || lowerMessage.includes('other')) {
    const relatedWorks = artwork.related.map(id => {
      const related = MOCK_ARTWORKS.find(a => a.id === id);
      return related ? related.title : id;
    }).join(', ');
    return { 
      replyText: `If you enjoyed ${artwork.title}, you might also like these related works: ${relatedWorks || 'other pieces in this gallery'}. They share similar themes or were created during the same period.` 
    };
  }
  
  // Default response
  return { 
    replyText: `Great question about ${artwork.title}! ${artwork.shortBlurb} The artwork is located in ${artwork.galleryLocation.room} and was created using ${artwork.technique.split(',')[0]}. What else would you like to know about this masterpiece?` 
  };
};

// Mock TTS Narration
export const getNarration = async (artworkId: string): Promise<{ audioUrl: string }> => {
  await delay(800);
  
  const artwork = MOCK_ARTWORKS.find(a => a.id === artworkId);
  if (!artwork) throw new Error('Artwork not found');
  
  // Return pre-generated audio if available, otherwise generate mock URL
  if (artwork.audioUrl) {
    return { audioUrl: artwork.audioUrl };
  }
  
  return { audioUrl: `/audio/${artworkId}.mp3` };
};

// Mock Museum Map
export const getMuseumMap = async (): Promise<MuseumMap> => {
  await delay(400);
  return MOCK_MUSEUM_MAP;
};

// Analytics tracking (stored locally in demo mode)
export const trackEvent = async (event: Omit<AnalyticsEvent, 'id'>): Promise<void> => {
  if (!hasAnalyticsConsent()) return;
  
  const events = JSON.parse(localStorage.getItem('realmeta_analytics') || '[]');
  const newEvent = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  events.push(newEvent);
  localStorage.setItem('realmeta_analytics', JSON.stringify(events));
};

// Admin: Get analytics summary
export const getAdminSummary = async (adminPass: string): Promise<AdminSummary> => {
  await delay(500);
  
  // In production, verify adminPass against backend
  if (adminPass !== 'demo123') {
    throw new Error('Invalid admin password');
  }
  
  const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('realmeta_analytics') || '[]');
  
  // Calculate top viewed artworks
  const viewCounts: Record<string, number> = {};
  events.filter(e => e.event === 'view').forEach(e => {
    viewCounts[e.artworkId] = (viewCounts[e.artworkId] || 0) + 1;
  });
  
  const topViewed = Object.entries(viewCounts)
    .map(([artworkId, views]) => {
      const artwork = MOCK_ARTWORKS.find(a => a.id === artworkId);
      return { artworkId, views, title: artwork?.title || artworkId };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  
  // Calculate average dwell time
  const dwellEvents = events.filter(e => e.durationSeconds);
  const avgDwell = dwellEvents.length > 0
    ? dwellEvents.reduce((sum, e) => sum + (e.durationSeconds || 0), 0) / dwellEvents.length
    : 0;
  
  // Total scans
  const totalScans = events.filter(e => e.event === 'recognize').length;
  
  return {
    topViewed,
    avgDwell,
    totalScans,
    totalInteractions: events.length
  };
};

// Admin: Get recent events
export const getAdminEvents = async (
  adminPass: string, 
  limit: number = 100
): Promise<AnalyticsEvent[]> => {
  await delay(300);
  
  if (adminPass !== 'demo123') {
    throw new Error('Invalid admin password');
  }
  
  const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('realmeta_analytics') || '[]');
  return events.slice(-limit).reverse();
};

// Get all artworks (for admin and browse)
export const getAllArtworks = async (): Promise<Artwork[]> => {
  await delay(400);
  return MOCK_ARTWORKS;
};

// Get related artworks with intelligent fallback
export const getRelatedArtworks = async (artworkId: string): Promise<Artwork[]> => {
  await delay(300);
  
  const currentArtwork = MOCK_ARTWORKS.find(a => a.id === artworkId);
  if (!currentArtwork) return [];
  
  // Try to find explicitly defined related artworks
  const explicitRelated = currentArtwork.related
    .map(id => MOCK_ARTWORKS.find(a => a.id === id))
    .filter(a => a !== undefined) as Artwork[];
  
  // If we have enough explicit related artworks, return them
  if (explicitRelated.length >= 3) {
    return explicitRelated.slice(0, 3);
  }
  
  // Otherwise, find similar artworks based on gallery, tags, or artist
  const similar = MOCK_ARTWORKS
    .filter(a => a.id !== artworkId) // Exclude current artwork
    .map(artwork => {
      let score = 0;
      
      // Same gallery gets high priority
      if (artwork.galleryLocation.room === currentArtwork.galleryLocation.room) {
        score += 3;
      }
      
      // Shared tags
      const sharedTags = artwork.tags.filter(tag => currentArtwork.tags.includes(tag));
      score += sharedTags.length * 2;
      
      // Same artist
      if (artwork.artist === currentArtwork.artist) {
        score += 5;
      }
      
      return { artwork, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3 - explicitRelated.length)
    .map(item => item.artwork);
  
  return [...explicitRelated, ...similar].slice(0, 3);
};

