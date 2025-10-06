import React, { useState, useEffect } from 'react';
import type { Task, Project, Category } from '../types';
import { api } from '../utils/api';
import { AppContext } from './AppContextType';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = async () => {
    try {
      const tasks = await api.getTasks();
      setTasks(tasks);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const refreshProjects = async () => {
    try {
      const projects = await api.getProjects();
      setProjects(projects);
    } catch (err) {
      setError('Failed to fetch projects');
    }
  };

  const refreshCategories = async () => {
    try {
      const categories = await api.getCategories();
      setCategories(categories);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          refreshTasks(),
          refreshProjects(),
          refreshCategories()
        ]);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = await api.addTask({
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      });
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const updatedTask = await api.updateTask(task);
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const newProject = await api.addProject({
        ...projectData,
        id: crypto.randomUUID()
      });
      setProjects(prev => [...prev, newProject]);
    } catch (err) {
      setError('Failed to add project');
    }
  };

  const updateProject = async (project: Project) => {
    try {
      const updatedProject = await api.updateProject(project);
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
    } catch (err) {
      setError('Failed to update project');
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const newCategory = await api.addCategory({
        ...categoryData,
        id: crypto.randomUUID()
      });
      setCategories(prev => [...prev, newCategory]);
    } catch (err) {
      setError('Failed to add category');
    }
  };

  const updateCategory = async (category: Category) => {
    try {
      const updatedCategory = await api.updateCategory(category);
      setCategories(prev => prev.map(c => c.id === category.id ? updatedCategory : c));
    } catch (err) {
      setError('Failed to update category');
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await api.deleteCategory(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  return (
    <AppContext.Provider value={{
      tasks,
      projects,
      categories,
      loading,
      error,
      refreshTasks,
      refreshProjects,
      refreshCategories,
      addTask,
      updateTask,
      deleteTask,
      addProject,
      updateProject,
      deleteProject,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};