# Quick Installation Guide

## Step 1: Install Dependencies

```bash
cd next-app
npm install
```

## Step 2: Set Up Database

### Get a Free PostgreSQL Database from Neon.tech

1. Visit [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Click "Create Project"
4. Copy your connection string (looks like: `postgresql://user:pass@host/db?sslmode=require`)

### Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env and paste your database URL
# DATABASE_URL="postgresql://YOUR_CONNECTION_STRING"
```

## Step 3: Initialize Database

```bash
# Push the schema to your database
npm run db:push
```

✅ You should see: "Your database is now in sync with your Prisma schema."

## Step 4: Start Development Server

```bash
npm run dev
```

🎉 Open http://localhost:3001 in your browser!

## Optional: View Database in GUI

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555 where you can view and edit your data.

---

## Running Both Apps

You can run the production Vite app and Next.js app at the same time:

**Terminal 1** (from root):
```bash
npm run dev
# → Production app at http://localhost:3000
```

**Terminal 2** (from root):
```bash
cd next-app && npm run dev
# → Next.js app at http://localhost:3001
```

---

## Troubleshooting

### Database Connection Error

**Problem**: Can't connect to database

**Solution**: 
1. Check your `.env` file has correct `DATABASE_URL`
2. Make sure connection string includes `?sslmode=require` at the end
3. Verify your Neon project is active

### Port Already in Use

**Problem**: Port 3001 already in use

**Solution**: 
```bash
# Kill process using port 3001
# On macOS/Linux:
lsof -ti:3001 | xargs kill -9

# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Module Not Found

**Problem**: Cannot find module errors

**Solution**: 
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

Once the app is running:

1. Explore the database schema in Prisma Studio
2. Read `README.md` for full documentation
3. Check `NEXT_APP_SETUP.md` for complete setup guide
4. Wait for Phase 2 instructions to add features

---

Need help? Check the main `README.md` or refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Docs](https://neon.tech/docs)
