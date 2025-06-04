export type JobStatus = 'pending' | 'processing' | 'failed' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  last_login?: string;
  last_logout?: string;
  created_at: string;
  updated_at: string;
}

export interface CodeProgress {
  id: string;
  user_id: string;
  code_id: string;
  project_id: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  completed_at: string;
  current_token_index: number;
  current_token: string;
  max_token_count: number;
  is_completed: boolean;
  project_progress_id: string;
}

export interface Project {
  id: string;
  user_id?: string;
  name?: string;
  description?: string;
  programming_language?: string;
  source: string;
  job_status?: JobStatus;
  code_ids: string[];
  files_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectProgress {
  id: string;
  user_id: string;
  project_id: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  completed_at: string;
  is_completed: boolean;
  code_progress_ids: string[];
}

export interface Code {
  id: string;
  file_name: string;
  content: string;
  description: string;
  project_id: string;
  order: number;
  number_of_lines: number;
  number_of_chars: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total_count: number;
  current_page: number;
  page_size: number;
}

export interface SearchRequest {
  query: string;
  programming_language?: string;
  page: number;
  page_size: number;
}
