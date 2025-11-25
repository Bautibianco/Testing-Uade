import React from 'react';
import { Event, EventType } from '../types';
import { formatEventTime, getEventTypeLabel } from '../utils/calendar';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const badgeColors: Record<EventType, string> = {
  EXAM: 'bg-red-100 text-red-700 border-red-200',
  DELIVERY: 'bg-amber-100 text-amber-700 border-amber-200',
  CLASS: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!event || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-gray-900/50 px-4 py-10 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Evento</p>
            <h3 className="mt-1 text-2xl font-semibold text-gray-900">{event.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${badgeColors[event.type]}`}>
              {getEventTypeLabel(event.type)}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Fecha</p>
              <p className="mt-1 text-base text-gray-900">
                {new Date(event.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Hora</p>
              <p className="mt-1 text-base text-gray-900">
                {event.time ? formatEventTime(event.time) : 'Sin horario definido'}
              </p>
            </div>
          </div>

          {event.description && (
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Descripción</p>
              <p className="mt-2 whitespace-pre-line text-gray-800">{event.description}</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            onClick={() => onDelete(event)}
            className="inline-flex items-center justify-center rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Eliminar
          </button>
          <button
            onClick={() => onEdit(event)}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16.862 4.487a2.25 2.25 0 013.182 3.182L9.75 17.963l-4.5.75.75-4.5L16.862 4.487z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 13.5V18a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V8.25A2.25 2.25 0 016.75 6h4.75"
              />
            </svg>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;


