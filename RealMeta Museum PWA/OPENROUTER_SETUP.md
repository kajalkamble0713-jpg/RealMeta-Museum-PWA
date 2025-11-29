# OpenRouter GPT-4 Vision Setup

Your RealMeta Museum PWA has been upgraded to use **OpenRouter's GPT-4 Vision API** for superior artwork recognition!

## 🚀 What Changed

- **Backend now uses GPT-4 Vision** via OpenRouter for artwork identification
- **Better accuracy** in recognizing museum artworks
- **Chatbot upgraded** to GPT-4 for more intelligent conversations

## 🔑 Get Your FREE OpenRouter API Key

1. Visit: https://openrouter.ai/keys
2. Sign up for a free account
3. Create an API key
4. You get **$5 FREE credits** to start!

## ⚙️ Configure Your API Key

### Option 1: Environment Variable (Recommended)
Create a `.env` file in the `backend` folder:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

### Option 2: Direct Edit (Quick Start)
The backend already has a demo key configured, so you can test it immediately!
To use your own key, edit `backend/src/server.js` line 14:
```javascript
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'your-key-here';
```

## 🎯 How It Works

1. **Scan artwork** with camera or upload image
2. Image sent to **GPT-4 Vision** via OpenRouter
3. AI identifies the artwork and returns:
   - Title
   - Artist
   - Year
   - Description
   - Style
   - Story
   - Technique
4. Results displayed beautifully in your app!

## 💰 Pricing

OpenRouter pricing for GPT-4 Vision:
- **$5 free credits** when you sign up
- Very affordable pay-as-you-go after that
- Only charged for what you use

## ✅ Testing

Your backend is now running with the new OpenRouter integration!

1. Refresh your browser at http://localhost:5173
2. Click "Scan Artwork"
3. Upload or scan an image of any famous painting
4. Watch GPT-4 Vision identify it with amazing accuracy!

## 📊 Supported Artworks

GPT-4 Vision can recognize:
- ✅ Famous paintings (Mona Lisa, Starry Night, etc.)
- ✅ Classical sculptures
- ✅ Modern art
- ✅ Contemporary installations
- ✅ Historical artifacts
- ✅ And much more!

## 🐛 Troubleshooting

**Issue: "Failed to analyze artwork"**
- Check that backend is running (you should see "GPT-4 Vision" in the console)
- Verify your API key is correct
- Check OpenRouter credits: https://openrouter.ai/credits

**Issue: Results not showing**
- Open browser console (F12) and check for errors
- Make sure frontend is calling `http://localhost:5000/api/identify`
- Verify CORS is enabled (already configured)

## 🎨 Example Test

Try scanning these famous artworks:
1. Mona Lisa by Leonardo da Vinci
2. The Starry Night by Vincent van Gogh
3. The Scream by Edvard Munch
4. Girl with a Pearl Earring by Johannes Vermeer
5. The Great Wave off Kanagawa by Hokusai

---

**Need help?** Check the OpenRouter docs: https://openrouter.ai/docs
