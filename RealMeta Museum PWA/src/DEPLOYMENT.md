# RealMeta Deployment Guide

This guide covers deploying the RealMeta PWA frontend (current implementation) and provides instructions for future backend integration.

## Current Status: Frontend-Only Demo

The current implementation is a **fully-functional frontend demo** with:
- Mock backend services
- Local storage for analytics
- Sample artwork data
- All UI features implemented

## Quick Deploy - Frontend Only

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/realmeta.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the React app
   - Click "Deploy"

3. **Configure**
   - No environment variables needed for demo mode
   - Add custom domain if desired
   - Enable HTTPS (automatic with Vercel)

### Netlify

1. **Build Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [[headers]]
     for = "/manifest.json"
     [headers.values]
       Content-Type = "application/manifest+json"
   ```

2. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/realmeta"
   }
   ```

3. **Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

## PWA Requirements

### Enable HTTPS

All major features (camera, AR, service workers) require HTTPS:
- ✅ Vercel provides automatic HTTPS
- ✅ Netlify provides automatic HTTPS
- ✅ GitHub Pages supports HTTPS
- ⚠️ Custom domain needs SSL certificate

### Service Worker

To enable offline support, add `service-worker.js`:

```javascript
// public/service-worker.js
const CACHE_NAME = 'realmeta-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/globals.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

Register in `index.html`:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => console.log('SW registered'))
    .catch((error) => console.log('SW registration failed'));
}
```

## Future: Backend Integration

### Architecture Overview

```
Frontend (Current)          Backend (Future)
    ↓                           ↓
  Vercel/Netlify           Vercel Serverless
  or any static host       or Render/Railway
    ↓                           ↓
  Calls API                  Node.js/Express
    ↓                           ↓
  /api/* endpoints          Controllers
                                ↓
                         Firebase/Supabase
```

### Backend Deployment Options

#### Option 1: Vercel Serverless Functions

1. **Create API directory**
   ```
   /api
     /identify.ts
     /artwork.ts
     /chat.ts
     /narrate.ts
     /analytics.ts
   ```

2. **Example function**
   ```typescript
   // api/identify.ts
   import { VercelRequest, VercelResponse } from '@vercel/node';
   import vision from '@google-cloud/vision';

   export default async function handler(
     req: VercelRequest,
     res: VercelResponse
   ) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     const client = new vision.ImageAnnotatorClient();
     const [result] = await client.webDetection(req.body.image);
     
     // Match to artwork database...
     
     return res.status(200).json({ found: true, artworkId: '...' });
   }
   ```

3. **Environment Variables**
   - Add in Vercel dashboard
   - All from `.env.example`

#### Option 2: Render/Railway Backend

1. **Create Express server**
   ```typescript
   // backend/src/server.ts
   import express from 'express';
   import cors from 'cors';
   
   const app = express();
   app.use(cors({ origin: process.env.FRONTEND_URL }));
   app.use(express.json());
   
   // Import routes
   app.use('/api/identify', identifyRoute);
   app.use('/api/artwork', artworkRoute);
   // ... etc
   
   app.listen(process.env.PORT || 8080);
   ```

2. **Deploy to Render**
   - Connect GitHub repo
   - Select "Web Service"
   - Set build command: `cd backend && npm install`
   - Set start command: `node dist/server.js`
   - Add environment variables

3. **Update Frontend**
   ```typescript
   // lib/apiConfig.ts
   export const API_BASE_URL = 
     process.env.NODE_ENV === 'production' 
       ? 'https://api.realmeta.com'
       : 'http://localhost:8080';
   ```

### Database Setup

#### Firebase

1. **Create Project**
   - Visit [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable Firestore
   - Enable Cloud Storage

2. **Initialize**
   ```typescript
   import admin from 'firebase-admin';
   
   admin.initializeApp({
     credential: admin.credential.cert(
       JSON.parse(process.env.FIREBASE_CREDENTIALS)
     ),
     storageBucket: process.env.FIREBASE_STORAGE_BUCKET
   });
   
   const db = admin.firestore();
   const storage = admin.storage();
   ```

3. **Seed Data**
   ```bash
   node scripts/seed-firestore.js
   ```

#### Supabase

1. **Create Project**
   - Visit [Supabase Dashboard](https://app.supabase.com)
   - Create new project
   - Get URL and anon key

2. **Run Migrations**
   ```sql
   -- Create artworks table
   CREATE TABLE artworks (
     id TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     artist TEXT NOT NULL,
     year INTEGER,
     -- ... all fields from schema
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Create analytics table
   CREATE TABLE analytics (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     session_id TEXT NOT NULL,
     artwork_id TEXT,
     event TEXT NOT NULL,
     timestamp TIMESTAMP NOT NULL,
     duration_seconds INTEGER,
     meta JSONB
   );
   ```

3. **Seed Data**
   ```bash
   node scripts/seed-supabase.js
   ```

### External Services Setup

#### Google Cloud Vision

1. **Enable API**
   - Visit [Google Cloud Console](https://console.cloud.google.com)
   - Enable Vision API
   - Create service account
   - Download JSON credentials

2. **Set Environment**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
   ```

#### OpenAI

1. **Get API Key**
   - Visit [OpenAI Platform](https://platform.openai.com)
   - Generate API key
   - Set in environment: `OPENAI_API_KEY=sk-...`

2. **Usage**
   ```typescript
   import OpenAI from 'openai';
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY
   });
   
   const response = await openai.chat.completions.create({
     model: 'gpt-4',
     messages: [{ role: 'user', content: prompt }]
   });
   ```

## Production Checklist

### Security

- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Add input validation
- [ ] Implement admin authentication (OAuth)
- [ ] Hash/anonymize analytics data
- [ ] Add CSP headers

### Performance

- [ ] Enable CDN for static assets
- [ ] Optimize images (WebP, lazy loading)
- [ ] Implement service worker caching
- [ ] Add Redis for API response caching
- [ ] Compress responses (gzip/brotli)
- [ ] Monitor API response times

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Monitor uptime (UptimeRobot)
- [ ] Set up logging (CloudWatch, Datadog)
- [ ] Track API usage

### Compliance

- [ ] Add privacy policy
- [ ] Implement GDPR compliance
- [ ] Add terms of service
- [ ] Cookie consent (if using cookies)
- [ ] Data retention policy

## Cost Estimates

### Free Tier (Demo/Small Museum)

- **Hosting:** Vercel/Netlify free tier (sufficient for <10k visitors/month)
- **Database:** Firebase free tier (1GB storage, 50k reads/day)
- **Vision API:** Google Cloud free tier ($300 credit)
- **Total:** $0/month for moderate usage

### Production (Medium Museum)

- **Hosting:** Vercel Pro ($20/month)
- **Backend:** Render Starter ($7/month)
- **Database:** Firebase Blaze pay-as-you-go (~$25/month)
- **Vision API:** ~$1.50 per 1000 requests
- **OpenAI API:** ~$0.002 per 1k tokens
- **Total:** ~$60-100/month for 10k visitors

### Enterprise (Large Museum)

- **Hosting:** Vercel Pro + CDN ($100+/month)
- **Backend:** Dedicated server ($200/month)
- **Database:** Firebase/Supabase Pro ($100/month)
- **APIs:** Volume pricing
- **Total:** $500-1000/month

## Rollback Strategy

### Frontend

1. **Vercel:** Use deployment dashboard to rollback
2. **Netlify:** Deploy previous build
3. **GitHub Pages:** Revert git commit and redeploy

### Backend

1. **Keep previous version deployed**
2. **Use environment toggle** to switch between versions
3. **Database migrations:** Always forward-compatible

## Support

For deployment issues:
- Check platform-specific docs
- Review environment variables
- Check browser console for errors
- Verify API endpoints are accessible

---

**Ready to Deploy!**

Start with the frontend demo, then integrate backend services incrementally.
