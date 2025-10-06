import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useApp } from '../context/useApp';
import { ProjectFormDialog } from './ProjectFormDialog';
import { CategoryFormDialog } from './CategoryFormDialog';
import type { Project, Category } from '../types';

export const ProjectCategoryManager: React.FC = () => {
  const {
    projects,
    categories,
    addProject,
    updateProject,
    deleteProject,
    addCategory,
    updateCategory,
    deleteCategory
  } = useApp();

  const [projectDialog, setProjectDialog] = React.useState<{
    open: boolean;
    project?: Project;
  }>({ open: false });

  const [categoryDialog, setCategoryDialog] = React.useState<{
    open: boolean;
    category?: Category;
  }>({ open: false });

  const handleProjectSave = async (projectData: Omit<Project, 'id'>) => {
    if (projectDialog.project) {
      await updateProject({ ...projectData, id: projectDialog.project.id });
    } else {
      await addProject(projectData);
    }
  };

  const handleCategorySave = async (categoryData: Omit<Category, 'id'>) => {
    if (categoryDialog.category) {
      await updateCategory({ ...categoryData, id: categoryDialog.category.id });
    } else {
      await addCategory(categoryData);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        {/* Projects Section */}
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Projects</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setProjectDialog({ open: true })}
                variant="contained"
                size="small"
              >
                Add Project
              </Button>
            </Box>
            <List>
              {projects.map((project: Project) => (
                <React.Fragment key={project.id}>
                  <ListItem>
                    <ListItemText
                      primary={project.name}
                      secondary={
                        <Chip
                          size="small"
                          sx={{ bgcolor: project.color, width: 50 }}
                        />
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => setProjectDialog({ open: true, project })}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Stack>
        </Paper>

        {/* Categories Section */}
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Categories</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setCategoryDialog({ open: true })}
                variant="contained"
                size="small"
              >
                Add Category
              </Button>
            </Box>
            <List>
              {categories.map((category: Category) => (
                <React.Fragment key={category.id}>
                  <ListItem>
                    <ListItemText
                      primary={category.name}
                      secondary={
                        <Chip
                          size="small"
                          sx={{ bgcolor: category.color, width: 50 }}
                        />
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => setCategoryDialog({ open: true, category })}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>

      {/* Dialogs */}
      <ProjectFormDialog
        open={projectDialog.open}
        onClose={() => setProjectDialog({ open: false })}
        project={projectDialog.project}
        onSave={handleProjectSave}
      />

      <CategoryFormDialog
        open={categoryDialog.open}
        onClose={() => setCategoryDialog({ open: false })}
        category={categoryDialog.category}
        onSave={handleCategorySave}
      />
    </Box>
  );
};