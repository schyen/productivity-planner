export interface Task {
  id: string;
  title: string;
  description?: string;
  project: string;
  urgency: 'low' | 'medium' | 'high';
  deadline?: string;
  type: string;
  categories: string[];
  createdAt: string;
  scheduledDate?: string;
}

export interface Project {
  id: string;
  name: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}