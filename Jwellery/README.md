# 💎 Jwellery — Luxury Jewelry E-Commerce Platform

A complete, production-ready luxury jewelry e-commerce platform inspired by GIVA, Palmonas, Tanishq, and Cartier.

## Tech Stack

**Frontend** — React 19 + Vite + TailwindCSS + shadcn/ui  
**Backend** — Node.js + Express.js + MongoDB + Mongoose  
**Auth** — JWT (Access + Refresh tokens in HTTP-only cookies)  
**Payments** — Razorpay + Stripe  
**Storage** — Cloudinary  
**Email** — Nodemailer (Gmail)

## Project Structure

```
Jwellery/
├── client/          # React 19 + Vite frontend
└── server/          # Node.js + Express backend
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Cloudinary account
- Razorpay account (test mode)
- Stripe account (test mode)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Deployment

- **Frontend** → Vercel
- **Backend** → Render
- **Database** → MongoDB Atlas

## Environment Variables

See `server/.env.example` and `client/.env.example` for required variables.
