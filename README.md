# Artist Search App - CSCI 571 HW3

A full-stack web application for searching and exploring artists using the Artsy API.

## 🔗 Live Demo
- **Frontend:** https://aditib-frontend-hw3.wl.r.appspot.com
- **Backend API:** https://aditib-backend-hw3.wl.r.appspot.com/api/

## 📚 Tech Stack
**Frontend:** React + TypeScript + Bootstrap 5 + Vite  
**Backend:** Node.js + Express + MongoDB Atlas  
**Auth:** JWT (HTTP-only cookies) + Bcrypt  
**Deployment:** Google Cloud (App Engine + Cloud Run)

## ✨ Features
- 🔍 Search artists by name
- 👤 View artist profiles (bio, artworks, categories)
- ⭐ Add/remove favorite artists (authenticated users)
- 📱 Fully responsive design
- 🔐 Secure user authentication with email validation
- 🔔 Toast notifications for user actions
- 📤 Persistent auth across page refreshes

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- [Artsy API credentials](https://developers.artsy.net/)
- MongoDB Atlas connection string

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Fill in your credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

## 🔌 API Endpoints
```
GET  /api/artists/search?q=name       # Search artists
GET  /api/artists/:id                 # Get artist details
GET  /api/artists/:id/artworks        # Get artworks
GET  /api/artworks/:id/categories     # Get categories
POST /api/auth/register               # Register
POST /api/auth/login                  # Login
POST /api/auth/logout                 # Logout
GET  /api/favorites                   # Get favorites
POST /api/favorites/:artistId         # Add to favorites
```

## 📁 Project Structure
```
├── frontend/          # React + TypeScript
│   ├── src/components/
│   ├── src/services/
│   └── src/App.tsx
├── backend/           # Express server
│   ├── src/routes/
│   ├── src/models/
│   └── src/server.ts
└── README.md
```

## 🧪 Testing

Try searching for:
- **Pablo Picasso** - Full details, 1 artwork
- **Claude Monet** - Full details, 10 artworks
- **Vincent van Gogh** - 10 artworks, no bio
- **Yayoi Kusama** - No artworks

## 🔐 Authentication

- Email/password registration with validation
- Passwords hashed with Bcrypt
- JWT tokens in HTTP-only cookies (1 hour expiry)
- Persistent sessions via `/api/auth/me` endpoint

## ⚠️ Note
**React Implementation:** This assignment uses React instead of Angular. All functionality matches the original specifications.

## 📋 Resume Points
- Full-stack React + Node.js/Express application
- JWT authentication with HTTP-only cookies
- MongoDB NoSQL database with user authentication
- Third-party API integration (Artsy API)
- Responsive Bootstrap design
- Deployed on Google Cloud Platform

## 📂 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
ARTSY_CLIENT_ID=your_id
ARTSY_CLIENT_SECRET=your_secret
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

## 🔗 Additional Resources
- [Artsy API Docs](https://developers.artsy.net/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express Guide](https://expressjs.com/)

---

**Status:** ✅ Complete & Deployed  
**Last Updated:** February 2026
