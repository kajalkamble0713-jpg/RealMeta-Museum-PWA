import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatConversation extends Document {
  sessionId: string;
  artworkId: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant']
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const ChatConversationSchema = new Schema<IChatConversation>(
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
    messages: {
      type: [ChatMessageSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Compound index for conversation lookup
ChatConversationSchema.index({ sessionId: 1, artworkId: 1 });

export default mongoose.model<IChatConversation>('ChatConversation', ChatConversationSchema);

