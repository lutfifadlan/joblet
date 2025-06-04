'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccessToast, showWarningToast, showErrorToast } from "@/lib/toast";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@prisma/client';
import { AuthGuard } from '@/components/auth-guard';
import Loading from '@/components/loading-component';
import { useParams } from 'next/navigation';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    location: '',
    jobType: ''
  });

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      setFetchLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Job not found');
          }
          throw new Error('Failed to fetch job details');
        }
        const job: Post = await response.json();
        
        // Set form data from job
        setFormData({
          title: job.title,
          companyName: job.companyName,
          description: job.description,
          location: job.location,
          jobType: job.jobType
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.companyName || !formData.description || !formData.location || !formData.jobType) {
      showWarningToast("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update job');
      }

      const job = await response.json();
      
      showSuccessToast("Your job has been updated successfully");
      
      // Redirect to the job detail page
      router.push(`/jobs/${job.id}`);
    } catch (error) {
      console.error('Error updating job:', error);
      showErrorToast("Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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
          <Link href="/dashboard" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Job</CardTitle>
          <CardDescription>
            Update your job listing details
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Frontend Developer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="e.g. Acme Inc."
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. San Francisco, CA or Remote"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select
                value={formData.jobType}
                onValueChange={(value) => handleSelectChange('jobType', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full-Time</SelectItem>
                  <SelectItem value="PART_TIME">Part-Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the job responsibilities, requirements, and benefits..."
                value={formData.description}
                onChange={handleChange}
                rows={8}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loading size="small" />
                  <span className="ml-2">Updating...</span>
                </>
              ) : (
                'Update Job'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    </AuthGuard>
  );
}
