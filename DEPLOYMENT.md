# Deployment Guide for HackMap

## Vercel Deployment

### Required Environment Variables

Set these environment variables in your Vercel dashboard:

```bash
# Database
DATABASE_URL=your_postgresql_connection_string

# NextAuth.js
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=https://your-domain.vercel.app

# Optional: File Upload (if using local storage)
UPLOAD_DIR=/tmp/uploads
```

### Environment Variable Setup

1. **DATABASE_URL**: Your PostgreSQL connection string from Neon, Supabase, or other provider
   ```
   postgresql://username:password@host:port/database?sslmode=require
   ```

2. **NEXTAUTH_SECRET**: Generate a random secret:
   ```bash
   openssl rand -base64 32
   ```

3. **NEXTAUTH_URL**: Your production domain
   ```
   https://your-app-name.vercel.app
   ```

### Database Setup

1. **Run Prisma migrations** on your production database:
   ```bash
   npx prisma migrate deploy
   ```

2. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

3. **Seed the database** (optional):
   ```bash
   npx prisma db seed
   ```

### Build Configuration

The app is configured to handle build-time issues automatically:

- ✅ Database connections are skipped during build
- ✅ Environment variables are validated at runtime
- ✅ Graceful fallbacks for missing configurations
- ✅ Health check endpoints for monitoring
- ✅ Prisma client generation in build process
- ✅ Serverless-optimized binary targets

### Vercel Configuration

The project includes a `vercel.json` file with optimized settings:

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "pnpm install && prisma generate",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Package.json Scripts

The build process includes Prisma generation:

```json
{
  "scripts": {
    "build": "npx prisma generate && next build",
    "postinstall": "npx prisma generate"
  }
}
```

### Alternative Build Methods

If you encounter issues with the default build process, try these alternatives:

1. **Use the build script**: Set build command to `./scripts/build.sh`
2. **Manual Vercel configuration**: Add custom build commands in `vercel.json`
3. **Environment-specific builds**: Different commands for different environments

### Dependency Configuration

Ensure Prisma is properly configured:

```json
{
  "dependencies": {
    "@prisma/client": "latest"
  },
  "devDependencies": {
    "prisma": "latest"
  }
}
```

### Troubleshooting

#### Build Errors

If you encounter build errors:

1. **Check environment variables** are set in Vercel dashboard
2. **Verify DATABASE_URL** format is correct
3. **Ensure NEXTAUTH_SECRET** is set

#### Database Connection Issues

- The app includes automatic retry logic for connection timeouts
- Health check available at `/api/health/db`
- Connection monitoring in production

#### Common Issues

1. **"Failed to collect page data"**
   - Usually caused by missing environment variables
   - Check Vercel environment variable settings

2. **"Cannot find module '.prisma/client/default'"**
   - Prisma client not generated during build
   - Fixed by adding `npx prisma generate` to build scripts
   - Ensure Prisma is in devDependencies

3. **"prisma: command not found"**
   - Prisma CLI not available during build
   - Fixed by using `npx prisma generate` instead of `prisma generate`
   - Alternative: Use the provided build script `scripts/build.sh`

4. **Database connection timeout**
   - App automatically retries failed connections
   - Check database provider status

5. **NextAuth errors**
   - Verify NEXTAUTH_URL matches your domain
   - Ensure NEXTAUTH_SECRET is set

6. **Build fails on Vercel**
   - Check that all environment variables are set
   - Verify DATABASE_URL format is correct
   - Ensure Prisma schema is valid

### Monitoring

- **Health Check**: `GET /api/health/db`
- **Database Status**: Automatic connection monitoring
- **Error Handling**: User-friendly error messages

### Performance

The app includes several optimizations:

- Connection pooling with optimized settings
- Automatic connection cleanup
- Retry logic for failed operations
- Graceful error handling

### Post-Deployment

After successful deployment:

1. Visit `/api/health/db` to verify database connection
2. Test user registration and authentication
3. Create test hackathons and teams
4. Verify all features work correctly

### Support

If you encounter issues:

1. Check Vercel build logs
2. Monitor database connection status
3. Use the health check endpoint
4. Review error messages in the console 