import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Pedido } from './Pedido.model.js';
import { Producto } from './Producto.model.js';

class Detalle_Pedido extends Model {
    static async createDetallePedido(cantidad, precio_unitario, pedido_id, producto_id) {
        try {
            await sequelize.query('CALL CreateDetallePedido(:cantidad, :precio_unitario, :pedido_id, :producto_id)', {
                replacements: { cantidad, precio_unitario, pedido_id, producto_id },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to create Detalle_Pedido: ${error}`);
            throw error;
        }
    }

    static async getDetallesPedidos() {
        try {
            const [result] = await sequelize.query('CALL GetAllDetallesPedidos()', { type: QueryTypes.RAW });
            return result;
        } catch (error) {
            console.error(`Unable to find all Detalles_Pedidos: ${error}`);
            throw error;
        }
    }

    static async getDetallePedidoById(id) {
        try {
            const [result] = await sequelize.query('CALL GetDetallePedidoById(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
            return result[0];
        } catch (error) {
            console.error(`Unable to find Detalle_Pedido by id: ${error}`);
            throw error;
        }
    }

    static async updateDetallePedido(id, cantidad, precio_unitario, pedido_id, producto_id) {
        try {
            const [result] = await sequelize.query('CALL UpdateDetallePedido(:id, :cantidad, :precio_unitario, :pedido_id, :producto_id)', {
                replacements: { id, cantidad, precio_unitario, pedido_id, producto_id },
                type: QueryTypes.RAW
            });
            return result[1].affectedRows;
        } catch (error) {
            console.error(`Unable to update Detalle_Pedido: ${error}`);
            throw error;
        }
    }

    static async deleteDetallePedido(id) {
        try {
            const [result] = await sequelize.query('CALL DeleteDetallePedido(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
            return result[1].affectedRows;
        } catch (error) {
            console.error(`Unable to delete Detalle_Pedido: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo en Sequelize
Detalle_Pedido.init({
    id_detalle_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unitario: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pedido,
            key: 'id_pedido'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id_producto'
        }
    }
}, {
    sequelize,
    tableName: 'Detalle_Pedido',
    timestamps: false,
    underscored: false,
});

Pedido.hasMany(Detalle_Pedido, { foreignKey: 'pedido_id' });
Detalle_Pedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Producto.hasMany(Detalle_Pedido, { foreignKey: 'producto_id' });
Detalle_Pedido.belongsTo(Producto, { foreignKey: 'producto_id' });

export { Detalle_Pedido };