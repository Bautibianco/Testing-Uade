#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando FocusU...\n');

// Verificar si Node.js está instalado
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js ${nodeVersion} detectado`);
} catch (error) {
  console.error('❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/');
  process.exit(1);
}

// Verificar si npm está instalado
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm ${npmVersion} detectado`);
} catch (error) {
  console.error('❌ npm no está instalado');
  process.exit(1);
}

// Instalar concurrently globalmente si no está instalado
try {
  execSync('npm list -g concurrently', { stdio: 'ignore' });
  console.log('✅ concurrently ya está instalado globalmente');
} catch (error) {
  console.log('📦 Instalando concurrently globalmente...');
  try {
    execSync('npm install -g concurrently', { stdio: 'inherit' });
    console.log('✅ concurrently instalado globalmente');
  } catch (installError) {
    console.error('❌ Error instalando concurrently. Instálalo manualmente: npm install -g concurrently');
  }
}

// Instalar dependencias del proyecto raíz
console.log('\n📦 Instalando dependencias del proyecto raíz...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencias del proyecto raíz instaladas');
} catch (error) {
  console.error('❌ Error instalando dependencias del proyecto raíz');
}

// Instalar dependencias del servidor
console.log('\n📦 Instalando dependencias del servidor...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });
  console.log('✅ Dependencias del servidor instaladas');
} catch (error) {
  console.error('❌ Error instalando dependencias del servidor');
}

// Instalar dependencias del frontend
console.log('\n📦 Instalando dependencias del frontend...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'web'), stdio: 'inherit' });
  console.log('✅ Dependencias del frontend instaladas');
} catch (error) {
  console.error('❌ Error instalando dependencias del frontend');
}

// Crear archivo .env para el servidor si no existe
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(serverEnvPath)) {
  console.log('\n📝 Creando archivo .env para el servidor...');
  const envContent = `# Configuración de desarrollo
NODE_ENV=development
PORT=3001
JWT_SECRET=dev-secret-key-change-in-production
CORS_ORIGIN=http://localhost:5173

# Base de datos (dejar vacío para usar memoria)
MONGODB_URI=

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
  
  fs.writeFileSync(serverEnvPath, envContent);
  console.log('✅ Archivo .env creado en server/.env');
} else {
  console.log('✅ Archivo .env ya existe en server/.env');
}

console.log('\n🎉 ¡Configuración completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Ejecuta: npm run dev');
console.log('2. Abre http://localhost:5173 en tu navegador');
console.log('3. Crea una cuenta y comienza a usar FocusU');
console.log('\n💡 Tip: La aplicación funciona en modo memoria por defecto.');
console.log('   Para usar MongoDB, configura MONGODB_URI en server/.env');
console.log('\n🔗 URLs importantes:');
console.log('   - Frontend: http://localhost:5173');
console.log('   - Backend: http://localhost:3001');
console.log('   - Health check: http://localhost:3001/health');
