import { Historial_Pedidos } from '../models/Historial_Pedidos.model.js';

class HistorialPedidosController {
    static async getHistoriales(req, res) {
        try {
            const historiales = await Historial_Pedidos.getHistoriales();
            res.json(historiales);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los historiales de pedidos', error });
        }
    }

    static async getHistorial(req, res) {
        const { id } = req.params;
        try {
            const historial = await Historial_Pedidos.getHistorialById(id);
            if (historial) {
                res.json(historial);
            } else {
                res.status(404).json({ message: 'Historial de pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el historial de pedido', error });
        }
    }

    static async postHistorial(req, res) {
        try {
            const { fecha_consulta, detalles_pedido, usuario_id } = req.body;

            if (!detalles_pedido || detalles_pedido.length < 1 || detalles_pedido.length > 50) {
                return res.status(400).json({ message: 'Detalles del pedido no válidos' });
            }

            const nuevoHistorial = await Historial_Pedidos.createHistorial({
                fecha_consulta,
                detalles_pedido,
                usuario_id
            });
            res.status(201).json(nuevoHistorial);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el historial de pedido: ' + error.message });
        }
    }

    static async putHistorial(req, res) {
        try {
            const id = req.params.id;
            const { fecha_consulta, detalles_pedido, usuario_id } = req.body;

            if (!detalles_pedido || detalles_pedido.length < 1 || detalles_pedido.length > 50) {
                return res.status(400).json({ message: 'Detalles del pedido no válidos' });
            }

            const historial = await Historial_Pedidos.getHistorialById(id);

            if (!historial) {
                return res.status(404).json({ message: 'Historial de pedido no encontrado' });
            }

            const historialActualizado = await Historial_Pedidos.updateHistorial(id, {
                fecha_consulta,
                detalles_pedido,
                usuario_id
            });
            res.json(historialActualizado);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el historial de pedido: ' + error.message });
        }
    }

    static async deleteHistorial(req, res) {
        try {
            const id = req.params.id;
            const historial = await Historial_Pedidos.getHistorialById(id);

            if (!historial) {
                return res.status(404).json({ message: 'Historial de pedido no encontrado' });
            }

            await historial.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el historial de pedido: ' + error.message });
        }
    }
}

export default HistorialPedidosController;
