import { Detalle_Pedido } from '../models/Detalle_Pedido.model.js';

class DetallePedidoController {
    static async getDetallesPedidos(req, res) {
        try {
            const detallesPedidos = await Detalle_Pedido.getDetallesPedidos();
            res.json(detallesPedidos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los detalles de pedidos', error });
        }
    }

    static async getDetallePedido(req, res) {
        const { id } = req.params;
        try {
            const detallePedido = await Detalle_Pedido.getDetallePedidoById(id);
            if (detallePedido) {
                res.json(detallePedido);
            } else {
                res.status(404).json({ message: 'Detalle de pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el detalle de pedido', error });
        }
    }

    static async postDetallePedido(req, res) {
        const { cantidad, precio_unitario, pedido_id, producto_id } = req.body;
        try {
            await Detalle_Pedido.createDetallePedido(cantidad, precio_unitario, pedido_id, producto_id);
            res.status(201).json({ message: 'Detalle de pedido creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el detalle de pedido', error });
        }
    }

    static async putDetallePedido(req, res) {
        const { id } = req.params;
        const { cantidad, precio_unitario, pedido_id, producto_id } = req.body;
        try {
            const affectedRows = await Detalle_Pedido.updateDetallePedido(id, cantidad, precio_unitario, pedido_id, producto_id);
            if (affectedRows > 0) {
                res.status(200).json({ message: 'Detalle de pedido actualizado correctamente' });
            } else {
                res.status(404).json({ message: 'Detalle de pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el detalle de pedido', error });
        }
    }

    static async deleteDetallePedido(req, res) {
        const { id } = req.params;
        try {
            const affectedRows = await Detalle_Pedido.deleteDetallePedido(id);
            if (affectedRows > 0) {
                res.status(204).send(); 
            } else {
                res.status(404).json({ message: 'Detalle de pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el detalle de pedido', error });
        }
    }
}

export default DetallePedidoController;