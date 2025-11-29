import OpenAI from 'openai';
import sharp from 'sharp';
import Artwork from '../models/Artwork.model';
import { logger } from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Image Recognition Service
export class ImageRecognitionService {
  static async initialize() {
    try {
      // In production, load a trained model for artwork recognition
      // For demo, we'll use a simpler approach
      logger.info('Image recognition service initialized');
    } catch (error) {
      logger.error('Failed to initialize image recognition:', error);
    }
  }

  static async identifyArtwork(imagePath: string): Promise<{
    found: boolean;
    artworkId?: string;
    confidence?: number;
    alternatives?: Array<{ tag: string; score: number }>;
  }> {
    try {
      // Preprocess image
      const imageBuffer = await sharp(imagePath)
        .resize(224, 224)
        .toBuffer();

      // In production: Use actual ML model for recognition
      // For demo: Use OpenAI Vision API
      if (process.env.OPENAI_API_KEY) {
        return await this.identifyWithOpenAI(imagePath);
      }

      // Fallback: Return not found
      return {
        found: false,
        alternatives: [
          { tag: 'artwork', score: 0.45 },
          { tag: 'painting', score: 0.38 }
        ]
      };
    } catch (error) {
      logger.error('Image recognition error:', error);
      throw error;
    }
  }

  private static async identifyWithOpenAI(imagePath: string): Promise<any> {
    try {
      const imageBuffer = await sharp(imagePath).toBuffer();
      const base64Image = imageBuffer.toString('base64');

      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identify this artwork. Provide the title, artist, and year if recognizable. If not recognizable, describe what you see.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 300
      });

      const description = response.choices[0]?.message?.content || '';

      // Try to match with database
      const artworks = await Artwork.find({});
      for (const artwork of artworks) {
        if (description.toLowerCase().includes(artwork.title.toLowerCase()) ||
            description.toLowerCase().includes(artwork.artist.toLowerCase())) {
          return {
            found: true,
            artworkId: artwork.id,
            confidence: 0.85
          };
        }
      }

      return {
        found: false,
        alternatives: [
          { tag: 'artwork', score: 0.5 },
          { tag: 'painting', score: 0.4 }
        ]
      };
    } catch (error) {
      logger.error('OpenAI identification error:', error);
      throw error;
    }
  }
}

// AI Chatbot Service
export class ChatbotService {
  static async generateResponse(
    artworkId: string,
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      const artwork = await Artwork.findById(artworkId);
      if (!artwork) {
        return "I can only answer questions about artworks in our collection.";
      }

      if (!process.env.OPENAI_API_KEY) {
        return this.generateFallbackResponse(artwork, userMessage);
      }

      const systemPrompt = `You are a knowledgeable museum guide AI assistant. You are helping visitors learn about an artwork titled "${artwork.title}" by ${artwork.artist} (${artwork.year}).

Artwork details:
- Technique: ${artwork.technique}
- Description: ${artwork.shortBlurb}
- Story: ${artwork.longStory}
- Location: ${artwork.galleryLocation.room}
- Tags: ${artwork.tags.join(', ')}

Provide informative, engaging, and concise answers about this artwork. Be enthusiastic but professional. Keep responses under 150 words unless asked for more detail.`;

      const messages: any[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || "I'm not sure how to answer that.";
    } catch (error) {
      logger.error('Chatbot error:', error);
      return "I'm having trouble processing your question right now. Please try again.";
    }
  }

  private static generateFallbackResponse(artwork: any, userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('year') || lowerMessage.includes('when')) {
      return `${artwork.title} was created in ${artwork.year} by ${artwork.artist}.`;
    }

    if (lowerMessage.includes('artist') || lowerMessage.includes('who')) {
      return `This masterpiece was created by ${artwork.artist}.`;
    }

    if (lowerMessage.includes('technique') || lowerMessage.includes('how')) {
      return `The technique used is ${artwork.technique}.`;
    }

    if (lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return `You can find ${artwork.title} in ${artwork.galleryLocation.room}.`;
    }

    return `${artwork.shortBlurb} The artwork is located in ${artwork.galleryLocation.room}. What else would you like to know?`;
  }
}

// Text-to-Speech Narration Service
export class NarrationService {
  static async generateNarration(artworkId: string): Promise<string> {
    try {
      const artwork = await Artwork.findById(artworkId);
      if (!artwork) {
        throw new Error('Artwork not found');
      }

      // If pre-generated audio exists, return it
      if (artwork.audioUrl) {
        return artwork.audioUrl;
      }

      // Generate narration using OpenAI TTS
      if (process.env.OPENAI_API_KEY) {
        const narrationText = `${artwork.title} by ${artwork.artist}. ${artwork.shortBlurb}`;
        
        const mp3 = await openai.audio.speech.create({
          model: 'tts-1',
          voice: 'alloy',
          input: narrationText
        });

        // In production: Save to S3 or storage
        // For demo: Return mock URL
        return `/audio/${artworkId}.mp3`;
      }

      return `/audio/${artworkId}.mp3`;
    } catch (error) {
      logger.error('Narration generation error:', error);
      throw error;
    }
  }
}

// AI Info Generation Service
export class AIInfoService {
  static async generateInfo(
    artworkId: string,
    type: 'background' | 'analysis'
  ): Promise<string> {
    try {
      const artwork = await Artwork.findById(artworkId);
      if (!artwork) {
        throw new Error('Artwork not found');
      }

      if (!process.env.OPENAI_API_KEY) {
        return this.generateFallbackInfo(artwork, type);
      }

      const prompt = type === 'background'
        ? `Provide a brief historical background (150 words) about the artwork "${artwork.title}" by ${artwork.artist} (${artwork.year}). Include context about the artist and the period.`
        : `Provide a brief artistic analysis (150 words) of "${artwork.title}" by ${artwork.artist}. Focus on technique, composition, and significance.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || this.generateFallbackInfo(artwork, type);
    } catch (error) {
      logger.error('AI info generation error:', error);
      const artworkData = await Artwork.findById(artworkId);
      return this.generateFallbackInfo(artworkData, type);
    }
  }

  private static generateFallbackInfo(artwork: any, type: string): string {
    if (type === 'background') {
      return `${artwork.title} by ${artwork.artist} (${artwork.year}) is a masterpiece of ${artwork.tags[0]}. ${artwork.longStory.substring(0, 200)}...`;
    } else {
      return `Artistic analysis of ${artwork.title}: The ${artwork.technique.toLowerCase()} demonstrates masterful control. Notable elements include ${artwork.tags.slice(0, 2).join(' and ')} characteristics.`;
    }
  }
}

