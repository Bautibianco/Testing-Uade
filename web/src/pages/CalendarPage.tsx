import React, { useState } from 'react';
import CalendarMonth from '../components/CalendarMonth';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events, loading, deleteEvent } = useEvents(currentDate);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleEventDelete = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete);
        setShowDeleteModal(false);
        setEventToDelete(null);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error eliminando evento:', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi Calendario</h1>
          <p className="text-gray-600">Organiza tus exámenes, trabajos y clases</p>
        </div>

        <div className="relative">
          <CalendarMonth
            events={events}
            loading={loading}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onEventClick={handleEventClick}
            onEventDelete={handleEventDelete}
          />
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  ¿Eliminar evento?
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Esta acción no se puede deshacer. El evento será eliminado permanentemente.
                  </p>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalles del evento */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles del evento
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Título</label>
                  <p className="text-gray-900">{selectedEvent.title}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-gray-900">
                    {selectedEvent.type === 'EXAM' && 'Examen'}
                    {selectedEvent.type === 'DELIVERY' && 'Entrega'}
                    {selectedEvent.type === 'CLASS' && 'Clase'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha</label>
                  <p className="text-gray-900">
                    {new Date(selectedEvent.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                {selectedEvent.time && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hora</label>
                    <p className="text-gray-900">{selectedEvent.time}</p>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Descripción</label>
                    <p className="text-gray-900">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
