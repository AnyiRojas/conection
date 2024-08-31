import { Pedido_Venta } from '../models/Pedido_Venta.model.js';

class Pedido_VentaController {
    static async getPedidoVentas(req, res) {
        try {
            const pedidoVentas = await Pedido_Venta.findAll();
            res.json(pedidoVentas);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los registros de Pedido_Venta', error });
        }
    }

    static async getPedidoVenta(req, res) {
        const { id } = req.params;
        try {
            const pedidoVenta = await Pedido_Venta.findByPk(id);
            if (pedidoVenta) {
                res.json(pedidoVenta);
            } else {
                res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el registro de Pedido_Venta', error });
        }
    }

    static async postPedidoVenta(req, res) {
        try {
            const { informe_id, historial_id } = req.body;
            const newPedidoVenta = await Pedido_Venta.create({ informe_id, historial_id });
            res.status(201).json(newPedidoVenta);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el registro de Pedido_Venta: ' + error.message });
        }
    }

    static async putPedidoVenta(req, res) {
        try {
            const id = req.params.id;
            const { informe_id, historial_id } = req.body;

            const pedidoVenta = await Pedido_Venta.findByPk(id);
            if (!pedidoVenta) {
                return res.status(404).json({ message: 'Registro de Pedido_Venta no encontrado' });
            }

            await pedidoVenta.update({ informe_id, historial_id });
            res.status(200).json(pedidoVenta);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el registro de Pedido_Venta: ' + error.message });
        }
    }
}

export default Pedido_VentaController;