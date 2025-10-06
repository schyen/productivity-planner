import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import store from './store';
import { Task, Project, Category } from '../src/types';

// IPC Handlers setup
function setupIpcHandlers() {
  // Tasks
  ipcMain.handle('getTasks', () => store.get('tasks'));
  ipcMain.handle('addTask', (_, task: Task) => {
    const tasks = store.get('tasks', []);
    store.set('tasks', [...tasks, task]);
    return task;
  });
  ipcMain.handle('updateTask', (_, task: Task) => {
    const tasks = store.get('tasks', []);
    const updatedTasks = tasks.map((t: Task) => t.id === task.id ? task : t);
    store.set('tasks', updatedTasks);
    return task;
  });
  ipcMain.handle('deleteTask', (_, taskId: string) => {
    const tasks = store.get('tasks', []);
    store.set('tasks', tasks.filter((t: Task) => t.id !== taskId));
    return taskId;
  });

  // Projects
  ipcMain.handle('getProjects', () => store.get('projects'));
  ipcMain.handle('addProject', (_, project: Project) => {
    const projects = store.get('projects', []);
    store.set('projects', [...projects, project]);
    return project;
  });
  ipcMain.handle('updateProject', (_, project: Project) => {
    const projects = store.get('projects', []);
    const updatedProjects = projects.map((p: Project) => p.id === project.id ? project : p);
    store.set('projects', updatedProjects);
    return project;
  });
  ipcMain.handle('deleteProject', (_, projectId: string) => {
    const projects = store.get('projects', []);
    store.set('projects', projects.filter((p: Project) => p.id !== projectId));
    return projectId;
  });

  // Categories
  ipcMain.handle('getCategories', () => store.get('categories'));
  ipcMain.handle('addCategory', (_, category: Category) => {
    const categories = store.get('categories', []);
    store.set('categories', [...categories, category]);
    return category;
  });
  ipcMain.handle('updateCategory', (_, category: Category) => {
    const categories = store.get('categories', []);
    const updatedCategories = categories.map((c: Category) => c.id === category.id ? category : c);
    store.set('categories', updatedCategories);
    return category;
  });
  ipcMain.handle('deleteCategory', (_, categoryId: string) => {
    const categories = store.get('categories', []);
    store.set('categories', categories.filter((c: Category) => c.id !== categoryId));
    return categoryId;
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // In development, load from the Vite dev server
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // In production, load the built index.html file
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});