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

// Rutas de perfil
router.get('/', getProfile);
router.put('/', updateProfileValidation, updateProfile);
router.put('/password', changePasswordValidation, changePassword);

export default router;
