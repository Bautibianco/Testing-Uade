import { format } from 'date-fns';
import React, { useState } from 'react';
import { Event } from '../types';
import { formatEventTime, getEventTypeColor, getEventTypeLabel } from '../utils/calendar';

interface DayCellProps {
  day: {
    date: Date;
    events: Event[];
    isCurrentMonth: boolean;
    isToday: boolean;
  };
  events: Event[];
  isSelected: boolean;
  onDateClick: () => void;
  onEventClick: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  events,
  isSelected,
  onDateClick,
  onEventClick,
  onEventDelete
}) => {
  const [showEventList, setShowEventList] = useState(false);

  const handleDateClick = () => {
    onDateClick();
    if (events.length > 0) {
      setShowEventList(!showEventList);
    }
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick(event);
  };

  const handleEventDelete = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventDelete(eventId);
  };

  const displayEvents = events.slice(0, 3);
  const remainingCount = events.length - 3;

  return (
    <div className="relative min-h-[120px] border-r border-b border-gray-200 p-2">
      {/* Número del día */}
      <button
        onClick={handleDateClick}
        className={`w-full text-left mb-1 ${
          day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
        } ${
          day.isToday ? 'bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold' : ''
        } ${
          isSelected ? 'bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold' : ''
        } hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors`}
      >
        {format(day.date, 'd')}
      </button>

      {/* Eventos del día */}
      <div className="space-y-1">
        {displayEvents.map((event) => (
          <div
            key={event._id}
            onClick={(e) => handleEventClick(event, e)}
            className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getEventTypeColor(event.type)}`}
            title={`${getEventTypeLabel(event.type)}: ${event.title}${event.time ? ` - ${formatEventTime(event.time)}` : ''}`}
          >
            <div className="truncate font-medium">{event.title}</div>
            {event.time && (
              <div className="text-xs opacity-90">{formatEventTime(event.time)}</div>
            )}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="text-xs text-gray-500 font-medium">
            +{remainingCount} más
          </div>
        )}
      </div>

      {/* Lista de eventos del día (modal/popup) */}
      {showEventList && events.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3 mt-1">
          <div className="text-sm font-medium text-gray-900 mb-2">
            {format(day.date, 'dd/MM/yyyy')}
          </div>
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type).split(' ')[0]}`}></div>
                    <span className="text-sm font-medium">{event.title}</span>
                  </div>
                  {event.time && (
                    <div className="text-xs text-gray-500 ml-4">
                      {formatEventTime(event.time)}
                    </div>
                  )}
                  {event.description && (
                    <div className="text-xs text-gray-600 ml-4 mt-1">
                      {event.description}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => handleEventDelete(event._id, e)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Eliminar evento"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayCell;
