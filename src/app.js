const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Importa el paquete cors
const whoopRoutes = require('./routes/whoopRoutes');

dotenv.config();

const app = express();

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://192.168.1.9:5173', 'http://10.0.2.2:5173'] 
}));  // Esto permite todas las solicitudes desde cualquier origen
// O puedes restringirlo a un origen específico (por ejemplo, desde localhost:5173):
// app.use(cors({ origin: 'http://localhost:5173' }));

// Usar las rutas definidas
app.use(whoopRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
