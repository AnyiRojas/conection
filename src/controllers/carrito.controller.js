import { Carrito } from '../models/Carrito.models.js';
import { Producto } from '../models/Producto.model.js';

// Controlador para manejar las operaciones del carrito
class CarritoController {

    // Añadir producto al carrito
    static async addProductoToCarrito(req, res) {
        try {
            const { carrito_id, producto_id, cantidad } = req.body;

            const carrito = await Carrito.findByPk(carrito_id);
            if (!carrito) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            const producto = await Producto.findByPk(producto_id);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            const detalle = await CarritoDetalle.findOne({
                where: { carrito_id, producto_id }
            });

            if (detalle) {
                detalle.cantidad += cantidad;
                await detalle.save();
            } else {
                await CarritoDetalle.create({ carrito_id, producto_id, cantidad });
            }

            res.status(200).json({ message: 'Producto agregado al carrito' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async removeProductoFromCarrito(req, res) {
        try {
            const { carrito_id, producto_id } = req.params;

            const carrito = await Carrito.findByPk(carrito_id);
            if (!carrito) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            const producto = await Producto.findByPk(producto_id);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            const detalle = await CarritoDetalle.findOne({
                where: { carrito_id, producto_id }
            });

            if (detalle) {
                await detalle.destroy();
                res.status(200).json({ message: 'Producto eliminado del carrito' });
            } else {
                res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCarritoByUsuarioId(req, res) {
        try {
            const { usuario_id } = req.params;

            const carrito = await Carrito.findOne({
                where: { usuario_id },
                include: [Producto] 
            });

            if (carrito) {
                res.status(200).json(carrito);
            } else {
                res.status(404).json({ message: 'Carrito no encontrado para el usuario' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default CarritoController;