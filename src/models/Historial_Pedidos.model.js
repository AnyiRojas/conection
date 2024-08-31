import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuario } from "./Usuario.model.js";

class Historial_Pedidos extends Model {
    static async createHistorial(historial) {
        try {
            return await this.create(historial);
        } catch (error) {
            console.error(`Unable to create Historial_Pedidos: ${error}`);
            throw error;
        }
    }

    static async getHistoriales() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all Historial_Pedidos: ${error}`);
            throw error;
        }
    }

    static async getHistorialById(id) {
        try {
            return await this.findByPk(id);
        } catch (error) {
            console.error(`Unable to find Historial_Pedidos by id: ${error}`);
            throw error;
        }
    }

    static async updateHistorial(id, updatedHistorial) {
        try {
            const historial = await this.findByPk(id);
            if (historial) {
                return await historial.update(updatedHistorial);
            }
            throw new Error('Historial de pedido no encontrado');
        } catch (error) {
            console.error(`Unable to update Historial_Pedidos: ${error}`);
            throw error;
        }
    }
}

Historial_Pedidos.init({
    id_historial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_consulta: {
        type: DataTypes.DATE,
        allowNull: false
    },
    detalles_pedido: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    }
}, {
    sequelize,
    tableName: 'Historial_Pedidos',
    timestamps: false,
    underscored: false,
});

Usuario.hasMany(Historial_Pedidos, { foreignKey: 'usuario_id' });
Historial_Pedidos.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export { Historial_Pedidos };