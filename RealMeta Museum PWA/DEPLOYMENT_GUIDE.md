# RealMeta Museum PWA - Deployment Guide

## Overview
This guide covers deploying the complete RealMeta Museum PWA with backend API, frontend, and database.

## Prerequisites
- Node.js 18+ installed
- MongoDB installed (or MongoDB Atlas account)
- Docker & Docker Compose (for containerized deployment)
- (Optional) OpenAI API key for AI features

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Key variables:
- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key (optional, for AI features)
- `ADMIN_PASSWORD`: Admin dashboard password
- `JWT_SECRET`: Secret for JWT tokens

**Frontend (.env)**
```bash
cp .env.example .env
# Edit .env
```

Set `VITE_API_URL` to your backend API URL.

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name realmeta-mongo mongo:7.0

# Or start local MongoDB service
mongod
```

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### 5. Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Production Deployment

### Option 1: Docker Compose (Recommended)

This method deploys everything (frontend, backend, database) with one command.

```bash
# Create .env file in root directory
cp .env.example .env

# Edit .env with production values:
JWT_SECRET=your-secure-secret-here
ADMIN_PASSWORD=your-admin-password
OPENAI_API_KEY=your-openai-key (optional)
CORS_ORIGIN=https://yourdomain.com
VITE_API_URL=https://yourdomain.com/api

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the app at `http://localhost` (port 80).

### Option 2: Manual Deployment

#### Deploy Backend

```bash
cd backend

# Install dependencies
npm ci --production

# Build TypeScript
npm run build

# Start with PM2 (process manager)
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Deploy Frontend

```bash
# Build frontend
npm run build

# Serve with Nginx
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo cp -r dist/* /var/www/html/
sudo nginx -s reload
```

### Option 3: Cloud Platforms

#### Vercel (Frontend)
```bash
npm install -g vercel
vercel --prod
```

#### Railway/Render (Backend)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

#### MongoDB Atlas (Database)
1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

## Database Seeding

To populate the database with initial artwork data:

```bash
cd backend
npm run seed
```

## Environment Variables Reference

### Backend Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| NODE_ENV | Environment mode | No | development |
| PORT | Server port | No | 5000 |
| MONGODB_URI | MongoDB connection string | Yes | - |
| JWT_SECRET | JWT signing secret | Yes | - |
| ADMIN_PASSWORD | Admin dashboard password | Yes | demo123 |
| OPENAI_API_KEY | OpenAI API key for AI features | No | - |
| CORS_ORIGIN | Allowed CORS origin | No | http://localhost:5173 |
| MAX_FILE_SIZE | Max upload file size in bytes | No | 10485760 |

### Frontend Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| VITE_API_URL | Backend API URL | Yes | http://localhost:5000/api |

## SSL/HTTPS Setup

For production, enable HTTPS:

1. **Get SSL Certificate** (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

2. **Update nginx.conf** to redirect HTTP to HTTPS

3. **Update environment variables** to use HTTPS URLs

## Monitoring & Maintenance

### View Backend Logs
```bash
# Docker
docker-compose logs -f backend

# PM2
pm2 logs realmeta-api
```

### View Database
```bash
# Connect to MongoDB
mongo localhost:27017/realmeta_museum

# Or with Docker
docker exec -it realmeta-mongodb mongosh realmeta_museum
```

### Backup Database
```bash
# MongoDB dump
mongodump --uri="mongodb://localhost:27017/realmeta_museum" --out=./backup

# Docker
docker exec realmeta-mongodb mongodump --out=/backup
```

## Scaling

### Horizontal Scaling
- Use PM2 cluster mode (already configured in `ecosystem.config.js`)
- Deploy multiple backend instances behind a load balancer
- Use MongoDB replica sets for database redundancy

### Performance Optimization
- Enable Redis caching for API responses
- Use CDN for static assets
- Implement image optimization pipeline
- Set up database indexes (already configured in models)

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `docker ps` or `mongod --version`
- Verify environment variables are set
- Check logs: `docker-compose logs backend`

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running and accessible

### Database connection errors
- Verify MongoDB URI format
- Check MongoDB is accessible
- Ensure network connectivity

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS in production
- [ ] Set appropriate CORS origins
- [ ] Keep dependencies updated
- [ ] Implement rate limiting (already configured)
- [ ] Regular database backups
- [ ] Monitor logs for suspicious activity

## Support

For issues or questions:
- Check logs first
- Review this guide
- Open an issue on GitHub repository
