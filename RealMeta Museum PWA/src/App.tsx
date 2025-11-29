// RealMeta - Museum PWA Main Application
// No-login PWA for artwork recognition, AI guides, audio narration, maps, and AR
import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { LandingPage } from './components/LandingPage';
import { CameraScanner } from './components/CameraScanner';
import { ArtworkPage } from './components/ArtworkPage';
import { MapGuide } from './components/MapGuide';
import { AdminDashboard } from './components/AdminDashboard';
import { ConsentBanner } from './components/ConsentBanner';

type View = 'landing' | 'scanner' | 'artwork' | 'map' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [openFeature, setOpenFeature] = useState<'chat' | 'ar' | null>(null);

  // Handle navigation
  const handleNavigateToArtwork = (artworkId: string, feature?: 'chat' | 'ar') => {
    setSelectedArtworkId(artworkId);
    setOpenFeature(feature || null);
    setCurrentView('artwork');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedArtworkId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartScan = () => {
    setCurrentView('scanner');
  };

  const handleViewMap = () => {
    setCurrentView('map');
  };

  const handleViewAdmin = () => {
    setCurrentView('admin');
  };

  const handleArtworkIdentified = (artworkId: string) => {
    handleNavigateToArtwork(artworkId);
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            onStartScan={handleStartScan}
            onViewMap={handleViewMap}
            onViewArtwork={handleNavigateToArtwork}
            onViewAdmin={handleViewAdmin}
          />
        );

      case 'scanner':
        return (
          <CameraScanner
            onArtworkIdentified={handleArtworkIdentified}
            onClose={handleBackToLanding}
          />
        );

      case 'artwork':
        return selectedArtworkId ? (
          <ArtworkPage
            artworkId={selectedArtworkId}
            onBack={handleBackToLanding}
            onNavigate={handleNavigateToArtwork}
            autoOpenFeature={openFeature}
          />
        ) : null;

      case 'map':
        return (
          <MapGuide
            currentArtworkId={selectedArtworkId || undefined}
            onNavigateToArtwork={handleNavigateToArtwork}
            onClose={handleBackToLanding}
          />
        );

      case 'admin':
        return <AdminDashboard onBack={handleBackToLanding} />;

      default:
        return null;
    }
  };

  return (
    <>
      {renderView()}
      <ConsentBanner />
      <Toaster />
    </>
  );
}
