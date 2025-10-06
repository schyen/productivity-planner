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
import type { Category } from '../types';
import { ColorPicker } from './ColorPicker';

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
  onSave: (category: Omit<Category, 'id'>) => void;
}

export const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  onClose,
  category,
  onSave
}) => {
  const [formData, setFormData] = React.useState<Omit<Category, 'id'>>({
    name: '',
    color: '#4caf50',
    ...category
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{category ? 'Edit Category' : 'New Category'}</DialogTitle>
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
                value={formData.color || '#4caf50'}
                onChange={(color) => setFormData(prev => ({ ...prev, color }))}
              />
              <TextField
                label="Color"
                value={formData.color || '#4caf50'}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                sx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {category ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};