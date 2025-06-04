'use client';

import { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Building, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Loading from '@/components/loading';
import { useParams } from 'next/navigation';

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Job not found');
          }
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loading message="Loading job details..." fullscreen={true} size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p>{error}</p>
          <Link href="/jobs" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p>The job you&apos;re looking for doesn&apos; exist or has been removed.</p>
          <Link href="/jobs" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <CardTitle className="text-3xl">{job.title}</CardTitle>
                  <CardDescription className="mt-2 text-lg font-medium">
                    {job.companyName}
                  </CardDescription>
                </div>
                <Badge className="w-fit" variant={
                  job.jobType === 'FULL_TIME' ? 'default' :
                  job.jobType === 'PART_TIME' ? 'secondary' : 'outline'
                }>
                  {job.jobType.replace('_', '-')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Job Description</h3>
                  <div className="prose max-w-none">
                    {/* Render description with line breaks */}
                    {job.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Building className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Company</h4>
                    <p>{job.companyName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p>{job.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Posted On</h4>
                    <p>{formatDate(job.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply for this Job</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
