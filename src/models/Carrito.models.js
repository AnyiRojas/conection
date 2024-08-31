import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Producto } from './Producto.model.js'; 

class Carrito extends Model {
    static async createCarrito(usuario_id) {
        try {
            const result = await sequelize.query('CALL CreateCarrito(:usuario_id)', {
                replacements: { usuario_id },
                type: sequelize.QueryTypes.RAW
            });
            return result;
        } catch (error) {
            console.error(`Error al crear carrito: ${error.message}`);
            throw error;
        }
    }

    static async getCarritoByUsuarioId(usuario_id) {
        try {
            const result = await sequelize.query(
                'CALL GetCarritoContent((SELECT id_carrito FROM Carrito WHERE usuario_id = :usuario_id))',
                {
                    replacements: { usuario_id },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            return result;
        } catch (error) {
            console.error(`Error al obtener el contenido del carrito: ${error.message}`);
            throw error;
        }
    }

    static async addProductoToCarrito(carrito_id, producto_id, cantidad) {
        try {
            const result = await sequelize.query('CALL AddProductoToCarrito(:carrito_id, :producto_id, :cantidad)', {
                replacements: { carrito_id, producto_id, cantidad },
                type: sequelize.QueryTypes.RAW
            });
            return result;
        } catch (error) {
            console.error(`Error al agregar producto al carrito: ${error.message}`);
            throw error;
        }
    }

    static async updateProductoInCarrito(carrito_id, producto_id, cantidad) {
        try {
            const result = await sequelize.query('CALL UpdateProductoInCarrito(:carrito_id, :producto_id, :cantidad)', {
                replacements: { carrito_id, producto_id, cantidad },
                type: sequelize.QueryTypes.RAW
            });
            return result;
        } catch (error) {
            console.error(`Error al actualizar producto en el carrito: ${error.message}`);
            throw error;
        }
    }

    static async removeProductoFromCarrito(carrito_id, producto_id) {
        try {
            const result = await sequelize.query('CALL RemoveProductoFromCarrito(:carrito_id, :producto_id)', {
                replacements: { carrito_id, producto_id },
                type: sequelize.QueryTypes.RAW
            });
            return result;
        } catch (error) {
            console.error(`Error al eliminar producto del carrito: ${error.message}`);
            throw error;
        }
    }
}

Carrito.init({
    id_carrito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'id_usuario'
        }
    },
    fecha_creacion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Carrito',
    timestamps: false,
    underscored: false,
});

Carrito.hasMany(Producto, { foreignKey: 'carrito_id' }); 
Producto.belongsTo(Carrito, { foreignKey: 'carrito_id' });

export { Carrito };