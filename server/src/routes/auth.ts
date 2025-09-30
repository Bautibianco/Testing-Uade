import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config/env';
import {
    login,
    loginValidation,
    logout,
    register,
    registerValidation
} from '../controllers/authController';

const router = Router();

// Rate limiting para rutas de autenticación
const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Demasiadas solicitudes, intenta de nuevo más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rutas de autenticación
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/logout', logout);

export default router;
