# Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Environment Variables

Create `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/furniture_db
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key  # Optional
```

## 3. Initialize Database

```bash
psql -U postgres -d furniture_db -f scripts/init-db.sql
```

Or let it auto-initialize on first API call.

## 4. Run Development Server

```bash
npm run dev
```

## 5. Open Browser

Visit: http://localhost:3000

## Test the Application

1. **Go to Constructor** (`/constructor`)
2. **Enter dimensions**: 800mm x 2000mm x 500mm
3. **Select material**: ЛДСП 16mm
4. **Add shelves**: 2 shelves
5. **View 3D preview**: Interactive 3D model
6. **Check materials**: See cutting plan and cost
7. **Export**: Click PDF or Excel to download specification

## Common Issues

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL format
- Ensure database exists

### 3D Preview Not Showing
- Check browser console
- Try Chrome or Firefox
- Clear browser cache

### Export Not Working
- Check browser download permissions
- Verify jsPDF/xlsx are installed
- Try different browser

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [SETUP.md](./SETUP.md) for detailed setup
- See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for feature list

## Need Help?

- Check console for errors
- Review API routes in `app/api/`
- Inspect database with `psql`
- Review component code in `components/`

Happy building! 🚀
