import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { database } from './config/db';
import authRoutes from './routes/auth.routes';
import equipmentRoutes from './routes/equipment.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Logging simple
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando',
    database: database.estaConectado() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Ruta de inicio
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a Formotex Inventory API',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login', 
      'GET /api/equipment',
      'GET /api/health'
    ]
  });
});

// Manejo de rutas no encontradas
app.use('/not-found', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Conectar a DB (no bloqueante)
    database.conectar();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Estado DB: ${database.estaConectado() ? '✅ Conectado' : '❌ No conectado'}`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
}

// Manejo de cierre
process.on('SIGINT', async () => {
  console.log('\n🛑 Deteniendo servidor...');
  await database.desconectar();
  process.exit(0);
});

startServer();