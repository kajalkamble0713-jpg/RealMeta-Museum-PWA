import { Router } from 'express';
import AnalyticsEvent from '../models/Analytics.model';
import Artwork from '../models/Artwork.model';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { verifyAdminPassword, generateAdminToken, verifyAdminToken } from '../middleware/auth';

const router = Router();

// Admin login
router.post('/login', asyncHandler(async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    throw new AppError('Password required', 400);
  }
  
  const isValid = await verifyAdminPassword(password);
  
  if (!isValid) {
    throw new AppError('Invalid password', 401);
  }
  
  const token = generateAdminToken();
  
  res.json({ token });
}));

// Get admin summary
router.get('/summary', verifyAdminToken, asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let query: any = {};
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate as string);
    if (endDate) query.timestamp.$lte = new Date(endDate as string);
  }
  
  const events = await AnalyticsEvent.find(query);
  
  // Calculate top viewed artworks
  const viewCounts: Record<string, number> = {};
  events.filter(e => e.event === 'view').forEach(e => {
    viewCounts[e.artworkId] = (viewCounts[e.artworkId] || 0) + 1;
  });
  
  const topViewedIds = Object.entries(viewCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([artworkId, views]) => ({ artworkId, views }));
  
  // Fetch artwork details
  const topViewed = await Promise.all(
    topViewedIds.map(async ({ artworkId, views }) => {
      const artwork = await Artwork.findById(artworkId);
      return {
        artworkId,
        views,
        title: artwork?.title || 'Unknown'
      };
    })
  );
  
  // Calculate average dwell time
  const dwellEvents = events.filter(e => e.durationSeconds);
  const avgDwell = dwellEvents.length > 0
    ? dwellEvents.reduce((sum, e) => sum + (e.durationSeconds || 0), 0) / dwellEvents.length
    : 0;
  
  // Total scans
  const totalScans = events.filter(e => e.event === 'recognize').length;
  
  res.json({
    topViewed,
    avgDwell: Math.round(avgDwell),
    totalScans,
    totalInteractions: events.length,
    dateRange: {
      start: startDate || events[events.length - 1]?.timestamp,
      end: endDate || events[0]?.timestamp
    }
  });
}));

// Get recent events
router.get('/events', verifyAdminToken, asyncHandler(async (req, res) => {
  const { limit = 100, skip = 0 } = req.query;
  
  const events = await AnalyticsEvent.find()
    .sort({ timestamp: -1 })
    .limit(Number(limit))
    .skip(Number(skip));
  
  const total = await AnalyticsEvent.countDocuments();
  
  res.json({
    events,
    total,
    limit: Number(limit),
    skip: Number(skip)
  });
}));

// Get analytics dashboard data
router.get('/dashboard', verifyAdminToken, asyncHandler(async (req, res) => {
  const totalArtworks = await Artwork.countDocuments();
  const totalEvents = await AnalyticsEvent.countDocuments();
  const totalViews = await AnalyticsEvent.countDocuments({ event: 'view' });
  const totalScans = await AnalyticsEvent.countDocuments({ event: 'recognize' });
  
  // Get events from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentEvents = await AnalyticsEvent.find({
    timestamp: { $gte: sevenDaysAgo }
  });
  
  // Group by day
  const eventsByDay: Record<string, number> = {};
  recentEvents.forEach(event => {
    const day = event.timestamp.toISOString().split('T')[0];
    eventsByDay[day] = (eventsByDay[day] || 0) + 1;
  });
  
  res.json({
    totalArtworks,
    totalEvents,
    totalViews,
    totalScans,
    recentActivity: eventsByDay
  });
}));

export default router;

