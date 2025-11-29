import mongoose, { Schema, Document } from 'mongoose';

export interface IArtwork extends Document {
  title: string;
  artist: string;
  year: number;
  shortBlurb: string;
  longStory: string;
  technique: string;
  provenance: string;
  imageUrl: string;
  audioUrl?: string;
  videoUrl?: string;
  tags: string[];
  related: string[];
  galleryLocation: {
    room: string;
    x: number;
    y: number;
  };
  arMarker?: {
    markerId: string;
    markerFile: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ArtworkSchema = new Schema<IArtwork>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    artist: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    year: {
      type: Number,
      required: true,
      index: true
    },
    shortBlurb: {
      type: String,
      required: true,
      maxlength: 500
    },
    longStory: {
      type: String,
      required: true
    },
    technique: {
      type: String,
      required: true
    },
    provenance: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    audioUrl: {
      type: String
    },
    videoUrl: {
      type: String
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    related: {
      type: [String],
      default: []
    },
    galleryLocation: {
      room: {
        type: String,
        required: true
      },
      x: {
        type: Number,
        required: true
      },
      y: {
        type: Number,
        required: true
      }
    },
    arMarker: {
      markerId: String,
      markerFile: String
    }
  },
  {
    timestamps: true
  }
);

// Text search index
ArtworkSchema.index({ title: 'text', artist: 'text', tags: 'text', shortBlurb: 'text' });

export default mongoose.model<IArtwork>('Artwork', ArtworkSchema);

