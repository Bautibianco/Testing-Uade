import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { ApiError, CreateEventData, Event, UpdateEventData } from '../types';
import { api } from '../utils/api';

interface EventFilters {
  type?: string;
  search?: string;
}

export const useEvents = (date: Date, filters?: EventFilters) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = format(startOfMonth(date), 'yyyy-MM-dd');
  const to = format(endOfMonth(date), 'yyyy-MM-dd');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        from,
        to
      });

      if (filters?.type) {
        params.append('type', filters.type);
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }

      const response = await api.get<Event[]>(`/events?${params.toString()}`);
      setEvents(response.data || []);
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      setError(apiError?.error || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.type, from, to]);

  const createEvent = async (eventData: CreateEventData): Promise<Event> => {
    try {
      const response = await api.post<Event>('/events', eventData);
      const newEvent = response.data;
      
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      throw new Error(apiError?.error || 'Error al crear evento');
    }
  };

  const updateEvent = async (eventId: string, eventData: UpdateEventData): Promise<Event> => {
    try {
      const response = await api.put<Event>(`/events/${eventId}`, eventData);
      const updatedEvent = response.data;
      
      setEvents(prev => 
        prev.map(event => 
          event._id === eventId ? updatedEvent : event
        )
      );
      return updatedEvent;
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      throw new Error(apiError?.error || 'Error al actualizar evento');
    }
  };

  const deleteEvent = async (eventId: string): Promise<void> => {
    try {
      await api.delete(`/events/${eventId}`);
      setEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      throw new Error(apiError?.error || 'Error al eliminar evento');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  };
};
