// routes/protectedRoutes.js
import express from 'express';
import { clientPage, sellerPage, deliveryPage, adminPage } from '../controllers/protectedController.js';
import authMiddleware from '../middleware/login.middleware.js';
const router = express.Router();

// Rutas protegidas
router.get('/api/cliente', authMiddleware, clientPage);
router.get('/api/vendedor', authMiddleware, sellerPage);
router.get('/api/domiciliario', authMiddleware, deliveryPage);
router.get('/api/admin', authMiddleware, adminPage);

export default router;
