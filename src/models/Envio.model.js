import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Pedido } from './Pedido.model.js';

class Envio extends Model {
    static async createEnvio(fecha_envio, estado_envio, pedido_id) {
        try {
            await sequelize.query('CALL CreateEnvio(:fecha_envio, :estado_envio, :pedido_id)', {
                replacements: { fecha_envio, estado_envio, pedido_id },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to create Envio: ${error}`);
            throw error;
        }
    }

    static async getEnvios() {
        try {
            const [results] = await sequelize.query('CALL GetAllEnvios()', { type: QueryTypes.RAW });
            return results;
        } catch (error) {
            console.error(`Unable to find all Envios: ${error}`);
            throw error;
        }
    }

    static async getEnvioById(id) {
        try {
            const [results] = await sequelize.query('CALL GetEnvioById(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
            return results[0];
        } catch (error) {
            console.error(`Unable to find Envio by id: ${error}`);
            throw error;
        }
    }

    static async updateEnvio(id, fecha_envio, estado_envio, pedido_id) {
        try {
            await sequelize.query('CALL UpdateEnvio(:id, :fecha_envio, :estado_envio, :pedido_id)', {
                replacements: { id, fecha_envio, estado_envio, pedido_id },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to update Envio: ${error}`);
            throw error;
        }
    }

    static async deleteEnvio(id) {
        try {
            await sequelize.query('CALL DeleteEnvio(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to delete Envio: ${error}`);
            throw error;
        }
    }
}

Envio.init({
    id_envio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_envio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado_envio: {
        type: DataTypes.ENUM('Preparando', 'En camino', 'Entregado', 'Retrasado'),
        allowNull: false
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pedido,
            key: 'id_pedido'
        }
    }
}, {
    sequelize,
    modelName: 'Envio',
    tableName: 'Envio',
    timestamps: false,
    underscored: false,
});

Pedido.hasMany(Envio, { foreignKey: 'pedido_id' });
Envio.belongsTo(Pedido, { foreignKey: 'pedido_id' });

export { Envio };