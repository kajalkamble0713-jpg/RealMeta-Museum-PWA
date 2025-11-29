// Interactive museum floor map with artwork locations and routing
import React, { useState, useEffect } from 'react';
import { Map, MapPin, Navigation, X, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getMuseumMap, getArtwork, trackEvent, getSessionId } from '../lib/mockServices';
import { MuseumMap, Artwork } from '../lib/types';

interface MapGuideProps {
  currentArtworkId?: string;
  onNavigateToArtwork?: (artworkId: string) => void;
  onClose: () => void;
}

export const MapGuide: React.FC<MapGuideProps> = ({ 
  currentArtworkId, 
  onNavigateToArtwork,
  onClose 
}) => {
  const [map, setMap] = useState<MuseumMap | null>(null);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(currentArtworkId || null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMap();
    trackEvent({
      sessionId: getSessionId(),
      artworkId: currentArtworkId || 'map',
      event: 'map_route',
      timestamp: new Date().toISOString()
    });
  }, []);

  useEffect(() => {
    if (selectedArtworkId) {
      loadArtworkDetails(selectedArtworkId);
    }
  }, [selectedArtworkId]);

  const loadMap = async () => {
    try {
      const museumMap = await getMuseumMap();
      setMap(museumMap);
    } catch (error) {
      console.error('Failed to load map:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadArtworkDetails = async (artworkId: string) => {
    try {
      const artwork = await getArtwork(artworkId);
      setSelectedArtwork(artwork);
    } catch (error) {
      console.error('Failed to load artwork:', error);
    }
  };

  const handleArtworkClick = (artworkId: string) => {
    setSelectedArtworkId(artworkId);
  };

  const handleNavigate = () => {
    if (selectedArtworkId && onNavigateToArtwork) {
      onNavigateToArtwork(selectedArtworkId);
      onClose();
    }
  };

  if (isLoading || !map) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin w-8 h-8 border-4 border-[#8B4513] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#6B6B6B] mt-4">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D4A574]">
          <div className="flex items-center gap-3">
            <Map className="w-6 h-6 text-[#8B4513]" />
            <div>
              <h2 className="text-[#2C2C2C]">{map.name}</h2>
              <p className="text-sm text-[#6B6B6B]">Click on artworks to view details</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#6B6B6B] hover:text-[#2C2C2C]"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map Canvas */}
            <div className="lg:col-span-2">
              <div className="relative bg-[#FAF6F1] rounded-lg border-2 border-[#D4A574] aspect-[4/3] overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1724786594289-41ebbf53a35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBmbG9vciUyMHBsYW58ZW58MXx8fHwxNzYyMDk4MzA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Museum floor plan"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>

                {/* Rooms */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 750 550">
                  {map.rooms.map(room => (
                    <g key={room.id}>
                      <rect
                        x={room.bounds.x}
                        y={room.bounds.y}
                        width={room.bounds.width}
                        height={room.bounds.height}
                        fill={hoveredRoom === room.id ? '#D4A574' : 'transparent'}
                        stroke="#8B4513"
                        strokeWidth="2"
                        opacity={hoveredRoom === room.id ? 0.2 : 0.5}
                        onMouseEnter={() => setHoveredRoom(room.id)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        className="cursor-pointer transition-all"
                      />
                      <text
                        x={room.bounds.x + room.bounds.width / 2}
                        y={room.bounds.y + 30}
                        textAnchor="middle"
                        fill="#8B4513"
                        className="text-sm pointer-events-none"
                      >
                        {room.name}
                      </text>
                    </g>
                  ))}

                  {/* Artwork markers */}
                  {map.artworks.map((artworkLoc) => (
                    <g
                      key={artworkLoc.artworkId}
                      onClick={() => handleArtworkClick(artworkLoc.artworkId)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={artworkLoc.x}
                        cy={artworkLoc.y}
                        r={selectedArtworkId === artworkLoc.artworkId ? 12 : 8}
                        fill={currentArtworkId === artworkLoc.artworkId ? '#D4A574' : '#8B4513'}
                        stroke="white"
                        strokeWidth="2"
                        className="transition-all hover:r-12"
                      />
                      {selectedArtworkId === artworkLoc.artworkId && (
                        <circle
                          cx={artworkLoc.x}
                          cy={artworkLoc.y}
                          r={18}
                          fill="none"
                          stroke="#8B4513"
                          strokeWidth="2"
                          opacity="0.5"
                        />
                      )}
                    </g>
                  ))}

                  {/* Current location indicator */}
                  {currentArtworkId && map.artworks.find(a => a.artworkId === currentArtworkId) && (
                    <g>
                      {(() => {
                        const current = map.artworks.find(a => a.artworkId === currentArtworkId);
                        if (!current) return null;
                        return (
                          <>
                            <circle
                              cx={current.x}
                              cy={current.y}
                              r="20"
                              fill="none"
                              stroke="#D4A574"
                              strokeWidth="3"
                              strokeDasharray="5,5"
                            >
                              <animate
                                attributeName="r"
                                values="20;25;20"
                                dur="2s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="1;0.5;1"
                                dur="2s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </>
                        );
                      })()}
                    </g>
                  )}
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#D4A574] border-2 border-white"></div>
                  <span className="text-[#6B6B6B]">Current Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#8B4513] border-2 border-white"></div>
                  <span className="text-[#6B6B6B]">Artwork</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8B4513]" />
                  <span className="text-[#6B6B6B]">Click to select</span>
                </div>
              </div>
            </div>

            {/* Artwork Details Panel */}
            <div className="lg:col-span-1">
              {selectedArtwork ? (
                <div className="bg-[#FAF6F1] rounded-lg border border-[#D4A574] p-4 sticky top-0">
                  <img
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-[#2C2C2C] mb-1">{selectedArtwork.title}</h3>
                  <p className="text-sm text-[#6B6B6B] mb-3">
                    {selectedArtwork.artist} • {selectedArtwork.year}
                  </p>
                  <p className="text-sm text-[#6B6B6B] mb-4">
                    {selectedArtwork.shortBlurb}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <MapPin className="w-4 h-4 text-[#8B4513]" />
                    <span className="text-[#6B6B6B]">{selectedArtwork.galleryLocation.room}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedArtwork.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-white border-[#D4A574]">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleNavigate}
                      className="w-full bg-[#8B4513] hover:bg-[#6D3410] text-white"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {currentArtworkId !== selectedArtworkId && (
                      <Button
                        variant="outline"
                        className="w-full border-[#8B4513] text-[#8B4513]"
                        onClick={() => setSelectedArtworkId(currentArtworkId || null)}
                      >
                        Show Current Location
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#FAF6F1] rounded-lg border border-[#D4A574] p-6 text-center">
                  <Info className="w-12 h-12 text-[#8B4513] mx-auto mb-4" />
                  <h3 className="text-[#2C2C2C] mb-2">Select an Artwork</h3>
                  <p className="text-sm text-[#6B6B6B]">
                    Click on any artwork marker on the map to view its details and location.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
