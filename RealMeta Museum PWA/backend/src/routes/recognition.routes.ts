import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { uploadRecognitionImage } from '../middleware/upload';
import { ImageRecognitionService } from '../services/ai.service';
import { AIInfoService, NarrationService } from '../services/ai.service';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for recognition endpoint
const recognitionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: 'Too many recognition requests, please try again later'
});

// Identify artwork from image
router.post('/identify', recognitionLimiter, uploadRecognitionImage, asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }
  
  const result = await ImageRecognitionService.identifyArtwork(req.file.path);
  
  res.json(result);
}));

// Get AI-generated info about artwork
router.get('/ai-info/:artworkId', asyncHandler(async (req, res) => {
  const { type } = req.query;
  
  if (!type || !['background', 'analysis'].includes(type as string)) {
    throw new AppError('Invalid info type. Must be "background" or "analysis"', 400);
  }
  
  const text = await AIInfoService.generateInfo(
    req.params.artworkId,
    type as 'background' | 'analysis'
  );
  
  res.json({ text });
}));

// Get narration for artwork
router.get('/narration/:artworkId', asyncHandler(async (req, res) => {
  const audioUrl = await NarrationService.generateNarration(req.params.artworkId);
  
  res.json({ audioUrl });
}));

export default router;

