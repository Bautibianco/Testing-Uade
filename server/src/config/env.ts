import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

// Si no hay archivo .env, usar configuración de desarrollo
if (!process.env.NODE_ENV) {
  dotenv.config({ path: path.join(__dirname, '../../env.development') });
}

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-for-development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  }
};

export const isProduction = config.nodeEnv === 'production';
export const useMemoryDb = !config.mongodbUri;
