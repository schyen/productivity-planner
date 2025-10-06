import Store from 'electron-store';
import { Task, Project, Category } from '../src/types';

interface StoreSchema {
  tasks: Task[];
  projects: Project[];
  categories: Category[];
}

const store = new Store<StoreSchema>({
  defaults: {
    tasks: [],
    projects: [],
    categories: []
  }
});

export default store;