import { format } from 'date-fns';
import React from 'react';
import { Event, EventType } from '../types';
import { formatEventTime, getEventTypeLabel } from '../utils/calendar';

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
}

const indicatorColors: Record<EventType, string> = {
  EXAM: 'bg-red-500',
  DELIVERY: 'bg-amber-500',
  CLASS: 'bg-emerald-500'
};

const DayCell: React.FC<DayCellProps> = ({
  day,
  events,
  isSelected,
  onDateClick,
  onEventClick
}) => {
  const displayEvents = events.slice(0, 3);
  const remainingCount = events.length - 3;

  return (
    <div
      className={`relative min-h-[140px] border-b border-r border-gray-200 p-2 ${
        day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onDateClick}
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
            day.isToday
              ? 'bg-accent text-white'
              : isSelected
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {format(day.date, 'd')}
        </button>
        {events.length > 0 && (
          <div className="flex space-x-1">
            {[...new Set(events.map(event => event.type))].slice(0, 3).map(type => (
              <span
                key={type}
                className={`h-2 w-2 rounded-full ${indicatorColors[type as EventType]}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 space-y-1">
        {displayEvents.map(event => (
          <button
            key={event._id}
            onClick={() => onEventClick(event)}
            className="flex w-full items-center space-x-2 rounded-lg border border-gray-100 bg-gray-50 px-2 py-1 text-left text-xs transition-colors hover:bg-gray-100"
            title={`${getEventTypeLabel(event.type)}: ${event.title}`}
          >
            <span className={`h-2 w-2 rounded-full ${indicatorColors[event.type]}`} />
            <div className="flex-1">
              <p className="truncate font-medium text-gray-900">{event.title}</p>
              {event.time && (
                <p className="text-[11px] text-gray-500">{formatEventTime(event.time)}</p>
              )}
            </div>
          </button>
        ))}

        {remainingCount > 0 && (
          <p className="text-xs font-medium text-gray-500">+{remainingCount} eventos</p>
        )}
      </div>
    </div>
  );
};

export default DayCell;
