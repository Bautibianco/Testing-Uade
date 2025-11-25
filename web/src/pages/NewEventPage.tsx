import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EventForm from '../components/EventForm';
import { useEvents } from '../hooks/useEvents';
import { CreateEventData } from '../types';

const NewEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent } = useEvents(new Date());

  const initialData: CreateEventData = {
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'EXAM',
    organization: ''
  };

  const handleSubmit = async (data: CreateEventData) => {
    await createEvent(data);
    toast.success('Evento creado con éxito');
    navigate('/calendar');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nuevo evento</h1>
          <p className="text-gray-600">Registra los detalles para agendar un nuevo recordatorio.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <EventForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/calendar')}
            submitLabel="Crear evento"
          />
        </div>
      </div>
    </div>
  );
};

export default NewEventPage;
