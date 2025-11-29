import { Router } from 'express';
import ChatConversation from '../models/Chat.model';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ChatbotService } from '../services/ai.service';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for chat
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many chat requests, please try again later'
});

// Send chat message
router.post('/message', chatLimiter, asyncHandler(async (req, res) => {
  const { sessionId, artworkId, message } = req.body;
  
  if (!sessionId || !artworkId || !message) {
    throw new AppError('Missing required fields', 400);
  }
  
  // Get or create conversation
  let conversation = await ChatConversation.findOne({ sessionId, artworkId });
  
  if (!conversation) {
    conversation = new ChatConversation({
      sessionId,
      artworkId,
      messages: []
    });
  }
  
  // Add user message
  conversation.messages.push({
    role: 'user',
    content: message,
    timestamp: new Date()
  });
  
  // Generate AI response
  const conversationHistory = conversation.messages.map(m => ({
    role: m.role,
    content: m.content
  }));
  
  const replyText = await ChatbotService.generateResponse(
    artworkId,
    message,
    conversationHistory.slice(-10) // Last 10 messages for context
  );
  
  // Add assistant response
  conversation.messages.push({
    role: 'assistant',
    content: replyText,
    timestamp: new Date()
  });
  
  await conversation.save();
  
  res.json({ replyText });
}));

// Get conversation history
router.get('/conversation/:sessionId/:artworkId', asyncHandler(async (req, res) => {
  const { sessionId, artworkId } = req.params;
  
  const conversation = await ChatConversation.findOne({ sessionId, artworkId });
  
  if (!conversation) {
    return res.json({ messages: [] });
  }
  
  res.json({ messages: conversation.messages });
}));

// Clear conversation
router.delete('/conversation/:sessionId/:artworkId', asyncHandler(async (req, res) => {
  const { sessionId, artworkId } = req.params;
  
  await ChatConversation.deleteOne({ sessionId, artworkId });
  
  res.json({ message: 'Conversation cleared' });
}));

export default router;

