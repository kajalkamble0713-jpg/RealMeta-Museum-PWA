# 🤖 Setup Real AI Vision Recognition

## What You Get:
- Scan **ANY artwork** with your camera
- Get real information about any painting in the world
- AI identifies: title, artist, year, style, description
- Works with famous artworks AND unknown pieces

## Quick Setup (5 minutes):

### 1. Get OpenAI API Key (Free Trial Available)

1. Go to: https://platform.openai.com/signup
2. Sign up for an account
3. Add $5 credit (or use free trial)
4. Go to: https://platform.openai.com/api-keys
5. Click "Create new secret key"
6. Copy the key (starts with `sk-...`)

### 2. Add API Key to Backend

1. Open: `backend\.env`
2. Find the line: `OPENAI_API_KEY=your-openai-api-key`
3. Replace with: `OPENAI_API_KEY=sk-YOUR-ACTUAL-KEY-HERE`
4. Save the file

### 3. Restart Backend Server

Close the backend PowerShell window and run:
```powershell
cd backend
npm run dev
```

### 4. Test It!

1. Refresh your browser
2. Scan ANY artwork image
3. AI will identify it and provide real information!

## How It Works:

**Without API Key:**
- Uses filename matching (needs "starry", "gogh", etc.)
- Only recognizes 8 artworks in database

**With API Key:** ✨
- Uses OpenAI Vision (GPT-4o with vision)
- Recognizes ANY artwork in the world
- Provides detailed information automatically
- Even works with unknown/modern art!

## Example Results:

Scan any of these and get real info:
- ✅ Mona Lisa
- ✅ The Last Supper  
- ✅ The Creation of Adam
- ✅ American Gothic
- ✅ Campbell's Soup Cans (Warhol)
- ✅ Any modern artwork
- ✅ Even your own art!

## Cost:

- Free trial: $5 credit (lasts ~1000 scans)
- After trial: ~$0.005 per scan (very cheap!)
- Pay-as-you-go pricing

## Alternative: Google Vision API

If you prefer Google Cloud:

1. Get API key from: https://cloud.google.com/vision
2. Update backend code to use Google Vision instead
3. Similar pricing and accuracy

---

**Your app works NOW without the API key** - it just uses the database matching.

**Add the API key for real AI magic!** 🎨✨
