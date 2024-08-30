import express from 'express';
import EventoController from '../controllers/eventos.controller.js'; 
const router = express.Router();

router.get('/api/evento', EventoController.getEventos);
router.get('/api/evento/:tipo_evento', EventoController.getEventoByTipo);
router.post('/api/evento', EventoController.addEvento);
router.put('/api/evento/:id_evento', EventoController.updateEvento);
router.delete('/api/evento/:id_evento', EventoController.deleteEvento);

export default router;
