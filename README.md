# Task Manager

A full-stack task management system built with Node.js, Express, Next.js, and PostgreSQL.

## Tech Stack

**Backend**

- Node.js + Express + TypeScript
- PostgreSQL (Neon) + Prisma ORM
- JWT Authentication (Access + Refresh tokens)
- Zod validation

**Frontend**

- Next.js 16 (App Router) + TypeScript
- TanStack Query + Zustand
- shadcn/ui + Tailwind CSS
- React Hook Form + Zod

## Project Structure

```
task-manager/
├── apps/
│   ├── api/          ← Express backend
│   └── web/          ← Next.js frontend
└── packages/         ← Shared workspace
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Setup

```bash
# Clone the repository
git clone https://github.com/vinaybhamre/task-manager.git
cd task-manager

# Install dependencies
pnpm install
```

### Backend Setup

```bash
cd apps/api

# Copy environment variables
cp .env.example .env
# Fill in your values in .env

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

### Frontend Setup

```bash
cd apps/web

# Copy environment variables
cp .env.example .env.local
# Add NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Start development server
pnpm dev
```

### Run Both Together

```bash
# From root
pnpm dev
```

## Environment Variables

### Backend (`apps/api/.env`)

```bash
DATABASE_URL=""
JWT_ACCESS_SECRET=""
JWT_REFRESH_SECRET=""
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

## API Endpoints

### Auth

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Tasks

```
GET    /api/v1/tasks              # List with pagination, filtering, search
POST   /api/v1/tasks              # Create task
GET    /api/v1/tasks/:id          # Get task by ID
PATCH  /api/v1/tasks/:id          # Update task
DELETE /api/v1/tasks/:id          # Delete task
PATCH  /api/v1/tasks/:id/toggle   # Toggle task status
```

## Features

- JWT authentication with access and refresh tokens
- Refresh token stored in httpOnly cookie + database for true logout
- Task CRUD with pagination, filtering by status, and search by title
- Responsive design — works on desktop and mobile
- Form validation on both frontend and backend
- Toast notifications for user feedback
- Route protection with Next.js middleware

## Demo Credentials

```
Email:    johndoe@gmail.com
Password: Test@1234
```

## Demo

- Frontend: https://task-manager-web-beige.vercel.app
- Backend: https://task-manager-api-75de.onrender.com/health
