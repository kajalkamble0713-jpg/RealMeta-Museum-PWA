// Privacy consent banner for analytics tracking
import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { hasAnalyticsConsent, setAnalyticsConsent } from '../lib/mockServices';

export const ConsentBanner: React.FC = () => {
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasResponded = localStorage.getItem('realmeta_analytics_consent');
    if (!hasResponded) {
      setTimeout(() => {
        setShow(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setIsVisible(false);
    setTimeout(() => setShow(false), 300);
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);
    setIsVisible(false);
    setTimeout(() => setShow(false), 300);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t-2 border-[#D4A574] shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Shield className="w-6 h-6 text-[#8B4513] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="mb-1 text-[#2C2C2C]">Privacy & Analytics</h3>
                <p className="text-sm text-[#6B6B6B] max-w-2xl">
                  We collect anonymous usage data to improve your museum experience. No personal information is stored. 
                  Your session is identified by a random ID only. You can change this preference anytime in settings.
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
              <Button
                onClick={handleDecline}
                variant="outline"
                className="flex-1 sm:flex-none border-[#8B4513] text-[#8B4513] hover:bg-[#FAF6F1]"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 sm:flex-none bg-[#8B4513] hover:bg-[#6D3410] text-white"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
