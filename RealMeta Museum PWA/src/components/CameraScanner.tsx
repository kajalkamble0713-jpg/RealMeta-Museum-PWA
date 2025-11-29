// Camera scanner and image upload for artwork recognition
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { identifyArtwork, trackEvent, getSessionId, storeScannedArtwork } from '../lib/mockServices';
import { IdentifyResult } from '../lib/types';

interface CameraScannerProps {
  onArtworkIdentified: (artworkId: string) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onArtworkIdentified, onClose }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (stream && videoRef.current) {
      console.log('Setting video source', stream);
      videoRef.current.srcObject = stream;
      videoRef.current.play().then(() => {
        console.log('Video started playing');
      }).catch(err => {
        console.error('Error playing video:', err);
        setError('Could not start video playback. Please try again.');
      });
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      setError('');
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      console.log('Camera access granted!', mediaStream);
      setStream(mediaStream);
      setUseCamera(true);
      
      // Ensure video element gets the stream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        console.log('Video playing');
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings or use file upload.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please use file upload instead.');
      } else {
        setError('Unable to access camera. Please use file upload instead.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        await processImage(file);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      processImage(file);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError('');
    setResult(null);

    // Track recognition event
    trackEvent({
      sessionId: getSessionId(),
      artworkId: 'unknown',
      event: 'recognize',
      timestamp: new Date().toISOString()
    });

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        try {
          // Call backend API
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const response = await fetch(`${API_URL}/identify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image })
          });

          const data = await response.json();
          console.log('Recognition result:', data);

          if (data.success && data.artwork) {
            // Store the artwork data from API
            const artworkData = {
              id: data.artwork.id || data.artwork_id,
              title: data.artwork.title,
              artist: data.artwork.artist,
              year: data.artwork.year,
              imageUrl: data.artwork.image_url || base64Image,
              shortBlurb: data.artwork.shortBlurb || data.artwork.description,
              longStory: data.artwork.longStory || data.artwork.story,
              technique: data.artwork.technique || 'Unknown',
              tags: [data.artwork.style || 'Art'],
              galleryLocation: data.artwork.location_coordinates || { room: 'Main Gallery', floor: 1 },
              audioUrl: '',
              arMarker: null,
              related: data.artwork.related_works || []
            };
            
            storeScannedArtwork(artworkData);
            
            setResult({
              found: data.found !== false,
              artworkId: artworkData.id,
              confidence: data.confidence || 0.85
            });
            
            setIsProcessing(false);

            if (artworkData.id) {
              setTimeout(() => {
                onArtworkIdentified(artworkData.id);
              }, 1500);
            }
          } else {
            setError('Could not identify artwork. Please try another image.');
            setIsProcessing(false);
          }
        } catch (apiError: any) {
          console.error('API error:', apiError);
          setError(`API Error: ${apiError.message || 'Failed to connect to backend. Make sure the backend is running on port 5000.'}`);
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read image file.');
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Recognition failed. Please try again or choose a different image.');
      console.error('Recognition error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D4A574]">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-[#8B4513]" />
            <h2 className="text-[#2C2C2C]">Identify Artwork</h2>
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

        <div className="p-6 min-h-[400px]">
          {/* Camera View */}
          {useCamera && stream && (
            <div className="relative mb-4 bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto min-h-[400px] rounded-lg object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button
                  onClick={captureImage}
                  disabled={isProcessing}
                  className="bg-[#8B4513] hover:bg-[#6D3410] text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Capture
                    </>
                  )}
                </Button>
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="bg-white border-[#8B4513] text-[#8B4513]"
                >
                  Close Camera
                </Button>
              </div>
            </div>
          )}

          {/* Upload Options */}
          {!useCamera && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-[#6B6B6B] mb-6">
                  Upload an artwork image or use your camera to get detailed information
                </p>
                
                <div className="flex flex-col gap-3 max-w-md mx-auto">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    size="lg"
                    className="bg-[#8B4513] hover:bg-[#6D3410] text-white h-12"
                  >
                    <Upload className="w-6 h-6 mr-2" />
                    Choose File to Upload
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-[#D4A574]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-[#6B6B6B]">or</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={startCamera}
                    disabled={isProcessing}
                    variant="outline"
                    className="border-[#8B4513] text-[#8B4513] hover:bg-[#FAF6F1] h-12"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Use Camera
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Camera Permission Help */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-3">
                <h4 className="mb-2 text-blue-900 font-semibold flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Camera Not Working?
                </h4>
                <p className="text-sm text-blue-700 mb-2">
                  When you click "Use Camera", your browser will ask for permission:
                </p>
                <ol className="text-sm text-blue-600 list-decimal list-inside space-y-1">
                  <li>Look for a popup at the top of your browser</li>
                  <li>Click <strong>"Allow"</strong> to enable camera access</li>
                  <li>If blocked, click the 🔒 icon in address bar → Allow Camera</li>
                </ol>
              </div>

              {/* Demo Instructions */}
              <div className="bg-[#FAF6F1] rounded-lg p-4 border border-[#D4A574]">
                <h4 className="mb-2 text-[#2C2C2C]">How It Works</h4>
                <p className="text-sm text-[#6B6B6B]">
                  Upload any artwork image to instantly get detailed information about the piece, 
                  artist background, style analysis, and related works in our collection.
                </p>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#8B4513] mx-auto mb-4" />
                <p className="text-[#6B6B6B]">Analyzing artwork...</p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !isProcessing && (
            <div className="mt-4">
              {result.found ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-green-900 mb-1">Artwork Identified!</h4>
                    <p className="text-sm text-green-700">
                      Confidence: {((result.confidence || 0) * 100).toFixed(0)}%
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      Redirecting to artwork details...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-amber-900 mb-1">Artwork Not Found</h4>
                    <p className="text-sm text-amber-700 mb-2">
                      We couldn't match this image to our collection.
                    </p>
                    {result.alternatives && result.alternatives.length > 0 && (
                      <div className="text-sm text-amber-600">
                        <p>Detected elements:</p>
                        <ul className="list-disc list-inside mt-1">
                          {result.alternatives.map((alt, i) => (
                            <li key={i}>{alt.tag} ({(alt.score * 100).toFixed(0)}%)</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-900 mb-1">Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
