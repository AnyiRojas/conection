import express from 'express';
import CarritoController from '../controllers/carrito.controller.js';

const router = express.Router();

router.post('/api/carrito', CarritoController.postCarrito);
router.post('/api/carrito/:carrito_id/productos', CarritoController.addProductoToCarrito);
router.delete('/api/carrito/:carrito_id/productos/:producto_id', CarritoController.removeProductoFromCarrito);
router.get('/api/carrito/:carrito_id', CarritoController.getCarritoContent);

export default router;
