import { Router } from 'express';
import {
    createEvent,
    createEventValidation,
    deleteEvent,
    getEvents,
    updateEvent,
    updateEventValidation
} from '../controllers/eventController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Todas las rutas de eventos requieren autenticación
router.use(requireAuth);

// Rutas de eventos
router.get('/', getEvents);
router.post('/', createEventValidation, createEvent);
router.put('/:id', updateEventValidation, updateEvent);
router.delete('/:id', deleteEvent);

export default router;
