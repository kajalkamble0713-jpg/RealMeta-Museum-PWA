// Real API Service - replaces mockServices.ts
import { 
  Artwork, 
  IdentifyResult, 
  MuseumMap, 
  AnalyticsEvent, 
  AdminSummary,
  ChatMessage 
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Session Management
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('realmeta_session_id');
  if (!sessionId) {
    sessionId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('realmeta_session_id', sessionId);
  }
  return sessionId;
};

// Analytics Consent
export const hasAnalyticsConsent = (): boolean => {
  return localStorage.getItem('realmeta_analytics_consent') === 'true';
};

export const setAnalyticsConsent = (consent: boolean): void => {
  localStorage.setItem('realmeta_analytics_consent', consent.toString());
};

// Artwork API
export const getArtwork = async (id: string): Promise<Artwork | null> => {
  try {
    return await apiCall<Artwork>(`/artworks/${id}`);
  } catch (error) {
    console.error('Failed to fetch artwork:', error);
    return null;
  }
};

export const getAllArtworks = async (): Promise<Artwork[]> => {
  try {
    const response = await apiCall<{ artworks: Artwork[] }>('/artworks?limit=100');
    return response.artworks;
  } catch (error) {
    console.error('Failed to fetch artworks:', error);
    return [];
  }
};

// Image Recognition API
export const identifyArtwork = async (imageFile: File): Promise<IdentifyResult> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_URL}/recognition/identify`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Recognition failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Image recognition error:', error);
    return {
      found: false,
      alternatives: [
        { tag: 'artwork', score: 0.45 },
        { tag: 'painting', score: 0.38 }
      ]
    };
  }
};

// AI Info Generation
export const getAIInfo = async (
  artworkId: string,
  type: 'background' | 'analysis'
): Promise<{ text: string }> => {
  try {
    return await apiCall<{ text: string }>(`/recognition/ai-info/${artworkId}?type=${type}`);
  } catch (error) {
    console.error('AI info generation error:', error);
    return { text: 'Unable to generate information at this time.' };
  }
};

// Chat API
export const sendChatMessage = async (
  sessionId: string,
  artworkId: string,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<{ replyText: string }> => {
  try {
    return await apiCall<{ replyText: string }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        artworkId,
        message: userMessage
      })
    });
  } catch (error) {
    console.error('Chat error:', error);
    return { replyText: "I'm having trouble processing your question. Please try again." };
  }
};

// Narration API
export const getNarration = async (artworkId: string): Promise<{ audioUrl: string }> => {
  try {
    return await apiCall<{ audioUrl: string }>(`/recognition/narration/${artworkId}`);
  } catch (error) {
    console.error('Narration error:', error);
    return { audioUrl: `/audio/${artworkId}.mp3` };
  }
};

// Museum Map API
export const getMuseumMap = async (): Promise<MuseumMap> => {
  try {
    return await apiCall<MuseumMap>('/map');
  } catch (error) {
    console.error('Map fetch error:', error);
    // Return fallback empty map
    return {
      name: 'Museum Map',
      imageUrl: '/map-placeholder.jpg',
      rooms: [],
      artworks: []
    } as MuseumMap;
  }
};

// Analytics Tracking
export const trackEvent = async (event: Omit<AnalyticsEvent, 'id'>): Promise<void> => {
  if (!hasAnalyticsConsent()) return;

  try {
    await apiCall('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Admin API
export const adminLogin = async (password: string): Promise<{ token: string }> => {
  return await apiCall<{ token: string }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password })
  });
};

export const getAdminSummary = async (adminToken: string): Promise<AdminSummary> => {
  return await apiCall<AdminSummary>('/admin/summary', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
};

export const getAdminEvents = async (
  adminToken: string,
  limit: number = 100
): Promise<AnalyticsEvent[]> => {
  const response = await apiCall<{ events: AnalyticsEvent[] }>(
    `/admin/events?limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    }
  );
  return response.events;
};

