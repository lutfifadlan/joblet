'use client';

import { useState, useEffect, useCallback } from 'react';
import { Job, JobsResponse } from '@/types/job';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useRouter } from 'next/navigation';
import { MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Loading from '@/components/loading-component';
import CustomBackground from '@/components/custom-ui/backgrounds/custom';

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Fetch jobs with filters
  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      if (locationFilter) params.append('location', locationFilter);
      if (jobTypeFilter) params.append('jobType', jobTypeFilter);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data: JobsResponse = await response.json();
      setJobs(data.jobs);
      setCurrentPage(data.current_page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [locationFilter, jobTypeFilter, pageSize]);

  // Apply filters
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchJobs(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setLocationFilter('');
    setJobTypeFilter('');
    setCurrentPage(1);
    fetchJobs(1);
  };

  // Load jobs on initial render and when page changes
  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, fetchJobs]);

  // Navigate to job detail
  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render job card
  const renderJobCard = (job: Job) => (
    <Card key={job.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="mt-1 font-medium">
              {job.companyName}
            </CardDescription>
          </div>
          <Badge variant={
            job.jobType === 'FULL_TIME' ? 'default' :
            job.jobType === 'PART_TIME' ? 'secondary' : 'outline'
          }>
            {job.jobType.replace('_', '-')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <p className="line-clamp-3 text-sm">
          {job.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          Posted: {formatDate(job.createdAt)}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleJobClick(job.id)}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          View Job
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <>
      <CustomBackground type="dot" />
      <div className="relative container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <Link href="/jobs/post">
            <Button>Post a Job</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-background border rounded-lg">
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="FULL_TIME">Full-Time</SelectItem>
              <SelectItem value="PART_TIME">Part-Time</SelectItem>
              <SelectItem value="CONTRACT">Contract</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={handleResetFilters}>Reset</Button>
        </div>

        {/* Jobs grid */}
        {loading ? (
          <div className="py-12">
            <Loading message="Loading jobs..." size="medium" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No jobs found. Try different filters or check back later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(renderJobCard)}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }} 
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }} 
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </>
  );
}
