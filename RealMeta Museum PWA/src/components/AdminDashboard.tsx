// Admin dashboard for analytics and artwork management
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock,
  TrendingUp,
  ArrowLeft,
  Lock,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { getAdminSummary, getAdminEvents, getAllArtworks } from '../lib/mockServices';
import { AdminSummary, AnalyticsEvent, Artwork } from '../lib/types';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      const data = await getAdminSummary(password);
      setSummary(data);
      setIsAuthenticated(true);
      setError('');
    } catch (err) {
      setError('Invalid password. Demo password is: demo123');
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [summaryData, eventsData, artworksData] = await Promise.all([
        getAdminSummary(password),
        getAdminEvents(password, 50),
        getAllArtworks()
      ]);
      setSummary(summaryData);
      setEvents(eventsData);
      setArtworks(artworksData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      summary,
      events,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `realmeta-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg border border-[#D4A574]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#8B4513] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[#2C2C2C] mb-2">Admin Access</h2>
            <p className="text-sm text-[#6B6B6B]">
              Enter the admin password to access the dashboard
            </p>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="border-[#D4A574]"
            />
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              onClick={handleLogin}
              className="w-full bg-[#8B4513] hover:bg-[#6D3410] text-white"
            >
              Sign In
            </Button>

            <div className="pt-4 border-t border-[#D4A574]">
              <p className="text-xs text-[#6B6B6B] text-center">
                Demo Mode: Use password <code className="bg-[#FAF6F1] px-2 py-1 rounded">demo123</code>
              </p>
            </div>

            <Button
              onClick={onBack}
              variant="outline"
              className="w-full border-[#8B4513] text-[#8B4513]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      {/* Header */}
      <div className="bg-white border-b border-[#D4A574]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-[#6B6B6B]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-[#2C2C2C]">Admin Dashboard</h1>
                <p className="text-sm text-[#6B6B6B]">Analytics & Management</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={loadData}
                variant="outline"
                disabled={isLoading}
                className="border-[#8B4513] text-[#8B4513]"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={exportData}
                className="bg-[#8B4513] hover:bg-[#6D3410] text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border-[#D4A574]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-[#8B4513]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B]">Total Views</p>
                  <p className="text-2xl text-[#2C2C2C]">
                    {summary.topViewed.reduce((sum, item) => sum + item.views, 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-[#D4A574]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#8B4513]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B]">Total Scans</p>
                  <p className="text-2xl text-[#2C2C2C]">{summary.totalScans}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-[#D4A574]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#8B4513]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B]">Avg. Dwell Time</p>
                  <p className="text-2xl text-[#2C2C2C]">
                    {summary.avgDwell.toFixed(0)}s
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-[#D4A574]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#8B4513]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B]">Total Interactions</p>
                  <p className="text-2xl text-[#2C2C2C]">{summary.totalInteractions}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Viewed Artworks */}
          <Card className="p-6 border-[#D4A574]">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-[#8B4513]" />
              <h3 className="text-[#2C2C2C]">Top Viewed Artworks</h3>
            </div>
            <div className="space-y-4">
              {summary?.topViewed.map((item, index) => (
                <div key={item.artworkId} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#8B4513] text-white rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#2C2C2C] truncate">{item.title}</p>
                    <p className="text-xs text-[#6B6B6B]">{item.artworkId}</p>
                  </div>
                  <Badge variant="secondary" className="bg-[#FAF6F1]">
                    {item.views} views
                  </Badge>
                </div>
              ))}
              {(!summary?.topViewed || summary.topViewed.length === 0) && (
                <p className="text-sm text-[#6B6B6B] text-center py-8">
                  No views recorded yet. Try viewing some artworks!
                </p>
              )}
            </div>
          </Card>

          {/* Recent Events */}
          <Card className="p-6 border-[#D4A574]">
            <h3 className="text-[#2C2C2C] mb-6">Recent Activity</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.slice(0, 10).map((event) => (
                <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-[#D4A574] last:border-0">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      event.event === 'view' ? 'border-blue-300 text-blue-700' :
                      event.event === 'recognize' ? 'border-green-300 text-green-700' :
                      event.event === 'audio_play' ? 'border-purple-300 text-purple-700' :
                      event.event === 'chat_query' ? 'border-orange-300 text-orange-700' :
                      'border-gray-300 text-gray-700'
                    }`}
                  >
                    {event.event}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#2C2C2C] truncate">{event.artworkId}</p>
                    <p className="text-xs text-[#6B6B6B]">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-sm text-[#6B6B6B] text-center py-8">
                  No events recorded yet
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Artworks Table */}
        <Card className="mt-8 p-6 border-[#D4A574]">
          <h3 className="text-[#2C2C2C] mb-6">Artwork Collection</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artworks.map((artwork) => (
                  <TableRow key={artwork.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="text-sm">{artwork.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{artwork.artist}</TableCell>
                    <TableCell className="text-sm">{artwork.year}</TableCell>
                    <TableCell className="text-sm">{artwork.galleryLocation.room}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {artwork.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Privacy Note:</strong> All analytics data is anonymized. Session IDs are randomly generated 
            and contain no personal information. This demo stores data locally in browser storage.
          </p>
        </div>
      </div>
    </div>
  );
};
