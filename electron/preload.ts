import { contextBridge, ipcRenderer } from 'electron';
import { Task, Project, Category } from '../src/types';

export const API = {
  // Tasks
  getTasks: () => ipcRenderer.invoke('getTasks'),
  addTask: (task: Task) => ipcRenderer.invoke('addTask', task),
  updateTask: (task: Task) => ipcRenderer.invoke('updateTask', task),
  deleteTask: (taskId: string) => ipcRenderer.invoke('deleteTask', taskId),
  
  // Projects
  getProjects: () => ipcRenderer.invoke('getProjects'),
  addProject: (project: Project) => ipcRenderer.invoke('addProject', project),
  updateProject: (project: Project) => ipcRenderer.invoke('updateProject', project),
  deleteProject: (projectId: string) => ipcRenderer.invoke('deleteProject', projectId),
  
  // Categories
  getCategories: () => ipcRenderer.invoke('getCategories'),
  addCategory: (category: Category) => ipcRenderer.invoke('addCategory', category),
  updateCategory: (category: Category) => ipcRenderer.invoke('updateCategory', category),
  deleteCategory: (categoryId: string) => ipcRenderer.invoke('deleteCategory', categoryId),
};

contextBridge.exposeInMainWorld('electronAPI', API);