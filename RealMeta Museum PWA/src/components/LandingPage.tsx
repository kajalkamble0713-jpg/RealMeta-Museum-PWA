// Landing page / home screen
import React, { useState, useEffect } from 'react';
import { Camera, Map, Sparkles, Search, Grid, Shield, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getAllArtworks } from '../lib/mockServices';
import { Artwork } from '../lib/types';

interface LandingPageProps {
  onStartScan: () => void;
  onViewMap: () => void;
  onViewArtwork: (artworkId: string, feature?: 'chat' | 'ar') => void;
  onViewAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartScan,
  onViewMap,
  onViewArtwork,
  onViewAdmin
}) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    loadArtworks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredArtworks(
        artworks.filter(
          artwork =>
            artwork.title.toLowerCase().includes(query) ||
            artwork.artist.toLowerCase().includes(query) ||
            artwork.tags.some(tag => tag.toLowerCase().includes(query))
        )
      );
    } else {
      setFilteredArtworks(artworks);
    }
  }, [searchQuery, artworks]);

  const loadArtworks = async () => {
    const data = await getAllArtworks();
    setArtworks(data);
    setFilteredArtworks(data);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/museum-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="mb-6">
            <div className="w-20 h-20 bg-[#8B4513] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-white mb-3 text-4xl md:text-5xl">RealMeta</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              Your intelligent museum companion. Scan artworks for instant insights, audio guides, and AR experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              onClick={onStartScan}
              size="lg"
              className="bg-[#8B4513] hover:bg-[#6D3410] text-white shadow-xl text-lg px-8 py-6"
            >
              <Camera className="w-6 h-6 mr-3" />
              Start Tour
            </Button>
            <Button
              onClick={onViewMap}
              size="lg"
              variant="outline"
              className="bg-white border-0 text-[#8B4513] hover:!bg-[#8B4513] hover:!text-white transition-colors shadow-xl text-lg px-8 py-6"
            >
              <Map className="w-6 h-6 mr-3" />
              View Map
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-8 mt-12 text-white/90">
            <div className="text-center">
              <p className="text-3xl mb-1">{artworks.length}</p>
              <p className="text-sm">Artworks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1">4</p>
              <p className="text-sm">Galleries</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1">AI</p>
              <p className="text-sm">Powered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-[#2C2C2C] mb-3">Experience Art Like Never Before</h2>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto">
            Cutting-edge technology meets timeless masterpieces. No login required, fully private.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card 
            className="p-6 border-[#D4A574] hover:shadow-lg transition-all cursor-pointer hover:border-[#8B4513] group"
            onClick={onStartScan}
          >
            <div className="w-12 h-12 bg-[#8B4513]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#8B4513]/20 transition-colors">
              <Camera className="w-6 h-6 text-[#8B4513]" />
            </div>
            <h3 className="text-[#2C2C2C] mb-2 group-hover:text-[#8B4513] transition-colors">Instant Recognition</h3>
            <p className="text-sm text-[#6B6B6B]">
              Point your camera at any artwork to instantly access detailed information, background stories, and expert analysis.
            </p>
          </Card>

          <Card 
            className="p-6 border-[#D4A574] hover:shadow-lg transition-all cursor-pointer hover:border-[#8B4513] group"
            onClick={() => {
              // Navigate to first artwork and open AI chat
              if (artworks.length > 0) {
                onViewArtwork(artworks[0].id, 'chat');
              }
            }}
          >
            <div className="w-12 h-12 bg-[#8B4513]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#8B4513]/20 transition-colors">
              <Sparkles className="w-6 h-6 text-[#8B4513]" />
            </div>
            <h3 className="text-[#2C2C2C] mb-2 group-hover:text-[#8B4513] transition-colors">AI Art Guide</h3>
            <p className="text-sm text-[#6B6B6B]">
              Chat with our AI guide to ask questions about artworks. Get personalized insights and historical context on demand.
            </p>
          </Card>

          <Card 
            className="p-6 border-[#D4A574] hover:shadow-lg transition-all cursor-pointer hover:border-[#8B4513] group"
            onClick={() => {
              // Navigate to an artwork with AR feature and open AR
              const arArtwork = artworks.find(art => art.arMarker);
              if (arArtwork) {
                onViewArtwork(arArtwork.id, 'ar');
              } else if (artworks.length > 0) {
                onViewArtwork(artworks[0].id, 'ar');
              }
            }}
          >
            <div className="w-12 h-12 bg-[#8B4513]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#8B4513]/20 transition-colors">
              <QrCode className="w-6 h-6 text-[#8B4513]" />
            </div>
            <h3 className="text-[#2C2C2C] mb-2 group-hover:text-[#8B4513] transition-colors">AR Overlays</h3>
            <p className="text-sm text-[#6B6B6B]">
              Experience augmented reality features with select artworks. See additional layers of information come to life.
            </p>
          </Card>
        </div>

        {/* Browse Collection */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#2C2C2C]">Browse Collection</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#D4A574] rounded-lg text-sm focus:outline-none focus:border-[#8B4513]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork) => (
              <Card
                key={artwork.id}
                className="overflow-hidden border-[#D4A574] hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onViewArtwork(artwork.id)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#2C2C2C]">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[#2C2C2C] mb-1 line-clamp-1">{artwork.title}</h3>
                  <p className="text-sm text-[#6B6B6B] mb-2">
                    {artwork.artist} • {artwork.year}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {artwork.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-[#FAF6F1]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredArtworks.length === 0 && (
            <div className="text-center py-12">
              <Grid className="w-16 h-16 text-[#D4A574] mx-auto mb-4" />
              <p className="text-[#6B6B6B]">No artworks found matching your search.</p>
            </div>
          )}
        </div>

        {/* Privacy Section */}
        <Card className="p-8 border-[#D4A574] bg-gradient-to-br from-white to-[#FAF6F1]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-[#8B4513] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-[#2C2C2C] mb-2">Privacy First Design</h3>
              <p className="text-sm text-[#6B6B6B] mb-3">
                No login required. No personal data collected. Anonymous analytics help us improve your experience. 
                All processing happens securely, and you maintain full control over your data preferences.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="border-[#8B4513] text-[#8B4513]">
                  No Tracking
                </Badge>
                <Badge variant="outline" className="border-[#8B4513] text-[#8B4513]">
                  Anonymous
                </Badge>
                <Badge variant="outline" className="border-[#8B4513] text-[#8B4513]">
                  Local Storage
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-[#D4A574] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-[#6B6B6B] mb-4">
            RealMeta PWA • Powered by AI • Demo Mode
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onViewAdmin}
              className="text-xs text-[#8B4513] hover:underline"
            >
              Admin Dashboard
            </button>
            <span className="text-[#D4A574]">•</span>
            <button className="text-xs text-[#8B4513] hover:underline">
              Privacy Policy
            </button>
            <span className="text-[#D4A574]">•</span>
            <button className="text-xs text-[#8B4513] hover:underline">
              About
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
