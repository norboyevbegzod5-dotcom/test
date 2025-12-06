# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Supabase account (for authentication)
- OpenAI API key (optional, for AI renders)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/furniture_db

# Supabase (get these from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (optional, for AI renders)
OPENAI_API_KEY=sk-your-openai-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

#### Option A: Using the SQL script

```bash
psql -U postgres -d furniture_db -f scripts/init-db.sql
```

#### Option B: Automatic initialization

The database will be initialized automatically on the first API call, or you can run:

```bash
# Make sure DATABASE_URL is set in .env
npx ts-node scripts/init-database.ts
```

### 4. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy the Project URL and anon key
4. Copy the service_role key (keep this secret!)
5. Add them to your `.env` file

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Use

1. **Sign Up**: Navigate to `/auth` and create an account
2. **Create Project**: Go to Constructor and start designing
3. **Save Project**: Click Save to store your project
4. **Export**: Use PDF or Excel export to generate specifications

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Ensure database exists: `createdb furniture_db`

### Supabase Auth Issues

- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure CORS is configured in Supabase dashboard

### 3D Preview Not Showing

- Check browser console for errors
- Ensure Three.js dependencies are installed
- Try a different browser

### Export Not Working

- Ensure jsPDF and xlsx are installed
- Check browser allows downloads
- Verify file permissions

## Production Deployment

### Build

```bash
npm run build
```

### Environment Variables

Set all environment variables in your hosting platform:
- Vercel: Project Settings > Environment Variables
- Railway: Variables tab
- Heroku: Config Vars

### Database

Use a managed PostgreSQL service:
- Supabase (includes PostgreSQL)
- Railway
- Heroku Postgres
- AWS RDS

## Next Steps

- Configure material prices in database
- Set up hardware price updates
- Customize sheet sizes if needed
- Add more material types
- Configure labor rates
