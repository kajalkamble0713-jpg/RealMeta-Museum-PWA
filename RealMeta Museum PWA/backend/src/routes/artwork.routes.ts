import { Router } from 'express';
import Artwork from '../models/Artwork.model';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { verifyAdminToken } from '../middleware/auth';
import { uploadArtworkImage } from '../middleware/upload';

const router = Router();

// Get all artworks
router.get('/', asyncHandler(async (req, res) => {
  const { search, tag, artist, limit = 50, skip = 0 } = req.query;
  
  let query: any = {};
  
  if (search) {
    query.$text = { $search: search as string };
  }
  
  if (tag) {
    query.tags = tag;
  }
  
  if (artist) {
    query.artist = new RegExp(artist as string, 'i');
  }
  
  const artworks = await Artwork.find(query)
    .limit(Number(limit))
    .skip(Number(skip))
    .sort({ createdAt: -1 });
  
  const total = await Artwork.countDocuments(query);
  
  res.json({
    artworks,
    total,
    limit: Number(limit),
    skip: Number(skip)
  });
}));

// Get single artwork by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);
  
  if (!artwork) {
    throw new AppError('Artwork not found', 404);
  }
  
  res.json(artwork);
}));

// Create new artwork (admin only)
router.post('/', verifyAdminToken, uploadArtworkImage, asyncHandler(async (req, res) => {
  const artworkData = req.body;
  
  if (req.file) {
    artworkData.imageUrl = `/uploads/artworks/${req.file.filename}`;
  }
  
  const artwork = new Artwork(artworkData);
  await artwork.save();
  
  res.status(201).json(artwork);
}));

// Update artwork (admin only)
router.put('/:id', verifyAdminToken, uploadArtworkImage, asyncHandler(async (req, res) => {
  const updates = req.body;
  
  if (req.file) {
    updates.imageUrl = `/uploads/artworks/${req.file.filename}`;
  }
  
  const artwork = await Artwork.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );
  
  if (!artwork) {
    throw new AppError('Artwork not found', 404);
  }
  
  res.json(artwork);
}));

// Delete artwork (admin only)
router.delete('/:id', verifyAdminToken, asyncHandler(async (req, res) => {
  const artwork = await Artwork.findByIdAndDelete(req.params.id);
  
  if (!artwork) {
    throw new AppError('Artwork not found', 404);
  }
  
  res.json({ message: 'Artwork deleted successfully' });
}));

// Get related artworks
router.get('/:id/related', asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);
  
  if (!artwork) {
    throw new AppError('Artwork not found', 404);
  }
  
  const related = await Artwork.find({
    _id: { $in: artwork.related }
  });
  
  res.json(related);
}));

export default router;

