import { Router } from 'express';
import {
    changePassword,
    changePasswordValidation,
    getProfile,
    updateProfile,
    updateProfileValidation
} from '../controllers/profileController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Todas las rutas de perfil requieren autenticación
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Endpoints para gestión de perfil de usuario
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del usuario
 *                 example: Juan Pérez Actualizado
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo email del usuario
 *                 example: nuevo.email@example.com
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Perfil actualizado exitosamente
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos o email ya en uso
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
router.put('/', updateProfileValidation, updateProfile);

/**
 * @swagger
 * /profile/password:
 *   put:
 *     summary: Cambiar contraseña del usuario
 *     tags: [Profile]
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
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Contraseña actual
 *                 example: password123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Nueva contraseña (mínimo 6 caracteres)
 *                 example: newpassword456
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada exitosamente
 *       400:
 *         description: Contraseña actual incorrecta o nueva contraseña inválida
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
router.put('/password', changePasswordValidation, changePassword);

export default router;
