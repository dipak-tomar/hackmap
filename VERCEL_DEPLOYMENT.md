# Quick Vercel Deployment Guide

## Option 1: Default Build (Recommended)

Use the default package.json scripts:

```json
{
  "scripts": {
    "build": "npx prisma generate && next build",
    "postinstall": "npx prisma generate"
  }
}
```

**Vercel Settings:**
- Build Command: (leave empty to use package.json)
- Install Command: (leave empty to use package.json)

## Option 2: Custom Build Script

If Option 1 fails, use the custom build script:

**Vercel Settings:**
- Build Command: `./scripts/build.sh`
- Install Command: `pnpm install`

## Option 3: Manual Commands

If both above fail, set custom commands:

**Vercel Settings:**
- Build Command: `npx prisma generate && npx next build`
- Install Command: `pnpm install && npx prisma generate`

## Required Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
```

## Troubleshooting

- **"prisma: command not found"** → Use Option 1 or 2
- **"Cannot find module '.prisma/client'"** → Ensure Prisma is in devDependencies
- **Build timeout** → Check database connection and environment variables

## Verification

After deployment:
1. Visit `/api/health/db` to check database connection
2. Test user registration at `/auth/signup`
3. Verify all features work correctly 