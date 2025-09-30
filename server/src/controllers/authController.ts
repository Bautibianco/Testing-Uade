import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { useMemoryDb } from '../config/env';
import { clearAuthCookie, generateToken, setAuthCookie } from '../middlewares/auth';
import { MemoryUserRepository } from '../repositories/memory';
import { MongoUserRepository } from '../repositories/mongo';

const userRepo = useMemoryDb ? new MemoryUserRepository() : new MongoUserRepository();

export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Contraseña requerida')
];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ 
        error: 'Datos inválidos',
        details: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'El email ya está registrado' });
      return;
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const user = await userRepo.create({ email, passwordHash });

    // Generar token y establecer cookie
    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ 
        error: 'Datos inválidos',
        details: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Buscar usuario
    const user = await userRepo.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generar token y establecer cookie
    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  clearAuthCookie(res);
  res.status(204).send();
};
