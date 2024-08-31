import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Informe_Pedidos } from './Informe_Pedidos.model.js';
import { Historial_Pedidos } from './Historial_Pedidos.model.js';

class Pedido_Venta extends Model {
    static async createPedidoVenta(informe_id, historial_id) {
        try {
            await sequelize.query('CALL CreatePedidoVenta(:informe_id, :historial_id)', {
                replacements: { informe_id, historial_id },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to create Pedido_Venta: ${error}`);
            throw error;
        }
    }

    static async getPedidoVentas() {
        try {
            const result = await sequelize.query('CALL GetPedidoVentas()', { type: QueryTypes.SELECT });
            return result;
        } catch (error) {
            console.error(`Unable to find all Pedido_Venta records: ${error}`);
            throw error;
        }
    }

    static async getPedidoVentaById(id) {
        try {
            const result = await sequelize.query('CALL GetPedidoVentaById(:id)', {
                replacements: { id },
                type: QueryTypes.SELECT
            });
            return result[0];
        } catch (error) {
            console.error(`Unable to find Pedido_Venta by id: ${error}`);
            throw error;
        }
    }

    static async updatePedidoVenta(id, informe_id, historial_id) {
        try {
            await sequelize.query('CALL UpdatePedidoVenta(:id, :informe_id, :historial_id)', {
                replacements: { id, informe_id, historial_id },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to update the Pedido_Venta: ${error}`);
            throw error;
        }
    }
}

Pedido_Venta.init({
    id_pedido_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    informe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Informe_Pedidos,
            key: 'id_informe'
        }
    },
    historial_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Historial_Pedidos,
            key: 'id_historial'
        }
    }
}, {
    sequelize,
    tableName: 'Pedido_Venta',
    timestamps: false,
    underscored: false,
});

Informe_Pedidos.hasMany(Pedido_Venta, { foreignKey: 'informe_id' });
Pedido_Venta.belongsTo(Informe_Pedidos, { foreignKey: 'informe_id' });

Historial_Pedidos.hasMany(Pedido_Venta, { foreignKey: 'historial_id' });
Pedido_Venta.belongsTo(Historial_Pedidos, { foreignKey: 'historial_id' });

export { Pedido_Venta };
