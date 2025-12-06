# Deployment Guide

## Vercel Deployment

### Automatic Detection

Vercel automatically detects Next.js projects. No special configuration is needed.

### Important Settings

If you encounter the error: "No Output Directory named 'public' found":

1. **Go to Vercel Project Settings**
2. **General → Build & Development Settings**
3. **Framework Preset**: Should be "Next.js" (auto-detected)
4. **Output Directory**: Should be **empty** or **".next"** (NOT "public")
5. **Build Command**: Should be **empty** or **"npm run build"**
6. **Install Command**: Should be **empty** or **"npm install"**

### Correct Configuration

- ✅ **Output Directory**: Leave empty (Vercel auto-detects `.next`)
- ✅ **Build Command**: Leave empty (Vercel uses `next build`)
- ✅ **Install Command**: Leave empty (Vercel uses `npm install`)
- ✅ **Root Directory**: Leave empty (unless project is in a subdirectory)

### Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=... (optional)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Database Setup

1. Use a managed PostgreSQL service:
   - Supabase (includes PostgreSQL)
   - Railway
   - Vercel Postgres
   - Neon

2. Run the initialization script:
   ```bash
   psql $DATABASE_URL -f scripts/init-db.sql
   ```

### Build Verification

After deployment, verify:
- ✅ Home page loads
- ✅ Constructor page works
- ✅ 3D preview renders
- ✅ API routes respond
- ✅ Database connections work

## Other Platforms

### Railway

1. Connect GitHub repository
2. Add PostgreSQL service
3. Set environment variables
4. Deploy

### Netlify

Not recommended for Next.js (use Vercel instead).

### Self-Hosted

1. Build: `npm run build`
2. Start: `npm start`
3. Requires Node.js 18+ and PostgreSQL

## Troubleshooting

### Build Fails

- Check environment variables are set
- Verify database connection string
- Check build logs for specific errors

### Runtime Errors

- Check server logs in Vercel dashboard
- Verify all environment variables are set
- Check database is accessible

### Static Assets Not Loading

- Ensure `public` directory exists
- Check file paths are correct
- Verify build completed successfully
