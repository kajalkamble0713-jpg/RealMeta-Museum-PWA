// WebAR overlay demo using device camera
import React, { useState, useRef, useEffect } from 'react';
import { Scan, X, Info, Camera, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Artwork } from '../lib/types';

interface ARViewProps {
  artwork: Artwork;
  onClose: () => void;
}

export const ARView: React.FC<ARViewProps> = ({ artwork, onClose }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [markerDetected, setMarkerDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      // Simulate marker detection after a delay
      setTimeout(() => {
        setIsScanning(true);
        setTimeout(() => {
          setMarkerDetected(true);
        }, 2000);
      }, 1000);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera View */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* AR Overlay */}
      {markerDetected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500 pointer-events-auto">
            <div className="text-center">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-[#2C2C2C] mb-2">{artwork.title}</h3>
              <p className="text-sm text-[#6B6B6B] mb-1">{artwork.artist}</p>
              <p className="text-sm text-[#8B4513] mb-4">{artwork.year}</p>
              <p className="text-sm text-[#6B6B6B] mb-4 line-clamp-3">
                {artwork.shortBlurb}
              </p>
              <div className="bg-[#FAF6F1] rounded-lg p-3 border border-[#D4A574]">
                <p className="text-xs text-[#6B6B6B]">
                  Point your camera at the artwork marker for more information
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scanning Indicator */}
      {isScanning && !markerDetected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Scanning frame */}
            <div className="w-64 h-64 border-4 border-[#D4A574] rounded-lg relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
              
              {/* Scanning line */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="w-full h-1 bg-[#D4A574] shadow-lg shadow-[#D4A574] animate-scan"></div>
              </div>
            </div>
            <p className="text-white text-center mt-4 text-sm">
              Scanning for artwork marker...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-[#2C2C2C] text-center mb-2">Camera Access Required</h3>
            <p className="text-sm text-[#6B6B6B] text-center mb-4">{error}</p>
            <Button
              onClick={onClose}
              className="w-full bg-[#8B4513] hover:bg-[#6D3410] text-white"
            >
              Close AR View
            </Button>
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <Scan className="w-6 h-6" />
            <div>
              <h3>AR Experience</h3>
              <p className="text-sm opacity-75">Point at artwork marker</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Instructions */}
      {!markerDetected && !error && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <div className="flex items-start gap-3 text-white">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm mb-2">
                  <strong>How to use AR:</strong>
                </p>
                <ol className="text-sm space-y-1 opacity-90 list-decimal list-inside">
                  <li>Look for AR markers near artworks (QR-like patterns)</li>
                  <li>Point your camera at the marker</li>
                  <li>Hold steady while the app recognizes the marker</li>
                  <li>View augmented content overlaid on the artwork</li>
                </ol>
                <p className="text-xs mt-3 opacity-75">
                  Demo mode: Simulated marker detection after 3 seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(256px);
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
