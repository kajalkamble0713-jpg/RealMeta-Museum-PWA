import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  sessionId: string;
  artworkId: string;
  event: 'view' | 'audio_play' | 'chat_query' | 'exit' | 'map_route' | 'recognize';
  timestamp: Date;
  durationSeconds?: number;
  meta?: {
    userAgent?: string;
    approximateLocation?: string;
    deviceType?: string;
    [key: string]: any;
  };
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    artworkId: {
      type: String,
      required: true,
      index: true
    },
    event: {
      type: String,
      required: true,
      enum: ['view', 'audio_play', 'chat_query', 'exit', 'map_route', 'recognize'],
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    durationSeconds: {
      type: Number
    },
    meta: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for common queries
AnalyticsEventSchema.index({ artworkId: 1, event: 1 });
AnalyticsEventSchema.index({ sessionId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ timestamp: -1 });

export default mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);

