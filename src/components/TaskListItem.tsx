import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import type { Task } from '../types';
import { useApp } from '../context/useApp';
import { TaskFormDialog } from './TaskFormDialog';

interface TaskListItemProps {
  task: Task;
}

const urgencyColors = {
  low: 'success.main',
  medium: 'warning.main',
  high: 'error.main'
};

export const TaskListItem: React.FC<TaskListItemProps> = ({ task }) => {
  const { projects, categories, deleteTask } = useApp();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const project = projects.find((p: { id: string }) => p.id === task.project);
  const taskCategories = categories.filter((c: { id: string }) => task.categories.includes(c.id));

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        '&:hover': {
          boxShadow: 2
        }
      }}
    >
      <IconButton {...attributes} {...listeners} size="small">
        <DragIcon />
      </IconButton>

      <Box sx={{ flex: 1 }}>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{task.title}</Typography>
            <Chip
              size="small"
              label={task.urgency.toUpperCase()}
              sx={{ bgcolor: urgencyColors[task.urgency as keyof typeof urgencyColors] }}
            />
            {project && (
              <Chip
                size="small"
                label={project.name}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>

          {task.description && (
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {taskCategories.map((category: { id: string; name: string; color?: string }) => (
              <Chip
                key={category.id}
                label={category.name}
                size="small"
                sx={{ bgcolor: category.color }}
              />
            ))}
          </Box>

          {task.deadline && (
            <Typography variant="caption" color="text.secondary">
              Due: {new Date(task.deadline).toLocaleDateString()}
            </Typography>
          )}
        </Stack>
      </Box>

      <Stack direction="row" spacing={1}>
        <IconButton
          size="small"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleDelete}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Stack>

      {isEditDialogOpen && (
        <TaskFormDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          task={task}
        />
      )}
    </Paper>
  );
};