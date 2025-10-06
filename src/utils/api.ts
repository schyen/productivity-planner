import type { Task, Project, Category } from '../types';

declare global {
  interface Window {
    electronAPI: {
      getTasks: () => Promise<Task[]>;
      addTask: (task: Task) => Promise<Task>;
      updateTask: (task: Task) => Promise<Task>;
      deleteTask: (taskId: string) => Promise<string>;
      
      getProjects: () => Promise<Project[]>;
      addProject: (project: Project) => Promise<Project>;
      updateProject: (project: Project) => Promise<Project>;
      deleteProject: (projectId: string) => Promise<string>;
      
      getCategories: () => Promise<Category[]>;
      addCategory: (category: Category) => Promise<Category>;
      updateCategory: (category: Category) => Promise<Category>;
      deleteCategory: (categoryId: string) => Promise<string>;
    };
  }
}

export const api = {
  // Tasks
  getTasks: () => window.electronAPI.getTasks(),
  addTask: (task: Task) => window.electronAPI.addTask(task),
  updateTask: (task: Task) => window.electronAPI.updateTask(task),
  deleteTask: (taskId: string) => window.electronAPI.deleteTask(taskId),

  // Projects
  getProjects: () => window.electronAPI.getProjects(),
  addProject: (project: Project) => window.electronAPI.addProject(project),
  updateProject: (project: Project) => window.electronAPI.updateProject(project),
  deleteProject: (projectId: string) => window.electronAPI.deleteProject(projectId),

  // Categories
  getCategories: () => window.electronAPI.getCategories(),
  addCategory: (category: Category) => window.electronAPI.addCategory(category),
  updateCategory: (category: Category) => window.electronAPI.updateCategory(category),
  deleteCategory: (categoryId: string) => window.electronAPI.deleteCategory(categoryId),
};