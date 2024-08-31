import express from 'express';
import CarritoController from '../controllers/carrito.controller.js';

const router = express.Router();

router.post('/api/carrito', CarritoController.addProductoToCarrito);
router.get('/api/usuario/:usuario_id', CarritoController.getCarritoByUsuarioId);
router.delete('/api/carrito/:id', CarritoController.removeProductoFromCarrito);

export default router;
