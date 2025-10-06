import React, { useState, useMemo } from 'react';
import {
  Box, Paper, Typography, IconButton, Chip, TextField,
  FormControl, InputLabel, Select, MenuItem, Stack,
  SelectChangeEvent
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useApp } from '../context/useApp';
import type { Task } from '../types';
import { TaskListItem } from './TaskListItem';

interface FilterState {
  search: string;
  project: string;
  urgency: string;
  type: string;
  categories: string[];
}

const initialFilters: FilterState = {
  search: '',
  project: '',
  urgency: '',
  type: '',
  categories: []
};

interface SortOption {
  value: keyof Task | 'none';
  label: string;
  direction: 'asc' | 'desc';
}

const sortOptions: SortOption[] = [
  { value: 'none', label: 'None', direction: 'asc' },
  { value: 'createdAt', label: 'Creation Date', direction: 'desc' },
  { value: 'deadline', label: 'Deadline', direction: 'asc' },
  { value: 'urgency', label: 'Urgency', direction: 'desc' }
];

export const TaskList: React.FC = () => {
  const { tasks, projects, categories } = useApp();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [items, setItems] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    const option = sortOptions.find(opt => opt.value === event.target.value);
    if (option) {
      setSortBy(option);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          task.description?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesProject = !filters.project || task.project === filters.project;
      const matchesUrgency = !filters.urgency || task.urgency === filters.urgency;
      const matchesType = !filters.type || task.type === filters.type;
      const matchesCategories = filters.categories.length === 0 ||
                              filters.categories.some(cat => task.categories.includes(cat));

      return matchesSearch && matchesProject && matchesUrgency && matchesType && matchesCategories;
    });
  }, [tasks, filters]);

  const sortedTasks = useMemo(() => {
    if (sortBy.value === 'none') return filteredTasks;

    return [...filteredTasks].sort((a, b) => {
      const aValue = a[sortBy.value as keyof Task];
      const bValue = b[sortBy.value as keyof Task];

      if (!aValue || !bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortBy.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredTasks, sortBy]);

  // Update items when tasks change
  React.useEffect(() => {
    setItems(sortedTasks.map(task => task.id));
  }, [sortedTasks]);

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        {/* Filters */}
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Search"
              fullWidth
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={filters.project}
                  label="Project"
                  onChange={(e) => handleFilterChange('project', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Urgency</InputLabel>
                <Select
                  value={filters.urgency}
                  label="Urgency"
                  onChange={(e) => handleFilterChange('urgency', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy.value}
                  label="Sort By"
                  onChange={handleSortChange}
                >
                  {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Categories</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories.map(category => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => {
                      const newCategories = filters.categories.includes(category.id)
                        ? filters.categories.filter(id => id !== category.id)
                        : [...filters.categories, category.id];
                      handleFilterChange('categories', newCategories);
                    }}
                    color={filters.categories.includes(category.id) ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </Paper>

        {/* Task List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}
          >
            <Stack spacing={1}>
              {sortedTasks.map(task => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      </Stack>
    </Box>
  );
};