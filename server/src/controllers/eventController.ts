import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { useMemoryDb } from '../config/env';
import { AuthenticatedRequest } from '../middlewares/auth';
import { MemoryEventRepository } from '../repositories/memory';
import { MongoEventRepository } from '../repositories/mongo';

const eventRepo = useMemoryDb ? new MemoryEventRepository() : new MongoEventRepository();

export const createEventValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El título debe tener entre 2 y 100 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  body('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('La fecha debe estar en formato YYYY-MM-DD'),
  body('time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora debe estar en formato HH:mm'),
  body('type')
    .isIn(['EXAM', 'DELIVERY', 'CLASS'])
    .withMessage('El tipo debe ser EXAM, DELIVERY o CLASS')
];

export const updateEventValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El título debe tener entre 2 y 100 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  body('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('La fecha debe estar en formato YYYY-MM-DD'),
  body('time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora debe estar en formato HH:mm'),
  body('type')
    .optional()
    .isIn(['EXAM', 'DELIVERY', 'CLASS'])
    .withMessage('El tipo debe ser EXAM, DELIVERY o CLASS')
];

export const getEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      res.status(400).json({ error: 'Los parámetros from y to son requeridos' });
      return;
    }

    if (typeof from !== 'string' || typeof to !== 'string') {
      res.status(400).json({ error: 'Los parámetros from y to deben ser strings' });
      return;
    }

    // Validar formato de fechas
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(from) || !dateRegex.test(to)) {
      res.status(400).json({ error: 'Las fechas deben estar en formato YYYY-MM-DD' });
      return;
    }

    const events = await eventRepo.findByUserAndDateRange(req.userId!, from, to);
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ 
        error: 'Datos inválidos',
        details: errors.array()
      });
      return;
    }

    const { title, description, date, time, type } = req.body;

    const event = await eventRepo.create({
      userId: req.userId! as any,
      title,
      description,
      date,
      time,
      type
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creando evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ 
        error: 'Datos inválidos',
        details: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    const event = await eventRepo.updateByIdAndUser(id, req.userId!, updateData);
    
    if (!event) {
      res.status(404).json({ error: 'Evento no encontrado' });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error actualizando evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await eventRepo.deleteByIdAndUser(id, req.userId!);
    
    if (!deleted) {
      res.status(404).json({ error: 'Evento no encontrado' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error eliminando evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
