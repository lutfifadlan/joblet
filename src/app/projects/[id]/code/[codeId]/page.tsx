'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// Using Next.js API routes directly instead of utility functions
import { Code, Project, CodeProgress } from '@/types/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
// Import our enhanced code typing experience component
import CodeTypingExperience from '@/components/code-editor/CodeTypingExperience';

export default function CodeDetail() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const codeId = params.codeId as string;
  
  const [code, setCode] = useState<Code | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [progress, setProgress] = useState<CodeProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch code and progress details
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch code details using Next.js API route
        const codeResponse = await fetch(`/api/code/${codeId}`);
        if (!codeResponse.ok) {
          throw new Error('Failed to fetch code');
        }
        const codeData = await codeResponse.json();
        setCode(codeData);
        
        // Fetch project details using Next.js API route
        const projectResponse = await fetch(`/api/projects/${projectId}`);
        if (!projectResponse.ok) {
          throw new Error('Failed to fetch project');
        }
        const projectData = await projectResponse.json();
        setProject(projectData);
        
        // Fetch code progress using Next.js API route
        try {
          const progressResponse = await fetch(`/api/code/${codeId}/progress`);
          if (!progressResponse.ok) {
            throw new Error('No progress found');
          }
          const progressData = await progressResponse.json();
          setProgress(progressData);
        } catch {
          console.log('No progress found for this code');
        }
      } catch (err) {
        setError('Failed to load code. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [codeId, projectId]);

  // Navigate to the next code file
  const handleNextCode = () => {
    if (!project || !code) return;
    
    const codeIds = project.code_ids;
    const currentIndex = codeIds.indexOf(codeId);
    
    if (currentIndex < codeIds.length - 1) {
      const nextCodeId = codeIds[currentIndex + 1];
      router.push(`/projects/${projectId}/code/${nextCodeId}`);
    } else {
      // If this is the last code file, go back to the project page
      router.push(`/projects/${projectId}`);
    }
  };
  
  // Navigate to the previous code file
  const handlePreviousCode = () => {
    if (!project || !code) return;
    
    const codeIds = project.code_ids;
    const currentIndex = codeIds.indexOf(codeId);
    
    if (currentIndex > 0) {
      const prevCodeId = codeIds[currentIndex - 1];
      router.push(`/projects/${projectId}/code/${prevCodeId}`);
    } else {
      // If this is the first code file, go back to the project page
      router.push(`/projects/${projectId}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error || !code || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-red-500">
          {error || 'Code not found'}
        </div>
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
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
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold">{code?.file_name}</h1>
          <p className="text-muted-foreground mt-1">
            {code?.description || 'No description available'}
          </p>
        </div>
      </div>
      
      {code && project && (
        <CodeTypingExperience
          code={{
            id: codeId,
            content: code.content,
            file_name: code.file_name,
            description: code.description,
            language: code.file_name.split('.').pop() || 'js'
          }}
          project={{
            id: projectId,
            code_ids: project.code_ids
          }}
          progress={progress ? {
            current_token_index: progress.current_token_index,
            is_completed: progress.is_completed
          } : undefined}
          onNavigatePrevious={handlePreviousCode}
          onNavigateNext={handleNextCode}
        />
      )}
    </div>
  );
}
