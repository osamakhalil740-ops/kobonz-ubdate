# Kobonz Next - Isolated Next.js Platform

> **🔒 IMPORTANT**: This is a completely isolated Next.js application running alongside the existing Vite/React production app. It has **ZERO** impact on the production system.

## Overview

This Next.js application is built as a parallel platform to explore modern features and architecture patterns without touching the existing production codebase.

### Key Isolation Features

- ✅ **Separate Port**: Runs on port `3001` (Vite app uses `3000`)
- ✅ **Separate Database**: PostgreSQL/Neon (Vite app uses Firebase/Firestore)
- ✅ **Separate Directory**: Lives in `/next-app` (Vite app at root)
- ✅ **No Shared Dependencies**: Independent `package.json` and `node_modules`
- ✅ **No Shared Code**: Complete code isolation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon recommended)
- **Validation**: Zod

## Database Schema

### Core Models

1. **User** - User accounts with role-based access control
2. **Store** - Shop/business information
3. **Category** - Hierarchical categorization
4. **Location** - Geographic hierarchy (Country → State → City → District)
5. **Coupon** - Discount coupons with targeting
6. **Redemption** - Coupon usage tracking
7. **AffiliateLink** - Affiliate tracking system
8. **CreditLog** - Credit transaction history
9. **CreditRequest** - Credit purchase requests
10. **CreditKey** - Activation key system

### Role System

- `SUPER_ADMIN` - Full system access
- `ADMIN` - Administrative functions
- `STORE_OWNER` - Manage stores and coupons
- `AFFILIATE` - Create affiliate links
- `MARKETER` - Marketing and analytics
- `USER` - Browse and redeem coupons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon.tech recommended for easy setup)

### Installation

```bash
cd next-app
npm install
```

### Database Setup

1. **Create a PostgreSQL database** (Recommended: [Neon.tech](https://neon.tech) - free tier available)

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` and add your database URL**:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
   ```

4. **Push the schema to your database**:
   ```bash
   npm run db:push
   ```

   Or use migrations:
   ```bash
   npm run db:migrate
   ```

5. **Optional: Open Prisma Studio** to view/edit data:
   ```bash
   npm run db:studio
   ```

### Running the Application

```bash
npm run dev
```

The app will be available at: **http://localhost:3001**

## Running Both Apps Simultaneously

You can run both the Vite app and Next.js app at the same time:

**Terminal 1** (Root directory - Vite app):
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2** (next-app directory - Next.js app):
```bash
cd next-app
npm run dev
# Runs on http://localhost:3001
```

Both apps will run independently with zero conflicts.

## Project Structure

```
next-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and helpers
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Utility functions
│   ├── types.ts          # TypeScript types
│   └── constants.ts      # App constants
├── prisma/               # Database
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── .env.example          # Environment template
├── next.config.js        # Next.js config
├── tailwind.config.ts    # Tailwind config
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (port 3001) |
| `npm run build` | Build for production |
| `npm start` | Start production server (port 3001) |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database (no migrations) |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:studio` | Open Prisma Studio |

## Database Commands

### Quick Development (No Migrations)
```bash
npm run db:push
```
Use this for rapid prototyping. Pushes schema changes directly to the database.

### Production (With Migrations)
```bash
npm run db:migrate
```
Creates migration files for version control and applies them to the database.

### View/Edit Data
```bash
npm run db:studio
```
Opens Prisma Studio in your browser for easy data management.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Required
DATABASE_URL="postgresql://..."

# Optional
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NODE_ENV="development"
```

## Adding shadcn/ui Components

This project is configured for shadcn/ui. To add components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
# etc.
```

Components will be added to `components/ui/`.

## Development Guidelines

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma`
2. **Run Migration**: `npm run db:push` or `npm run db:migrate`
3. **Generate Types**: Types are auto-generated by Prisma
4. **Create API Routes**: Add to `app/api/...`
5. **Build UI**: Use components from `components/ui/`

### Type Safety

This project uses strict TypeScript. All Prisma types are automatically generated:

```typescript
import { User, Coupon } from '@prisma/client'
import { CouponWithRelations } from '@/lib/types'
```

### Code Quality

- ✅ Strict TypeScript enabled
- ✅ ESLint configured
- ✅ Unused variables/parameters not allowed
- ✅ Implicit returns not allowed

## Safety & Isolation

### What This App DOES

- ✅ Runs independently on port 3001
- ✅ Uses its own PostgreSQL database
- ✅ Has its own dependencies and configs
- ✅ Can be developed without affecting production

### What This App DOES NOT Do

- ❌ Touch the existing Vite app files
- ❌ Share Firebase/Firestore data
- ❌ Interfere with production routes
- ❌ Share authentication state
- ❌ Use port 3000

## Future Integration (Optional)

If you want to integrate this with the existing app in the future:

1. **API Gateway**: Use a reverse proxy to route specific paths
2. **Shared Authentication**: Implement SSO or shared session
3. **Data Sync**: Create sync jobs between Firebase and PostgreSQL
4. **Gradual Migration**: Move features one at a time

## Support

This is an isolated development platform. For production app issues, refer to the root project documentation.

## License

Same as parent project.
