import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from "connect-mongo";
import passport from "passport";
import bodyParser from "body-parser";


import sessionRouter from './routes/api/sessions.js';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import messageRoutes from './routes/message.routes.js';
import chatSocket from './dao/sockets/chatSocket.js';
import productSocket from './dao/sockets/productSocket.js';
import exphbs from'express-handlebars';
import initializePassport from "./config/passport.config.js";
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
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb+srv://Arnaldo:qweasd@cluster0.week34v.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0" }),
}));


initializePassport();
app.use(passport.initialize());
app.use(passport.session());


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

