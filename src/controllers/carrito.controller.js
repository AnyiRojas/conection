import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class CarritoController {
    // Crear un nuevo carrito para un usuario
    static async postCarrito(req, res) {
        try {
            const { usuario_id } = req.body;

            // Validar el ID de usuario
            if (!usuario_id) {
                return res.status(400).json({ message: 'ID de usuario es requerido' });
            }

            await sequelize.query('CALL CreateCarrito(:usuario_id)', {
                replacements: { usuario_id },
                type: QueryTypes.RAW
            });
            res.status(201).json({ message: 'Carrito creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el carrito: ' + error.message });
        }
    }

    // Agregar un producto al carrito
    static async addProductoToCarrito(req, res) {
        const { carrito_id } = req.params;
        const { producto_id, cantidad } = req.body;

        if (!carrito_id || !producto_id || !cantidad) {
            return res.status(400).json({ message: 'ID de carrito, ID de producto y cantidad son requeridos' });
        }

        try {
            // Llamar al procedimiento almacenado para agregar producto al carrito
            await sequelize.query('CALL AddProductoToCarrito(:carrito_id, :producto_id, :cantidad)', {
                replacements: { carrito_id, producto_id, cantidad },
                type: QueryTypes.RAW
            });

            res.status(200).json({ message: 'Producto añadido al carrito' });
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
        }
    }

    // Obtener el contenido del carrito
    static async getCarritoContent(req, res) {
        const { carrito_id } = req.params;

        if (!carrito_id) {
            return res.status(400).json({ message: 'ID de carrito es requerido' });
        }

        try {
            const result = await sequelize.query('CALL GetCarritoContent(:carrito_id)', {
                replacements: { carrito_id },
                type: QueryTypes.RAW
            });

            if (result.length === 0) {
                return res.status(404).json({ message: 'Carrito vacío o no encontrado' });
            }

            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el contenido del carrito', error });
        }
    }

    // Eliminar un producto del carrito
    static async removeProductoFromCarrito(req, res) {
        try {
            const { carrito_id, producto_id } = req.params;

            // Validar los parámetros
            if (!carrito_id || !producto_id) {
                return res.status(400).json({ message: 'ID de carrito e ID de producto son requeridos' });
            }

            await sequelize.query('CALL RemoveProductoFromCarrito(:carrito_id, :producto_id)', {
                replacements: { carrito_id, producto_id },
                type: QueryTypes.RAW
            });
            res.status(200).json({ message: 'Producto eliminado del carrito correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el producto del carrito: ' + error.message });
        }
    }

}

export default CarritoController;
