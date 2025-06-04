'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// Using Next.js API routes directly instead of utility functions
import { Project, Code, ProjectProgress } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Code as CodeIcon, Play } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [codes, setCodes] = useState<Code[]>([]);
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch project details
  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch project data using Next.js API route
        const projectResponse = await fetch(`/api/projects/${projectId}`);
        if (!projectResponse.ok) {
          throw new Error('Failed to fetch project');
        }
        const projectData = await projectResponse.json();
        setProject(projectData);
        
        // Fetch codes for this project using Next.js API route
        const codesResponse = await fetch(`/api/projects/${projectId}/code`);
        if (!codesResponse.ok) {
          throw new Error('Failed to fetch codes');
        }
        const codesData = await codesResponse.json();
        setCodes(codesData);
        
        // Try to get existing progress using Next.js API route
        try {
          const progressResponse = await fetch(`/api/projects/${projectId}/progress`);
          if (!progressResponse.ok) {
            throw new Error('No progress found');
          }
          const progressData = await progressResponse.json();
          setProgress(progressData);
        } catch {
          // No progress yet, that's okay
          console.log('No progress found for this project');
        }
      } catch (err) {
        setError('Failed to load project. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      loadProject();
    }
  }, [projectId]);
  
  // Start or continue project
  const handleStartProject = async () => {
    try {
      // Call the Next.js API route
      const response = await fetch(`/api/projects/${projectId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project progress');
      }
      
      const progressData = await response.json();
      setProgress(progressData);
      
      // Navigate to the first code file
      if (codes.length > 0) {
        router.push(`/projects/${projectId}/code/${codes[0].id}`);
      }
    } catch (err) {
      setError('Failed to start project. Please try again.');
      console.error(err);
    }
  };
  
  // Continue project from where left off
  const handleContinueProject = () => {
    // If we have progress data, check if the project is completed
    // Otherwise, just start with the first code file
    const nextCode = progress?.is_completed ? codes[codes.length - 1] : codes[0];
    
    if (nextCode) {
      router.push(`/projects/${projectId}/code/${nextCode.id}`);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-red-500">
          {error || 'Project not found'}
        </div>
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name || 'Unnamed Project'}</h1>
            <p className="text-muted-foreground mt-1">
              Created: {formatDate(project.created_at)}
            </p>
          </div>
          
          <div className="flex gap-2">
            {progress ? (
              <Button onClick={handleContinueProject} className="flex items-center">
                <Play className="mr-2 h-4 w-4" />
                Continue Project
              </Button>
            ) : (
              <Button onClick={handleStartProject} className="flex items-center">
                <Play className="mr-2 h-4 w-4" />
                Start Project
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {progress && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{progress.progress_percentage}%</span>
              </div>
              <Progress value={progress.progress_percentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files ({codes.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About this Project</CardTitle>
              {project.programming_language && (
                <Badge variant="outline">{project.programming_language}</Badge>
              )}
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {project.description || 'No description available for this project.'}
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <CodeIcon className="mr-1 h-4 w-4" />
                <span>{project.files_count} {project.files_count === 1 ? 'file' : 'files'}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files" className="space-y-4">
          {codes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No files available for this project.
            </div>
          ) : (
            <div className="grid gap-4">
              {codes.map((code) => (
                <Card key={code.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{code.file_name}</CardTitle>
                    <CardDescription>
                      {code.number_of_lines} lines • {code.number_of_chars} characters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {code.description || 'No description available'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/projects/${projectId}/code/${code.id}`)}
                    >
                      <CodeIcon className="mr-2 h-4 w-4" />
                      View Code
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
