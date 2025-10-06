import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';
import type { Project } from '../types';
import { ColorPicker } from './ColorPicker';

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
  onSave: (project: Omit<Project, 'id'>) => void;
}

export const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  open,
  onClose,
  project,
  onSave
}) => {
  const [formData, setFormData] = React.useState<Omit<Project, 'id'>>({
    name: '',
    color: '#2196f3',
    ...project
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <ColorPicker
                value={formData.color || '#2196f3'}
                onChange={(color) => setFormData(prev => ({ ...prev, color }))}
              />
              <TextField
                label="Color"
                value={formData.color || '#2196f3'}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                sx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {project ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};