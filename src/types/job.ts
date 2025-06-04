import { JobType } from '@prisma/client';

export interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  jobType: JobType;
  published: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string | null;
    email: string;
  };
}

export interface JobsResponse {
  jobs: Job[];
  current_page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}
