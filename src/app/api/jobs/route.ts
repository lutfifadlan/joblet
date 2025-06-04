import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/jobs - Get all jobs with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const location = searchParams.get('location');
    const jobTypeParam = searchParams.get('jobType');

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Build filter conditions
    const where: Prisma.PostWhereInput = { published: true };
    if (location) where.location = location;
    if (jobTypeParam) where.jobType = jobTypeParam as Prisma.PostWhereInput['jobType'];

    // Query jobs with filters
    const [jobs, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      current_page: page,
      page_size: pageSize,
      total_count: totalCount,
      total_pages: Math.ceil(totalCount / pageSize),
    });
  } catch (error: unknown) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    
    // Validate required fields
    const { title, companyName, description, location, jobType } = body;
    
    if (!title || !companyName || !description || !location || !jobType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create job post
    const job = await prisma.post.create({
      data: {
        title,
        companyName,
        description,
        location,
        jobType,
        published: true,
        userId,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
