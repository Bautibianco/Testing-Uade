import {
    addMonths,
    format,
    isSameDay,
    parseISO,
    subMonths
} from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState } from 'react';
import { Event } from '../types';
import {
    generateCalendarDays,
    populateCalendarWithEvents
} from '../utils/calendar';
import DayCell from './DayCell';

interface CalendarMonthProps {
  events: Event[];
  loading: boolean;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({
  events,
  loading,
  currentDate,
  onDateChange,
  onEventClick,
  onEventDelete
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const calendarDays = generateCalendarDays(currentDate);
  const daysWithEvents = populateCalendarWithEvents(calendarDays, events);

  const goToPreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, date);
      } catch {
        return false;
      }
    });
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header del calendario */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Mes anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-accent hover:text-blue-600 font-medium"
          >
            Hoy
          </button>
          
          <button
            onClick={goToNextMonth}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Mes siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="grid grid-cols-7">
        {daysWithEvents.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            events={getEventsForDate(day.date)}
            isSelected={selectedDate ? isSameDay(day.date, selectedDate) : false}
            onDateClick={() => setSelectedDate(day.date)}
            onEventClick={onEventClick}
            onEventDelete={onEventDelete}
          />
        ))}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
            <span className="text-gray-600">Cargando eventos...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarMonth;
