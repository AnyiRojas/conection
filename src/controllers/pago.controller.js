import { Pago } from '../models/Pago.model.js';

class PagoController {
    static async getPagos(req, res) {
        try {
            const pagos = await Pago.findAll();
            res.json(pagos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los pagos', error });
        }
    }

    static async getPago(req, res) {
        const { id } = req.params;
        try {
            const pago = await Pago.findByPk(id);
            if (pago) {
                res.json(pago);
            } else {
                res.status(404).json({ message: 'Pago no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el pago', error });
        }
    }

    static async postPago(req, res) {
        try {
            const { nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago } = req.body;

            // Validar el método de pago
            const metodosPagoPermitidos = ['Nequi', 'DaviPlata', 'Efectivo', 'Tarjeta'];
            if (!metodosPagoPermitidos.includes(metodo_pago)) {
                return res.status(400).json({ message: 'Método de pago no válido' });
            }

            const newPago = await Pago.create({ nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago });
            res.status(201).json(newPago);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el pago: ' + error.message });
        }
    }

    static async putPago(req, res) {
        try {
            const id = req.params.id;
            const { nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago } = req.body;

            const metodosPagoPermitidos = ['Nequi', 'DaviPlata', 'Efectivo', 'Tarjeta'];
            if (!metodosPagoPermitidos.includes(metodo_pago)) {
                return res.status(400).json({ message: 'Método de pago no válido' });
            }

            const pago = await Pago.findByPk(id);
            if (!pago) {
                return res.status(404).json({ message: 'Pago no encontrado' });
            }

            await pago.update({ nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago });
            res.status(200).json(pago);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el pago: ' + error.message });
        }
    }

    static async deletePago(req, res) {
        try {
            const id = req.params.id;
            const rowsDeleted = await Pago.destroy({ where: { id_pago: id } });

            if (rowsDeleted > 0) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Pago no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el pago: ' + error.message });
        }
    }
}

export default PagoController;