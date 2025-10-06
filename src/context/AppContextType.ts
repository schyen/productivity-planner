import { createContext } from 'react';
import type { Task, Project, Category } from '../types';

export interface AppContextType {
  tasks: Task[];
  projects: Project[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);