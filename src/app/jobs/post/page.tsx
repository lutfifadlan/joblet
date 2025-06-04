'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccessToast, showWarningToast, showErrorToast } from "@/lib/toast";;
import { AuthGuard } from '@/components/auth-guard';
import Loading from '@/components/loading-component';

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    location: '',
    jobType: ''
  });

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
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      const job = await response.json();
      
      showSuccessToast("Your job has been posted successfully");
      
      // Redirect to the job detail page
      router.push(`/jobs/${job.id}`);
    } catch (error) {
      console.error('Error posting job:', error);
      showErrorToast("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Job</CardTitle>
          <CardDescription>
            Fill out the form below to create a new job listing
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
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select job type"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME" className="cursor-pointer">Full-Time</SelectItem>
                  <SelectItem value="PART_TIME" className="cursor-pointer">Part-Time</SelectItem>
                  <SelectItem value="CONTRACT" className="cursor-pointer">Contract</SelectItem>
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
                rows={48}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full cursor-pointer mt-4" disabled={loading}>
              {loading ? (
                <Loading size="xs" message='Posting...' />
              ) : (
                'Post Job'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    </AuthGuard>
  );
}
