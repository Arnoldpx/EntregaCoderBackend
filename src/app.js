import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import session from 'express-session';


import sessionRouter from './routes/api/sessions.js';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import messageRoutes from './routes/message.routes.js';
import chatSocket from './dao/sockets/chatSocket.js';
import productSocket from './dao/sockets/productSocket.js';
import exphbs from'express-handlebars';
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);
const PORT = 8080;

// Middleware para permitir formato JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
  }));


  // Middleware para rutas públicas y privadas
const redirectToLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  const redirectToProfile = (req, res, next) => {
    if (req.session.userId) {
      res.redirect('/profile');
    } else {
      next();
    }
  };
  
  // Rutas
 


// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para agregar la instancia de io al objeto de solicitud
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rutas
app.use('/api', messageRoutes);
app.use('/api/products', productRoutes);
app.use('/api', cartRoutes);
app.use('/', viewsRouter);
 app.use('/api/sessions', sessionRouter);

chatSocket(io);
productSocket(io);

const hbs = exphbs.create({
    extname: '.handlebars',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Conectado a la base de datos");
    })
    .catch((error) => console.error("Error en la conexión a la base de datos: ", error));

// Iniciar el servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

