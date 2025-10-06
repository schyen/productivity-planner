import React from 'react';
import { TaskForm } from './TaskForm';
import type { Task } from '../types';

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
}

export const TaskFormDialog: React.FC<TaskFormDialogProps> = ({ open, onClose, task }) => {
  return <TaskForm open={open} onClose={onClose} task={task} />;
};