# 🚀 RealMeta Museum PWA - Quick Start Guide

## ⚡ Super Fast Start (Development)

### Windows (PowerShell)
```powershell
.\start-dev.ps1
```

### Linux/Mac
```bash
chmod +x start-dev.sh
./start-dev.sh
```

## 📋 Manual Setup (5 minutes)

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Start MongoDB

**Option A: Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name realmeta-mongo mongo:7.0
```

**Option B: Local MongoDB**
```bash
mongod
```

### 3. Configure Environment

**Backend**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/realmeta_museum
ADMIN_PASSWORD=your-password-here
```

**Frontend**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on http://localhost:5173

### 5. Open Browser

Visit: **http://localhost:5173**

## 🐳 Docker Production Deployment (1 command)

```bash
docker-compose up -d --build
```

Access at: **http://localhost**

## 🎯 What You Get

✅ **Full-Stack PWA** with React + TypeScript frontend  
✅ **RESTful API** with Node.js + Express + MongoDB  
✅ **AI Features** - Image recognition, chatbot, narration  
✅ **Analytics** - Visitor tracking and admin dashboard  
✅ **Production Ready** - Docker, CI/CD, security configured

## 🛠️ Key Features to Test

1. **Artwork Scanner** - Click "Scan Artwork" to recognize art
2. **AI Chatbot** - Ask questions about any artwork
3. **Interactive Map** - Navigate the museum virtually
4. **Admin Dashboard** - Login with password (default: demo123)
5. **Audio Narration** - Listen to artwork descriptions

## 📚 Full Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [README_FULL.md](./README_FULL.md) - Full project documentation

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
docker ps  # Should show realmeta-mongo

# Check backend logs
cd backend
npm run dev
```

### Frontend can't connect
```bash
# Verify VITE_API_URL in .env
cat .env  # Should show: VITE_API_URL=http://localhost:5000/api

# Restart frontend
npm run dev
```

### Port already in use
```bash
# Frontend (5173)
npx kill-port 5173

# Backend (5000)
npx kill-port 5000
```

## 🎨 Default Credentials

**Admin Dashboard:**
- Password: `demo123` (change in backend/.env)

## 📦 Project Structure

```
RealMeta Museum PWA/
├── src/              # Frontend React app
├── backend/          # Backend API server
├── docker-compose.yml # Production deployment
└── package.json      # Frontend dependencies
```

## 🔥 Hot Tips

1. **OpenAI API** (optional): Add `OPENAI_API_KEY` to `backend/.env` for AI features
2. **Database Seed**: Run `npm run seed` in backend/ to add sample artworks
3. **Production Build**: Run `npm run build` to create optimized build
4. **Logs**: Check `backend/logs/` for detailed error logs

## 🚀 Next Steps

1. Customize artwork data in `src/lib/mockData.ts`
2. Add your museum's branding in `src/components/`
3. Configure MongoDB connection for production
4. Set up SSL/HTTPS for deployment
5. Deploy to cloud (Vercel, Railway, AWS, etc.)

## 💡 Need Help?

- Check logs: `docker-compose logs -f`
- Read full docs: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Verify MongoDB: `docker exec -it realmeta-mongo mongosh`

---

**Happy Coding! 🎉**
