import { Router } from 'express';
import AnalyticsEvent from '../models/Analytics.model';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();

// Track event
router.post('/track', asyncHandler(async (req, res) => {
  const { sessionId, artworkId, event, durationSeconds, meta } = req.body;
  
  if (!sessionId || !artworkId || !event) {
    throw new AppError('Missing required fields', 400);
  }
  
  const validEvents = ['view', 'audio_play', 'chat_query', 'exit', 'map_route', 'recognize'];
  if (!validEvents.includes(event)) {
    throw new AppError('Invalid event type', 400);
  }
  
  const analyticsEvent = new AnalyticsEvent({
    sessionId,
    artworkId,
    event,
    durationSeconds,
    meta: {
      ...meta,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    }
  });
  
  await analyticsEvent.save();
  
  res.json({ success: true });
}));

// Get analytics for specific artwork
router.get('/artwork/:artworkId', asyncHandler(async (req, res) => {
  const { artworkId } = req.params;
  const { startDate, endDate } = req.query;
  
  let query: any = { artworkId };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate as string);
    if (endDate) query.timestamp.$lte = new Date(endDate as string);
  }
  
  const events = await AnalyticsEvent.find(query).sort({ timestamp: -1 }).limit(1000);
  
  // Calculate statistics
  const viewCount = events.filter(e => e.event === 'view').length;
  const audioPlays = events.filter(e => e.event === 'audio_play').length;
  const chatQueries = events.filter(e => e.event === 'chat_query').length;
  
  const avgDwell = events
    .filter(e => e.durationSeconds)
    .reduce((sum, e) => sum + (e.durationSeconds || 0), 0) / events.length || 0;
  
  res.json({
    artworkId,
    stats: {
      totalEvents: events.length,
      viewCount,
      audioPlays,
      chatQueries,
      avgDwellSeconds: Math.round(avgDwell)
    },
    events: events.slice(0, 100) // Return last 100 events
  });
}));

export default router;

