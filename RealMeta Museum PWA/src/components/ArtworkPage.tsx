// Main artwork detail page with all features
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Map, 
  Share2, 
  Heart,
  PlayCircle,
  Sparkles,
  Scan,
  Info,
  Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AudioPlayer } from './AudioPlayer';
import { ChatbotUI } from './ChatbotUI';
import { MapGuide } from './MapGuide';
import { ARView } from './ARView';
import { Artwork } from '../lib/types';
import { getArtwork, getAIInfo, trackEvent, getSessionId, getRelatedArtworks } from '../lib/mockServices';

interface ArtworkPageProps {
  artworkId: string;
  onBack: () => void;
  onNavigate: (artworkId: string) => void;
  autoOpenFeature?: 'chat' | 'ar' | null;
}

export const ArtworkPage: React.FC<ArtworkPageProps> = ({ artworkId, onBack, onNavigate, autoOpenFeature }) => {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  // Helper to embed videos safely (YouTube support)
  const getEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      if (u.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed${u.pathname}`;
      }
      // Fallback: return as-is (some hosts allow direct iframe)
      return url;
    } catch {
      return url;
    }
  };
  const [aiBackground, setAiBackground] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    loadArtwork();
    startTimeRef.current = Date.now();

    // Track view event
    trackEvent({
      sessionId: getSessionId(),
      artworkId,
      event: 'view',
      timestamp: new Date().toISOString()
    });

    return () => {
      // Track exit with dwell time
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      trackEvent({
        sessionId: getSessionId(),
        artworkId,
        event: 'exit',
        timestamp: new Date().toISOString(),
        durationSeconds: duration
      });
    };
  }, [artworkId]);

  // Auto-open feature if specified
  useEffect(() => {
    if (autoOpenFeature && artwork) {
      const timer = setTimeout(() => {
        if (autoOpenFeature === 'chat') {
          setIsChatOpen(true);
        } else if (autoOpenFeature === 'ar' && artwork.arMarker) {
          setIsAROpen(true);
        }
      }, 500); // Small delay to let page load
      return () => clearTimeout(timer);
    }
  }, [autoOpenFeature, artwork]);

  const loadArtwork = async () => {
    try {
      const data = await getArtwork(artworkId);
      setArtwork(data);
      
      // Check if favorited
      const favorites = JSON.parse(localStorage.getItem('realmeta_favorites') || '[]');
      setIsFavorite(favorites.includes(artworkId));
      
      // Load related artworks (always shows 3 related artworks)
      const related = await getRelatedArtworks(artworkId);
      setRelatedArtworks(related);
    } catch (error) {
      console.error('Failed to load artwork:', error);
    }
  };

  const loadAIContent = async (type: 'background' | 'analysis') => {
    if ((type === 'background' && aiBackground) || (type === 'analysis' && aiAnalysis)) {
      return; // Already loaded
    }

    setLoadingAI(true);
    try {
      const result = await getAIInfo(artworkId, type);
      if (type === 'background') {
        setAiBackground(result.text);
      } else {
        setAiAnalysis(result.text);
      }
    } catch (error) {
      console.error('Failed to load AI content:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('realmeta_favorites') || '[]');
    if (isFavorite) {
      const updated = favorites.filter((id: string) => id !== artworkId);
      localStorage.setItem('realmeta_favorites', JSON.stringify(updated));
    } else {
      favorites.push(artworkId);
      localStorage.setItem('realmeta_favorites', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    if (navigator.share && artwork) {
      try {
        await navigator.share({
          title: artwork.title,
          text: `Check out "${artwork.title}" by ${artwork.artist} on RealMeta`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!artwork) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF6F1]">
        <div className="animate-spin w-12 h-12 border-4 border-[#8B4513] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      {/* Hero Image */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-contain bg-[#2C2C2C]"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAF6F1] to-transparent"></div>

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 backdrop-blur"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className={`text-white hover:bg-white/20 backdrop-blur ${
                  isFavorite ? 'text-red-400' : ''
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-white hover:bg-white/20 backdrop-blur"
              >
                <Share2 className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* AR Badge */}
        {artwork.arMarker && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={() => setIsAROpen(true)}
              className="bg-[#8B4513] hover:bg-[#6D3410] text-white shadow-lg"
            >
              <Scan className="w-4 h-4 mr-2" />
              Open AR
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Artist - Enhanced */}
            <div className="bg-gradient-to-br from-white to-[#FAF6F1] rounded-xl p-8 shadow-md border-2 border-[#D4A574]">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#8B4513] to-[#6D3410] rounded-full flex items-center justify-center shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-2">{artwork.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-lg">
                    <span className="font-semibold text-[#8B4513]">{artwork.artist}</span>
                    <span className="text-[#D4A574]">•</span>
                    <span className="text-[#6B6B6B]">{artwork.year}</span>
                  </div>
                </div>
              </div>
              
              {/* Description with better typography */}
              <div className="bg-white/70 rounded-lg p-5 mb-5 border-l-4 border-[#8B4513]">
                <p className="text-[#2C2C2C] leading-relaxed text-base">{artwork.shortBlurb}</p>
              </div>
              
              {/* Tags with improved styling */}
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-[#8B4513]/10 text-[#8B4513] border border-[#8B4513]/20 px-3 py-1 text-sm font-medium hover:bg-[#8B4513]/20 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Audio Player */}
            <AudioPlayer
              audioUrl={artwork.audioUrl}
              artworkId={artwork.id}
              artworkTitle={artwork.title}
              fallbackText={`${artwork.title} by ${artwork.artist}. ${artwork.shortBlurb}`}
            />

            {/* Video (if available) */}
            {artwork.videoUrl && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#D4A574]">
                <div className="flex items-center gap-2 mb-4">
                  <PlayCircle className="w-5 h-5 text-[#8B4513]" />
                  <h3 className="text-[#2C2C2C]">Video Analysis</h3>
                </div>
                <div className="aspect-video bg-[#2C2C2C] rounded-lg overflow-hidden">
                  {/* Use HTML5 video for direct files, iframe for platforms like YouTube */}
                  {/\.mp4$|\.webm$|\.ogg$/i.test(artwork.videoUrl) ? (
                    <video
                      src={artwork.videoUrl}
                      controls
                      className="w-full h-full"
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(artwork.videoUrl)}
                      title={`${artwork.title} documentary`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            )}

            {/* Detailed Information Tabs - Enhanced */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-[#D4A574]">
              <Tabs defaultValue="story" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-[#FAF6F1] to-[#F5EFE6] p-1 rounded-lg">
                  <TabsTrigger value="story" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white transition-all">Story</TabsTrigger>
                  <TabsTrigger value="artist" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white transition-all">Artist</TabsTrigger>
                  <TabsTrigger value="technique" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white transition-all">Details</TabsTrigger>
                  <TabsTrigger value="ai-bg" onClick={() => loadAIContent('background')} className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white transition-all">
                    <Sparkles className="w-3 h-3 mr-1 inline" />AI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="story" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1 w-12 bg-gradient-to-r from-[#8B4513] to-[#D4A574] rounded"></div>
                      <h3 className="text-xl font-semibold text-[#2C2C2C]">The Story Behind the Masterpiece</h3>
                    </div>
                    
                    {/* Story content in styled container */}
                    <div className="bg-gradient-to-br from-[#FAF6F1] to-white rounded-lg p-6 border-l-4 border-[#8B4513]">
                      <div 
                        className="prose prose-base max-w-none text-[#2C2C2C]"
                        style={{ lineHeight: '1.75' }}
                        dangerouslySetInnerHTML={{ __html: artwork.longStory }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="artist" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1 w-12 bg-gradient-to-r from-[#8B4513] to-[#D4A574] rounded"></div>
                      <h3 className="text-xl font-semibold text-[#2C2C2C]">About the Artist</h3>
                    </div>
                    
                    {/* Artist Biography - Enhanced content based on the artist */}
                    <div className="bg-gradient-to-br from-[#FAF6F1] to-white rounded-lg p-6 border-l-4 border-[#8B4513]">
                      <h4 className="text-lg font-semibold text-[#8B4513] mb-3">{artwork.artist}</h4>
                      <div className="space-y-3 text-[#2C2C2C]">
                        {artwork.artist.includes('van Gogh') && (
                          <>
                            <p className="leading-relaxed">Vincent van Gogh (1853-1890) was a Dutch Post-Impressionist painter whose work profoundly influenced 20th-century art. Despite creating over 2,000 artworks in just over a decade, he achieved little recognition during his lifetime.</p>
                            <p className="leading-relaxed"><strong>Artistic Journey:</strong> Van Gogh's bold use of color and emotional honesty in his work emerged from years of struggle. He turned to painting relatively late, at age 27, after failed careers as an art dealer and missionary.</p>
                            <p className="leading-relaxed"><strong>Mental Health & Creativity:</strong> His battles with mental illness, including his famous stay at the Saint-Paul asylum where this piece was created, deeply influenced his artistic vision. The swirling, dynamic brushstrokes became his signature style during this period.</p>
                            <p className="leading-relaxed"><strong>Legacy:</strong> Today recognized as one of history's greatest painters, van Gogh's expressive use of color and form laid the groundwork for modern art movements including Expressionism and Fauvism.</p>
                          </>
                        )}
                        {artwork.artist.includes('Vermeer') && (
                          <>
                            <p className="leading-relaxed">Johannes Vermeer (1632-1675) was a Dutch Baroque painter renowned for his exquisite treatment of light and intimate domestic scenes. He created relatively few paintings—only 34 are attributed to him today.</p>
                            <p className="leading-relaxed"><strong>Master of Light:</strong> Vermeer's ability to capture natural light with unprecedented subtlety earned him the title "Master of Light." His meticulous technique and use of expensive pigments, including ultramarine blue made from lapis lazuli, set his work apart.</p>
                            <p className="leading-relaxed"><strong>The Pearl Portrait:</strong> This work exemplifies his "tronies"—character studies focusing on expression rather than specific identity. The mysterious gaze and luminous pearl demonstrate his genius for creating intimate moments.</p>
                            <p className="leading-relaxed"><strong>Rediscovery:</strong> Largely forgotten after his death, Vermeer was rediscovered in the 19th century and is now celebrated as one of the greatest painters of the Dutch Golden Age.</p>
                          </>
                        )}
                        {artwork.artist.includes('Munch') && (
                          <>
                            <p className="leading-relaxed">Edvard Munch (1863-1944) was a Norwegian painter whose emotionally charged works pioneered Expressionism. His exploration of psychological themes—anxiety, love, death—revolutionized modern art.</p>
                            <p className="leading-relaxed"><strong>Personal Tragedy:</strong> Munch's childhood was marked by illness and death—his mother and sister died of tuberculosis. These experiences shaped his artistic vision, leading him to explore the darker aspects of human emotion.</p>
                            <p className="leading-relaxed"><strong>The Scream Series:</strong> Created during a walk at sunset, Munch felt "a great, infinite scream pass through nature." He created multiple versions, each exploring universal human anxiety through bold colors and distorted forms.</p>
                            <p className="leading-relaxed"><strong>Influence:</strong> His raw emotional honesty and symbolic use of color influenced German Expressionism and countless modern artists, establishing him as a bridge between 19th-century Romanticism and 20th-century Expressionism.</p>
                          </>
                        )}
                        {!artwork.artist.includes('van Gogh') && !artwork.artist.includes('Vermeer') && !artwork.artist.includes('Munch') && (
                          <>
                            <p className="leading-relaxed">{artwork.artist} created this masterpiece during a pivotal period in art history, bringing unique vision and technique to the canvas.</p>
                            <p className="leading-relaxed"><strong>Artistic Context:</strong> This work represents the culmination of the artist's exploration of form, color, and emotion, demonstrating mastery of their chosen medium and style.</p>
                            <p className="leading-relaxed"><strong>Creative Vision:</strong> Through innovative techniques and bold artistic choices, {artwork.artist} challenged conventions and helped shape the direction of modern art.</p>
                            <p className="leading-relaxed"><strong>Lasting Impact:</strong> The influence of this artist continues to resonate in contemporary art, inspiring new generations of creators to push boundaries and explore new forms of expression.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="technique" className="mt-6">
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1 w-12 bg-gradient-to-r from-[#8B4513] to-[#D4A574] rounded"></div>
                      <h3 className="text-xl font-semibold text-[#2C2C2C]">Technical Details</h3>
                    </div>
                    
                    <div className="bg-[#FAF6F1] rounded-lg p-5 border-l-4 border-[#8B4513]">
                      <h4 className="text-base font-semibold text-[#8B4513] mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#8B4513] rounded-full"></div>
                        Technique & Medium
                      </h4>
                      <p className="text-[#2C2C2C] leading-relaxed">{artwork.technique}</p>
                    </div>
                    
                    {artwork.provenance && (
                      <div className="bg-white rounded-lg p-5 border border-[#D4A574]">
                        <h4 className="text-base font-semibold text-[#8B4513] mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#8B4513] rounded-full"></div>
                          Provenance & History
                        </h4>
                        <p className="text-[#2C2C2C] leading-relaxed">{artwork.provenance}</p>
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-br from-white to-[#FAF6F1] rounded-lg p-5 border border-[#D4A574]">
                      <h4 className="text-base font-semibold text-[#8B4513] mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#8B4513] rounded-full"></div>
                        Quick Facts
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/70 rounded p-3">
                          <span className="text-[#6B6B6B] block mb-1">Created</span>
                          <span className="text-[#2C2C2C] font-semibold">{artwork.year}</span>
                        </div>
                        <div className="bg-white/70 rounded p-3">
                          <span className="text-[#6B6B6B] block mb-1">Style</span>
                          <span className="text-[#2C2C2C] font-semibold capitalize">{artwork.tags[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ai-bg" className="mt-4">
                  {loadingAI ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full"></div>
                    </div>
                  ) : aiBackground ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-[#8B4513]">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">AI-Generated Content</span>
                      </div>
                      <p className="text-sm text-[#6B6B6B]">{aiBackground}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#6B6B6B]">
                      <Sparkles className="w-8 h-8 mx-auto mb-3 text-[#D4A574]" />
                      <p className="text-sm">Click to load AI-generated background</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ai-analysis" className="mt-4">
                  {loadingAI ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full"></div>
                    </div>
                  ) : aiAnalysis ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-[#8B4513]">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">AI-Generated Content</span>
                      </div>
                      <p className="text-sm text-[#6B6B6B]">{aiAnalysis}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#6B6B6B]">
                      <Sparkles className="w-8 h-8 mx-auto mb-3 text-[#D4A574]" />
                      <p className="text-sm">Click to load AI-generated analysis</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Related Artworks */}
            {relatedArtworks.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#D4A574]">
                <h3 className="text-[#2C2C2C] mb-4">Related Artworks</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedArtworks.map(related => (
                    <button
                      key={related.id}
                      onClick={() => onNavigate(related.id)}
                      className="group text-left rounded-lg border border-[#D4A574] hover:border-[#8B4513] hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-[#2C2C2C]">
                        <img
                          src={related.imageUrl}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm text-[#2C2C2C] mb-1 line-clamp-1 group-hover:text-[#8B4513]">{related.title}</h4>
                        <p className="text-xs text-[#6B6B6B]">{related.artist}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#D4A574]">
                <h3 className="text-[#2C2C2C] mb-4">Explore</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => setIsChatOpen(true)}
                    className="w-full bg-[#8B4513] hover:bg-[#6D3410] text-white justify-start"
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Ask Questions
                  </Button>
                  
                  <Button
                    onClick={() => setIsMapOpen(true)}
                    variant="outline"
                    className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#FAF6F1] justify-start"
                  >
                    <Map className="w-5 h-5 mr-3" />
                    Museum Map
                  </Button>

                  {artwork.arMarker && (
                    <Button
                      onClick={() => setIsAROpen(true)}
                      variant="outline"
                      className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#FAF6F1] justify-start"
                    >
                      <Scan className="w-5 h-5 mr-3" />
                      AR Experience
                    </Button>
                  )}
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-[#FAF6F1] rounded-lg p-6 border border-[#D4A574]">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-[#8B4513]" />
                  <h4 className="text-[#2C2C2C]">Location</h4>
                </div>
                <p className="text-sm text-[#6B6B6B] mb-2">
                  <strong>{artwork.galleryLocation.room}</strong>
                </p>
                <p className="text-sm text-[#6B6B6B]">
                  Click "Museum Map" above to get directions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isChatOpen && (
        <ChatbotUI
          artworkId={artwork.id}
          artworkTitle={artwork.title}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {isMapOpen && (
        <MapGuide
          currentArtworkId={artwork.id}
          onNavigateToArtwork={onNavigate}
          onClose={() => setIsMapOpen(false)}
        />
      )}

      {isAROpen && artwork.arMarker && (
        <ARView
          artwork={artwork}
          onClose={() => setIsAROpen(false)}
        />
      )}
    </div>
  );
};
