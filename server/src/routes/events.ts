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

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Endpoints para gestión de eventos y tareas
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Obtener todos los eventos del usuario autenticado
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getEvents);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Crear un nuevo evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del evento
 *                 example: Reunión de equipo
 *               description:
 *                 type: string
 *                 description: Descripción detallada del evento
 *                 example: Reunión semanal del equipo de desarrollo
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de inicio
 *                 example: 2024-01-15T10:00:00Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de finalización
 *                 example: 2024-01-15T11:00:00Z
 *               completed:
 *                 type: boolean
 *                 description: Estado de completitud del evento
 *                 example: false
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createEventValidation, createEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Actualizar un evento existente
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del evento
 *                 example: Reunión de equipo - Actualizada
 *               description:
 *                 type: string
 *                 description: Descripción del evento
 *                 example: Reunión semanal con nuevos temas
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de inicio
 *                 example: 2024-01-15T10:00:00Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de finalización
 *                 example: 2024-01-15T11:30:00Z
 *               completed:
 *                 type: boolean
 *                 description: Estado de completitud del evento
 *                 example: true
 *     responses:
 *       200:
 *         description: Evento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateEventValidation, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Eliminar un evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a eliminar
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Evento eliminado exitosamente
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteEvent);

export default router;
