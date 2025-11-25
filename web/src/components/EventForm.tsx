import React, { useEffect, useState } from 'react';
import { CreateEventData, EventType } from '../types';

const eventTypeLabels: Record<EventType, string> = {
  EXAM: 'Examen',
  DELIVERY: 'Entrega',
  CLASS: 'Recordatorio'
};

interface EventFormProps {
  initialData: CreateEventData;
  onSubmit: (data: CreateEventData) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  showOrganizationField?: boolean;
}

const defaultData: CreateEventData = {
  title: '',
  description: '',
  date: '',
  time: '',
  type: 'EXAM',
  organization: ''
};

const EventForm: React.FC<EventFormProps> = ({
  initialData = defaultData,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar cambios',
  showOrganizationField = true
}) => {
  const [formData, setFormData] = useState<CreateEventData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    if (!formData.date) {
      setError('La fecha es obligatoria.');
      return;
    }

    const payload: CreateEventData = {
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      date: formData.date,
      time: formData.time || undefined,
      type: formData.type,
      organization: formData.organization?.trim() || undefined
    };

    try {
      setIsSubmitting(true);
      await onSubmit(payload);
    } catch (submitError: any) {
      setError(submitError?.message || 'Ocurrió un error al guardar el evento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
          Título *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={100}
          value={formData.title}
          onChange={handleInputChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Ej: Parcial de Matemática"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-700">
            Fecha *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="time" className="mb-2 block text-sm font-medium text-gray-700">
            Hora (opcional)
          </label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time || ''}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="type" className="mb-2 block text-sm font-medium text-gray-700">
          Tipo *
        </label>
        <div className="relative">
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {(Object.keys(eventTypeLabels) as EventType[]).map(type => (
              <option key={type} value={type}>
                {eventTypeLabels[type]}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.7-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
          </span>
        </div>
      </div>

      {showOrganizationField && (
        <div>
          <label htmlFor="organization" className="mb-2 block text-sm font-medium text-gray-700">
            Organización (opcional)
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            maxLength={100}
            value={formData.organization || ''}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Ej: UADE, Cátedra..."
          />
        </div>
      )}

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          value={formData.description || ''}
          onChange={handleInputChange}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Agrega detalles adicionales como temas, aula o links..."
        />
      </div>

      <div className="flex flex-col-reverse justify-end gap-3 pt-4 border-t border-gray-200 sm:flex-row">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Guardando...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;


