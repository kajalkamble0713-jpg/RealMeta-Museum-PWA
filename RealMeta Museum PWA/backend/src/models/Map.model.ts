import mongoose, { Schema, Document } from 'mongoose';

export interface IMuseumMap extends Document {
  name: string;
  imageUrl: string;
  rooms: Array<{
    id: string;
    name: string;
    bounds: { x: number; y: number; width: number; height: number };
    description: string;
  }>;
  artworks: Array<{
    artworkId: string;
    x: number;
    y: number;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    bounds: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    description: { type: String, required: true }
  },
  { _id: false }
);

const ArtworkLocationSchema = new Schema(
  {
    artworkId: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  { _id: false }
);

const MuseumMapSchema = new Schema<IMuseumMap>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    rooms: {
      type: [RoomSchema],
      default: []
    },
    artworks: {
      type: [ArtworkLocationSchema],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMuseumMap>('MuseumMap', MuseumMapSchema);

