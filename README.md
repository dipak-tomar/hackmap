# HackMap - Hackathon Management Platform

A modern, full-stack hackathon management platform built with Next.js 15, featuring team management, project tracking, real-time notifications, and comprehensive user authentication.

## 🚀 Features

- **User Authentication**: Secure authentication with NextAuth.js
- **Hackathon Management**: Create, organize, and manage hackathons
- **Team Formation**: Join teams, manage team members, and invite codes
- **Project Tracking**: Submit and track hackathon projects
- **Real-time Notifications**: Stay updated with team activities and deadlines
- **User Profiles**: Customizable user profiles with skills and bio
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI components
- **Database Management**: PostgreSQL with Prisma ORM

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Theming**: next-themes for dark/light mode

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Prisma adapter
- **Email**: Nodemailer for notifications
- **Validation**: Zod for schema validation

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm/pnpm
- **Database Migrations**: Prisma Migrate
- **Deployment**: Vercel-optimized

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **PostgreSQL** database (local or cloud)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hackmap
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hackmap?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Email configuration
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"
```

#### Environment Variable Details

- **DATABASE_URL**: PostgreSQL connection string
- **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
- **NEXTAUTH_URL**: Your application URL (for production)
- **SMTP_*** variables**: For email notifications (optional)

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
hackmap/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── hackathons/        # Hackathon management
│   ├── notifications/     # Notifications page
│   ├── projects/          # Project management
│   ├── teams/             # Team management
│   └── profile/           # User profiles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── public/               # Static assets
├── styles/               # Global styles
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts with authentication
- **Hackathons**: Hackathon events and details
- **Teams**: Team formation and management
- **Projects**: Project submissions and tracking
- **Notifications**: Real-time user notifications
- **Comments & Endorsements**: Project interactions

### Key Models

```prisma
model User {
  id       String @id @default(cuid())
  name     String?
  email    String @unique
  bio      String?
  skills   String @default("[]")
  // ... authentication fields
}

model Hackathon {
  id                   String   @id @default(cuid())
  title                String
  description          String
  startDate            DateTime
  endDate              DateTime
  registrationDeadline DateTime
  // ... other fields
}

model Team {
  id          String @id @default(cuid())
  name        String
  description String
  inviteCode  String @unique
  // ... relationships
}
```

## 🎯 Core Features

### Authentication
- Email/password authentication
- Secure session management
- Protected routes and API endpoints

### Hackathon Management
- Create and organize hackathons
- Set registration deadlines
- Manage participants and teams

### Team Formation
- Create teams with invite codes
- Join existing teams
- Team member management
- Leader permissions

### Project Tracking
- Submit project details
- Track project progress
- Comment and endorse projects
- Tech stack documentation

### Notifications System
- Real-time notifications
- Email notifications (optional)
- Notification preferences
- Team activity updates

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```
   DATABASE_URL=your_postgresql_url
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```
3. **Deploy**: Vercel will automatically build and deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Database Migration for Production

```bash
# Deploy migrations to production database
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Commands

```bash
npx prisma studio              # Open Prisma Studio
npx prisma migrate dev         # Create and apply migration
npx prisma migrate reset       # Reset database
npx prisma db seed            # Seed database
npx prisma generate           # Generate Prisma client
```

### Adding New Features

1. **Database changes**: Update `prisma/schema.prisma`
2. **API routes**: Add to `app/api/`
3. **UI components**: Add to `components/`
4. **Pages**: Add to `app/`

## 🧪 Testing

### Health Checks

The application includes health check endpoints:

- **Database**: `GET /api/health/db`
- **General**: `GET /api/health`

### Manual Testing

1. Create user accounts
2. Create test hackathons
3. Form teams and join hackathons
4. Submit projects
5. Test notification system

## 🔐 Security Features

- **Authentication**: Secure session-based auth
- **Authorization**: Role-based access control
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM
- **CSRF Protection**: NextAuth.js built-in protection

## 📚 API Documentation

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User sign out

### Hackathons
- `GET /api/hackathons` - List hackathons
- `POST /api/hackathons` - Create hackathon
- `GET /api/hackathons/[id]` - Get hackathon details

### Teams
- `GET /api/teams` - List user teams
- `POST /api/teams` - Create team
- `POST /api/teams/join` - Join team with invite code

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/[id]/read` - Mark as read

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the [deployment guide](DEPLOYMENT.md)
2. Review error messages in browser console
3. Check database connectivity with `/api/health/db`
4. Verify environment variables are set correctly

## 🔄 Updates

To update dependencies:

```bash
npm update
npx prisma generate  # Regenerate Prisma client if needed
```

---

Built with ❤️ for the hackathon community 