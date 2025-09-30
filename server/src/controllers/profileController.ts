import bcrypt from 'bcrypt';
import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { useMemoryDb } from '../config/env';
import { AuthenticatedRequest } from '../middlewares/auth';
import { MemoryUserRepository } from '../repositories/memory';
import { MongoUserRepository } from '../repositories/mongo';

const userRepo = useMemoryDb ? new MemoryUserRepository() : new MongoUserRepository();

export const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El nombre no puede exceder 50 caracteres'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El apellido no puede exceder 50 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('organizations')
    .optional()
    .isArray()
    .withMessage('Las organizaciones deben ser un array'),
  body('organizations.*')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Cada organización no puede exceder 100 caracteres')
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número')
];

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await userRepo.findById(req.userId!);
    
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // No retornar el passwordHash
    const { passwordHash, ...userProfile } = user.toObject();
    
    res.status(200).json({
      user: userProfile
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ 
        error: 'Datos inválidos',
        details: errors.array()
      });
      return;
    }

    const { firstName, lastName, email, organizations } = req.body;
    const updateData: any = {};

    // Solo actualizar campos que se proporcionaron
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (organizations !== undefined) updateData.organizations = organizations;

    // Si se está cambiando el email, verificar que no exista
    if (email !== undefined) {
      const existingUser = await userRepo.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== req.userId) {
        res.status(409).json({ error: 'El email ya está en uso' });
        return;
      }
      updateData.email = email.toLowerCase();
    }

    const updatedUser = await userRepo.updateById(req.userId!, updateData);
    
    if (!updatedUser) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // No retornar el passwordHash
    const { passwordHash, ...userProfile } = updatedUser.toObject();
    
    res.status(200).json({
      user: userProfile
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ 
        error: 'Datos inválidos',
        details: errors.array()
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Obtener el usuario actual
    const user = await userRepo.findById(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar la contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Contraseña actual incorrecta' });
      return;
    }

    // Hash de la nueva contraseña
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña
    await userRepo.updateById(req.userId!, { passwordHash: newPasswordHash });

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
