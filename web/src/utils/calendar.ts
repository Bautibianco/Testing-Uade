import {
    addDays,
    endOfMonth,
    endOfWeek,
    isSameDay,
    isSameMonth,
    parseISO,
    startOfMonth,
    startOfWeek
} from 'date-fns';
import { CalendarDay, Event } from '../types';

export const generateCalendarDays = (date: Date): CalendarDay[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days: CalendarDay[] = [];
  let day = startDate;

  while (day <= endDate) {
    days.push({
      date: new Date(day),
      events: [],
      isCurrentMonth: isSameMonth(day, monthStart),
      isToday: isSameDay(day, new Date())
    });
    day = addDays(day, 1);
  }

  return days;
};

export const populateCalendarWithEvents = (days: CalendarDay[], events: Event[]): CalendarDay[] => {
  return days.map(day => {
    const dayEvents = events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, day.date);
      } catch {
        return false;
      }
    });

    return {
      ...day,
      events: dayEvents
    };
  });
};

export const getEventTypeColor = (type: string): string => {
  switch (type) {
    case 'EXAM':
      return 'bg-red-500 text-white';
    case 'DELIVERY':
      return 'bg-amber-500 text-white';
    case 'CLASS':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const getEventTypeLabel = (type: string): string => {
  switch (type) {
    case 'EXAM':
      return 'Examen';
    case 'DELIVERY':
      return 'Entrega';
    case 'CLASS':
      return 'Clase';
    default:
      return type;
  }
};

export const formatEventTime = (time?: string): string => {
  if (!time) return '';
  
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
};
