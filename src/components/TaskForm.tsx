import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
         Select, MenuItem, FormControl, InputLabel, Button, Stack,
         Chip, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { Task } from '../types';
import { useApp } from '../context/useApp';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
}

interface TaskFormData {
  title: string;
  description: string;
  project: string;
  urgency: 'low' | 'medium' | 'high';
  deadline?: Date;
  type: string;
  categories: string[];
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  project: '',
  urgency: 'medium',
  type: '',
  categories: []
};

export const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, task }) => {
  const { projects, categories, addTask, updateTask } = useApp();
  const [formData, setFormData] = React.useState<TaskFormData>(initialFormData);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        project: task.project,
        urgency: task.urgency,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        type: task.type,
        categories: task.categories
      });
      setSelectedCategories(task.categories);
    } else {
      setFormData(initialFormData);
      setSelectedCategories([]);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      deadline: formData.deadline?.toISOString(),
      categories: selectedCategories
    };

    if (task) {
      await updateTask({ ...taskData, id: task.id, createdAt: task.createdAt });
    } else {
      await addTask(taskData);
    }

    onClose();
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />

            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={formData.project}
                label="Project"
                required
                onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}>
                {projects.map((project: { id: string; name: string }) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Urgency</InputLabel>
              <Select
                value={formData.urgency}
                label="Urgency"
                required
                onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as 'low' | 'medium' | 'high' }))}>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                value={formData.deadline}
                onChange={(newValue: Date | null) => setFormData(prev => ({ ...prev, deadline: newValue || undefined }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <TextField
              label="Type"
              fullWidth
              required
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            />

            <Box>
              <InputLabel sx={{ mb: 1 }}>Categories</InputLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories.map((category: { id: string; name: string; color?: string }) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => handleCategoryToggle(category.id)}
                    color={selectedCategories.includes(category.id) ? 'primary' : 'default'}
                    sx={{ 
                      bgcolor: selectedCategories.includes(category.id) 
                        ? category.color 
                        : undefined 
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};