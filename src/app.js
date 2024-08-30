import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes.js';
import productoRoutes from './routes/producto.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import pedido_ventaRoutes from './routes/pedido_venta.routes.js';
import pagoRoutes from './routes/pago.routes.js';
import informe_pedidoRoutes from './routes/informe_pedido.routes.js';
import historial_pedidoRoutes from './routes/historial_pedido.routes.js';
import envioRoutes from './routes/envio.routes.js';
import detalle_pedidoRoutes from './routes/detalle_pedido.routes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import eventosRoutes from './routes/eventos.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(usuarioRoutes, productoRoutes, pedidoRoutes, pedido_ventaRoutes, pagoRoutes, informe_pedidoRoutes, historial_pedidoRoutes, envioRoutes, detalle_pedidoRoutes, protectedRoutes, eventosRoutes, carritoRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal. Intenta nuevamente más tarde.' });
});

export default app;
