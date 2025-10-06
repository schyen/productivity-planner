import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Typography,
  Button,
  Stack,
  Grid,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarViewMonth,
  CalendarViewWeek,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from 'date-fns';
import { useApp } from '../context/useApp';
import { generateICalendar } from '../utils/calendar';
import type { Task } from '../types';

type ViewType = 'week' | 'month';

export const CalendarView: React.FC = () => {
  const { tasks, updateTask } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: ViewType | null) => {
    if (newView) {
      setView(newView);
    }
  };

  const handlePrevious = () => {
    if (view === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (view === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const handleExportCalendar = () => {
    const icalContent = generateICalendar(tasks);
    
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'tasks.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const daysToShow = useMemo(() => {
    const start = view === 'week' ? startOfWeek(currentDate) : startOfMonth(currentDate);
    const end = view === 'week' ? endOfWeek(currentDate) : endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate, view]);

  const tasksForDay = (date: Date): Task[] => {
    return tasks.filter((task: Task) => {
      if (!task.scheduledDate) return false;
      const taskDate = new Date(task.scheduledDate);
      return format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, date: Date) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const task = tasks.find((t: Task) => t.id === taskId);
    
    if (task) {
      updateTask({
        ...task,
        scheduledDate: format(date, 'yyyy-MM-dd')
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* Calendar Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton onClick={handlePrevious}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6">
                {format(currentDate, view === 'week' ? 'MMMM yyyy - Week w' : 'MMMM yyyy')}
              </Typography>
              <IconButton onClick={handleNext}>
                <ChevronRightIcon />
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={2}>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                size="small"
              >
                <ToggleButton value="week">
                  <CalendarViewWeek />
                </ToggleButton>
                <ToggleButton value="month">
                  <CalendarViewMonth />
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                startIcon={<FileDownloadIcon />}
                onClick={handleExportCalendar}
                variant="outlined"
                size="small"
              >
                Export to Outlook
              </Button>
            </Stack>
          </Box>

          {/* Calendar Grid */}
          <Grid container spacing={1}>
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs key={day}>
                <Box sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle2">{day}</Typography>
                </Box>
              </Grid>
            ))}

            {/* Calendar Days */}
            {daysToShow.map((date) => (
              <Grid item xs key={date.toISOString()}>
                <Paper
                  onDrop={(e) => handleDrop(e, date)}
                  onDragOver={handleDragOver}
                  sx={{
                    p: 1,
                    minHeight: view === 'week' ? 150 : 100,
                    bgcolor: isToday(date) ? 'action.hover' : 'background.paper',
                    opacity: view === 'month' && !isSameMonth(date, currentDate) ? 0.5 : 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: isToday(date) ? 'bold' : 'normal',
                    }}
                  >
                    {format(date, 'd')}
                  </Typography>
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    {tasksForDay(date).map((task) => (
                      <Paper
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', task.id);
                        }}
                        sx={{
                          p: 0.5,
                          bgcolor: task.urgency === 'high' ? 'error.main' :
                                  task.urgency === 'medium' ? 'warning.main' : 'success.main',
                          color: 'white',
                          fontSize: '0.75rem',
                          cursor: 'move',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                      >
                        {task.title}
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};