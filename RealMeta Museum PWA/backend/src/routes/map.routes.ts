import { Router } from 'express';
import MuseumMap from '../models/Map.model';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { verifyAdminToken } from '../middleware/auth';

const router = Router();

// Get active museum map
router.get('/', asyncHandler(async (req, res) => {
  const map = await MuseumMap.findOne({ isActive: true });
  
  if (!map) {
    throw new AppError('No active museum map found', 404);
  }
  
  res.json(map);
}));

// Get map by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const map = await MuseumMap.findById(req.params.id);
  
  if (!map) {
    throw new AppError('Map not found', 404);
  }
  
  res.json(map);
}));

// Create map (admin only)
router.post('/', verifyAdminToken, asyncHandler(async (req, res) => {
  const map = new MuseumMap(req.body);
  await map.save();
  
  res.status(201).json(map);
}));

// Update map (admin only)
router.put('/:id', verifyAdminToken, asyncHandler(async (req, res) => {
  const map = await MuseumMap.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!map) {
    throw new AppError('Map not found', 404);
  }
  
  res.json(map);
}));

// Set active map (admin only)
router.post('/:id/activate', verifyAdminToken, asyncHandler(async (req, res) => {
  // Deactivate all maps
  await MuseumMap.updateMany({}, { isActive: false });
  
  // Activate the specified map
  const map = await MuseumMap.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  );
  
  if (!map) {
    throw new AppError('Map not found', 404);
  }
  
  res.json(map);
}));

export default router;

