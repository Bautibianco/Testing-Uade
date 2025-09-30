import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { CreateEventData, EventType } from '../types';

const NewEventPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'CLASS',
    organization: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { createEvent } = useEvents(new Date());
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar datos
      if (!formData.title.trim()) {
        throw new Error('El título es requerido');
      }
      
      if (!formData.date) {
        throw new Error('La fecha es requerida');
      }

      // Crear el evento
      const eventData: CreateEventData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        date: formData.date,
        time: formData.time || undefined,
        type: formData.type,
        organization: formData.organization?.trim() || undefined
      };

      await createEvent(eventData);
      navigate('/calendar');
    } catch (err: any) {
      setError(err.message || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: EventType): string => {
    switch (type) {
      case 'EXAM':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'DELIVERY':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'CLASS':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEventTypeLabel = (type: EventType): string => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Evento</h1>
          <p className="text-gray-600">Crea un nuevo evento para tu calendario</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Ej: Examen de Matemáticas"
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/100 caracteres
              </p>
            </div>

            {/* Tipo */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['EXAM', 'DELIVERY', 'CLASS'] as EventType[]).map((type) => (
                  <label
                    key={type}
                    className={`relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.type === type
                        ? getEventTypeColor(type)
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-sm font-medium">{getEventTypeLabel(type)}</div>
                      <div className="text-xs opacity-75">
                        {type === 'EXAM' && '🔴'}
                        {type === 'DELIVERY' && '🟡'}
                        {type === 'CLASS' && '🔵'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>

            {/* Hora */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Hora (opcional)
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>

            {/* Organización */}
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                Organización (opcional)
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Ej: UADE, Universidad, Empresa..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Útil para filtrar eventos por organización
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={1000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                placeholder="Agrega detalles adicionales sobre el evento..."
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description?.length || 0}/1000 caracteres
              </p>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/calendar')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creando...</span>
                  </div>
                ) : (
                  'Crear Evento'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewEventPage;
