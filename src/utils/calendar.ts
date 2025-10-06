import ical from 'ical-generator';
import type { Task } from '../types';

export const generateICalendar = (tasks: Task[]) => {
  const calendar = ical({ name: 'Productivity Planner Tasks' });

  tasks.forEach(task => {
    if (task.scheduledDate) {
      calendar.createEvent({
        start: new Date(task.scheduledDate),
        end: new Date(task.scheduledDate),
        summary: task.title,
        description: task.description,
        allDay: true
      });
    }
  });

  return calendar.toString();
};