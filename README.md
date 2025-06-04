# Joblet - A Modern Job Board Application

![Joblet Logo](public/logo.png)

## Overview

Joblet is a modern job board application built with Next.js, Prisma, and Supabase. It allows companies to post job listings and users to browse and filter available positions. The application features a clean, responsive UI with authentication, job management, and search functionality.

## Live Demo

[View the live demo](https://joblet.vercel.app)

## Features

- **Authentication** - Secure user authentication using Supabase Auth
- **Job Posting** - Authenticated users can create job listings
- **Job Browsing** - Public page to browse all job listings with filtering options
- **Job Details** - Detailed view of individual job listings
- **User Dashboard** - Manage your posted jobs (view, edit, delete)
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Next.js API Routes with Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with shadcn/ui components
- **Deployment**: Vercel

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/joblet.git
   cd joblet
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   DATABASE_URL="postgres://[DB-USER].[PROJECT-REF]:[PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres"
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```text
/src
  /app                 # Next.js App Router
    /api               # API routes
    /dashboard         # User dashboard
    /jobs              # Job listings and details
    /signin            # Authentication pages
  /components          # Reusable UI components
  /lib                 # Utility functions and shared code
  /types               # TypeScript type definitions
/prisma                # Prisma schema and migrations
/public                # Static assets
```

## What Would I Improve With More Time?

1. **Advanced Search** - Implement full-text search for job listings
2. **Job Applications** - Allow users to apply for jobs directly through the platform
3. **Company Profiles** - Add dedicated company profile pages
4. **Email Notifications** - Send notifications for new job postings or applications
5. **Analytics Dashboard** - Provide insights for job posters about views and applications
6. **Testing** - Add comprehensive unit and integration tests

## Original Task Requirements

### Overview

Given 3 days time, build a simple "Mini Job Board" web application where companies can post jobs and users can browse them. Focus on clean code, usability, and fullstack functionality.

### Requirements

#### Core Features

- Authentication (Supabase Auth)
  - Users can sign up and log in.
- Post a Job
  - Authenticated users can create job posts with:
    - Title
    - Company name
    - Description
    - Location
    - Job type (Full-Time, Part-Time, Contract)
- Browse Jobs
  - Public page showing a list of job postings.
  - Filter by location or job type.
- Job Detail Page
  - View full details of a specific job.
- User Dashboard
  - View, edit, or delete jobs that the user posted.

### Tech Requirements

- Frontend: Next.js (use app router)
- Backend: Supabase (for database + auth)
- Deployment: Deploy to Vercel and share the link
- Styling: Use any CSS framework (Tailwind CSS is preferred)

### Deliverables

1. GitHub repo link with clear README (setup instructions, approach, and architecture overview) - make it public github project
2. Live deployed URL (on Vercel)
3. Include a brief "What would you improve if given more time?" section in the README

## Prisma Setup

### 1. Create a custom user for Prisma

- In the SQL Editor, create a Prisma DB user with full privileges on the public schema.
- This gives you better control over Prisma's access and makes it easier to monitor using Supabase tools like the Query Performance Dashboard and Log Explorer.

```sql
-- Create custom user
create user "prisma" with password 'custom_password' bypassrls createdb;

-- extend prisma's privileges to postgres (necessary to view changes in Dashboard)
grant "prisma" to "postgres";

-- Grant it necessary permissions over the relevant schemas (public)
grant usage on schema public to prisma;
grant create on schema public to prisma;
grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;
alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;
```

### 2. Create a Prisma Project

- Initialize Prisma:

  ```bash
  npx prisma init
  ```

- In your .env file, set the DATABASE_URL variable to your connection string:

  ```env
  DATABASE_URL="postgres://[DB-USER].[PROJECT-REF]:[PRISMA-PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres"
  ```

- Change your string's [DB-USER] to prisma and add the password you created in step 1:

  ```
  postgres://prisma.[PROJECT-REF]...
  ```

### 3. Create migrations

- Create new tables in your schema.prisma file:

  ```prisma
  model Post {
    id        Int     @id @default(autoincrement())
    title     String
    content   String?
    published Boolean @default(false)
    author    User?   @relation(fields: [authorId], references: [id])
    authorId  Int?
  }

  model User {
    id    Int     @id @default(autoincrement())
    email String  @unique
    name  String?
    posts Post[]
  }
  ```

- Run the migration:

  ```bash
  npx prisma migrate dev --name first_prisma_migration
  ```

### 4. Install prisma client

```bash
npm install @prisma/client
npx prisma generate
```

## Using Bun

Use Bun (https://bun.sh) instead of npm. Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.

- Pre-req: install bun locally
- Use bun instead of npm for all package.json commands
- Use bun.lock instead of package-lock.json
