'use client';

import { useState, useEffect, useCallback } from 'react';
import { Post } from '@prisma/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, Trash2, Eye, MapPin } from 'lucide-react';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const JobManagement = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const pageSize = 10;

  // Fetch user's jobs
  const loadJobs = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/jobs/user?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.jobs);
      setCurrentPage(data.current_page);
      setTotalPages(Math.ceil(data.total_count / data.page_size));
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Load jobs on initial render and when page changes
  useEffect(() => {
    loadJobs(currentPage);
  }, [currentPage, loadJobs]);

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      const response = await fetch(`/api/jobs/${jobToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      
      // Remove the deleted job from the list
      setJobs(jobs.filter(job => job.id !== jobToDelete));
      
      toast.info("Job deleted successfully", { duration: 3000 });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error("Failed to delete job", { duration: 3000 });
    } finally {
      setJobToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Navigate to job edit page
  const handleEditJob = (jobId: string) => {
    router.push(`/jobs/edit/${jobId}`);
  };

  // Navigate to job detail page
  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  // Render job card
  const renderJobCard = (job: Post) => (
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
        <p className="line-clamp-2 text-sm">
          {job.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          Posted: {formatDate(job.createdAt.toString())}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewJob(job.id)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEditJob(job.id)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => openDeleteDialog(job.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Job Listings</h2>
        <Button onClick={() => router.push('/jobs/post')}>Post a New Job</Button>
      </div>

      {/* Jobs grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          You haven&apos;t posted any jobs yet. Click &quot;Post a New Job&quot; to get started.
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJob} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
