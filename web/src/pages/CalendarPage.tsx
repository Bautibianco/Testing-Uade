import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import CalendarMonth from '../components/CalendarMonth';
import EventDetailModal from '../components/EventDetailModal';
import EventEditModal from '../components/EventEditModal';
import FilterDropdown, { FilterOption } from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { useEvents } from '../hooks/useEvents';
import { CreateEventData, Event, EventType } from '../types';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<FilterOption>('ALL');

  const debouncedSearch = useDebounce(searchValue, 300);

  const filters = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim();
    return {
      type: filterType !== 'ALL' ? (filterType as EventType) : undefined,
      search: normalizedSearch || undefined
    };
  }, [debouncedSearch, filterType]);

  const { events, loading, deleteEvent, updateEvent } = useEvents(currentDate, filters);

  const hasActiveFilters = filterType !== 'ALL' || debouncedSearch.trim().length > 0;

  const handleClearFilters = () => {
    setFilterType('ALL');
    setSearchValue('');
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const closeAllModals = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveChanges = async (data: CreateEventData) => {
    if (!selectedEvent) return;
    try {
      await updateEvent(selectedEvent._id, data);
      toast.success('Evento actualizado con éxito');
      closeAllModals();
    } catch (error: any) {
      toast.error(error?.message || 'No se pudo actualizar el evento');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await deleteEvent(selectedEvent._id);
      toast.success('Evento eliminado con éxito');
      closeAllModals();
    } catch (error) {
      toast.error('No se pudo eliminar el evento');
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    if (selectedEvent) {
      setIsDetailModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi Calendario</h1>
          <p className="text-gray-600">Organiza tus exámenes, entregas y recordatorios</p>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Búsqueda rápida
              </label>
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Buscar por título o descripción"
              />
            </div>
            <div className="md:w-64">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Filtrar por tipo
              </label>
              <FilterDropdown value={filterType} onChange={setFilterType} />
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          {hasActiveFilters && (
            <p className="mt-3 text-sm text-gray-500">
              Mostrando {events.length} evento{events.length === 1 ? '' : 's'} filtrados por{' '}
              {filterType !== 'ALL' && `tipo "${filterType === 'EXAM' ? 'Examen' : filterType === 'DELIVERY' ? 'Entrega' : 'Recordatorio'}"`}
              {filterType !== 'ALL' && debouncedSearch.trim() ? ' y ' : ''}
              {debouncedSearch.trim() && `búsqueda "${debouncedSearch.trim()}"`}
            </p>
          )}
        </div>

        <CalendarMonth
          events={events}
          loading={loading}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onEventClick={handleEventClick}
        />
      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={closeAllModals}
        onEdit={(event) => {
          setSelectedEvent(event);
          setIsDetailModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={(event) => {
          setSelectedEvent(event);
          setIsDetailModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />

      <EventEditModal
        event={selectedEvent}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleSaveChanges}
      />

      {isDeleteModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mt-4 text-center text-lg font-semibold text-gray-900">
              ¿Deseás eliminar este evento?
            </h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Esta acción no se puede deshacer y se eliminará del calendario inmediatamente.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Eliminar evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
