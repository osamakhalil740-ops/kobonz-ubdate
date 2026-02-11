# 🔀 Dual Application Setup Guide

This repository now contains **TWO independent applications** running side-by-side:

---

## 📱 Application Overview

### 1️⃣ **Production App** (Existing - Vite/React/Firebase)

**Location**: Root directory (`/`)  
**Port**: `3000`  
**Framework**: React 19 + Vite 6  
**Database**: Firebase/Firestore  
**Routing**: React Router DOM  
**Status**: ✅ **Production - DO NOT MODIFY**

**Start Command**:
```bash
npm run dev
```

**Access**: http://localhost:3000

---

### 2️⃣ **Next.js Platform** (New - Isolated)

**Location**: `/next-app` directory  
**Port**: `3001`  
**Framework**: Next.js 14 (App Router)  
**Database**: PostgreSQL (Neon)  
**Routing**: Next.js App Router  
**Status**: ✅ **Development - Safe to Modify**

**Start Command**:
```bash
cd next-app
npm run dev
```

**Access**: http://localhost:3001

---

## 🚀 Running Both Apps Simultaneously

### Terminal Setup

**Terminal 1** - Production Vite App:
```bash
# From repository root
npm run dev
```
✅ Runs on: http://localhost:3000

**Terminal 2** - Next.js Platform:
```bash
# From repository root
cd next-app
npm install  # First time only
npm run dev
```
✅ Runs on: http://localhost:3001

Both apps run completely independently with **ZERO conflicts**.

---

## 📊 Comparison Table

| Feature | Production App | Next.js App |
|---------|---------------|-------------|
| **Directory** | `/` (root) | `/next-app` |
| **Framework** | React + Vite | Next.js 14 |
| **Port** | 3000 | 3001 |
| **Database** | Firebase/Firestore | PostgreSQL |
| **Package Manager** | npm | npm |
| **Dependencies** | Root `package.json` | `/next-app/package.json` |
| **Config Files** | `vite.config.ts` | `next.config.js` |
| **TypeScript** | `tsconfig.json` | `/next-app/tsconfig.json` |
| **Routing** | React Router DOM | Next.js App Router |
| **Authentication** | Firebase Auth | Not yet implemented |
| **Styling** | Tailwind CSS | Tailwind CSS + shadcn/ui |
| **Status** | 🔒 Protected | ✅ Editable |
| **Purpose** | Live production | Future platform |

---

## 🔒 Safety Rules

### ✅ **SAFE to Modify**
- Anything inside `/next-app/` directory
- `/next-app/package.json`
- `/next-app/prisma/schema.prisma`
- New features in Next.js app

### ❌ **DO NOT Modify**
- Root `package.json`
- Root `tsconfig.json`
- `vite.config.ts`
- `firebase.ts`
- Any files in `/components/`
- Any files in `/pages/`
- Any files in `/services/`
- Any existing production code

---

## 📁 Directory Structure

```
kobonz/
├── 📂 Production App (Root - DO NOT MODIFY)
│   ├── App.tsx
│   ├── package.json          ← Production dependencies
│   ├── vite.config.ts         ← Vite configuration
│   ├── tsconfig.json          ← Production TypeScript
│   ├── firebase.ts            ← Firebase setup
│   ├── components/            ← Production components
│   ├── pages/                 ← Production pages
│   ├── services/              ← Production services
│   └── ... (all existing files)
│
└── 📂 next-app/ (SAFE TO MODIFY)
    ├── app/                   ← Next.js routes
    ├── components/            ← Next.js components
    ├── lib/                   ← Utilities & types
    ├── prisma/                ← Database schema
    ├── package.json           ← Next.js dependencies
    ├── next.config.js         ← Next.js config
    ├── tsconfig.json          ← Next.js TypeScript
    └── README.md              ← Next.js documentation
```

---

## 🎯 Quick Start Guide

### First Time Setup

#### Production App (Already Working)
```bash
# Already installed, just run:
npm run dev
```

#### Next.js App (New Setup Required)
```bash
# 1. Navigate to next-app
cd next-app

# 2. Install dependencies
npm install

# 3. Get free PostgreSQL database from https://neon.tech
# Copy connection string

# 4. Set up environment
cp .env.example .env
# Edit .env and add your DATABASE_URL

# 5. Initialize database
npm run db:push

# 6. Start development
npm run dev
```

### Daily Development

```bash
# Terminal 1 - Production app
npm run dev

# Terminal 2 - Next.js app
cd next-app && npm run dev
```

---

## 🛠️ Common Commands

### Production App (Root Directory)

```bash
# Development
npm run dev                    # Start Vite dev server (port 3000)
npm run build                  # Build for production
npm run preview                # Preview production build
npm run seed-locations         # Seed location data
```

### Next.js App (next-app Directory)

```bash
cd next-app

# Development
npm run dev                    # Start Next.js dev server (port 3001)
npm run build                  # Build for production
npm start                      # Start production server
npm run lint                   # Lint code

# Database
npm run db:push                # Push schema (quick, no migrations)
npm run db:migrate             # Create & run migrations (production)
npm run db:studio              # Open Prisma Studio GUI
npm run db:generate            # Generate Prisma client
```

---

## 📚 Documentation

### Production App
- Main README (if exists in root)
- Component documentation in `/components/`
- API documentation in `/services/`

### Next.js App
- **`/next-app/README.md`** - Comprehensive guide
- **`/next-app/INSTALLATION.md`** - Quick start
- **`/next-app/PHASE_1_VERIFICATION.md`** - Setup verification
- **`/NEXT_APP_SETUP.md`** - Detailed setup guide (root level)

---

## 🔍 How to Identify Which App You're Working On

### Check Current Directory

```bash
pwd
# If output ends with /next-app → You're in Next.js app
# If output is root directory → You're in Production app
```

### Check package.json

**Production App** (`/package.json`):
```json
{
  "name": "copy-of-copy-of-copy-of-copy-of-copy-of-coupon-management-system",
  "scripts": {
    "dev": "vite",
    ...
  }
}
```

**Next.js App** (`/next-app/package.json`):
```json
{
  "name": "kobonz-next",
  "scripts": {
    "dev": "next dev -p 3001",
    ...
  }
}
```

### Check Browser URL

- **http://localhost:3000** → Production Vite app
- **http://localhost:3001** → Next.js app

---

## 🐛 Troubleshooting

### Port Already in Use

**Production App (Port 3000)**:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Next.js App (Port 3001)**:
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Connection Error (Next.js Only)

1. Verify `.env` file exists in `/next-app/`
2. Check `DATABASE_URL` is correctly set
3. Ensure PostgreSQL database is accessible
4. Try: `cd next-app && npm run db:push`

### Module Not Found

**Production App**:
```bash
npm install  # From root
```

**Next.js App**:
```bash
cd next-app
npm install
```

---

## ✨ Benefits of This Setup

### 1. **Zero Risk**
- Production app remains untouched
- No breaking changes possible
- Safe experimentation

### 2. **Modern Stack**
- Explore Next.js features
- Use latest PostgreSQL
- Test new architectures

### 3. **Independent Development**
- Work on both apps simultaneously
- Different teams can work in parallel
- No merge conflicts

### 4. **Future Migration Path**
- Gradual feature migration
- A/B testing capabilities
- Smooth transition possible

---

## 🎯 When to Use Each App

### Use Production App When:
- Working with existing features
- Maintaining current functionality
- Debugging production issues
- Serving live users

### Use Next.js App When:
- Building new features (Phase 2+)
- Experimenting with new ideas
- Testing modern patterns
- Planning future architecture

---

## 📞 Need Help?

### Production App Issues
- Check root documentation
- Review Firebase console
- Check Vite configuration

### Next.js App Issues
- Read `/next-app/README.md`
- Check `/next-app/INSTALLATION.md`
- Review Prisma documentation
- Visit https://nextjs.org/docs

---

## ✅ Quick Checklist

Before starting work:

- [ ] Know which app you're working on
- [ ] Navigate to correct directory
- [ ] Use correct npm commands
- [ ] Check correct port in browser
- [ ] Verify correct database connection
- [ ] Don't mix concerns between apps

---

**Happy Development! 🚀**

Both apps are now ready to run independently.
