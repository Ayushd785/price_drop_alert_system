# Vercel Deployment Setup

## Environment Variables Required

When deploying to Vercel, you need to set these environment variables in your Vercel dashboard:

### Database

- `MONGODB_URI` - Your MongoDB connection string
  - Example: `mongodb+srv://username:password@cluster0.mongodb.net/database_name?retryWrites=true&w=majority`

### JWT Authentication

- `JWT_SECRET_KEY` - Secret key for JWT token signing
  - Example: `your_jwt_secret_key_here`

### ScraperAPI (for product scraping)

- `SCRAPER_API_KEY` - Your ScraperAPI key
  - Example: `your_scraper_api_key_here`

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with its value
5. Make sure to set them for all environments (Production, Preview, Development)

## Current Values (from your existing setup)

- MONGODB_URI: `mongodb+srv://ayushd785:ayush%40ayush@cluster0.hptou9o.mongodb.net/Amazon_price_drop?retryWrites=true&w=majority`
- SCRAPER_API_KEY: `931e7a721872035bc9599972dd4d76ba`
- JWT_SECRET_KEY: (You'll need to create this - use a long random string)
