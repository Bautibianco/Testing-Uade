import React, { useMemo } from 'react';
import EventForm from './EventForm';
import { CreateEventData, Event } from '../types';

interface EventEditModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventData) => Promise<void>;
}

const EventEditModal: React.FC<EventEditModalProps> = ({ event, isOpen, onClose, onSubmit }) => {
  const initialData = useMemo<CreateEventData>(() => ({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    type: event?.type || 'EXAM',
    organization: event?.organization || ''
  }), [event]);

  if (!event || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-900/60 px-4 py-10 sm:items-center">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Editar evento</p>
            <h3 className="mt-1 text-2xl font-semibold text-gray-900">{event.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <EventForm
          initialData={initialData}
          onSubmit={async (data) => {
            await onSubmit(data);
          }}
          onCancel={onClose}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
};

export default EventEditModal;


