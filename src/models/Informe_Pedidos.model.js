import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";

class Informe_Pedidos extends Model {
    static async createInforme(informe) {
        try {
            return await sequelize.query('CALL CreateInforme(:fecha_generacion, :tipo_informe, :datos_analisis)', {
                replacements: informe,
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to create Informe_Pedidos: ${error}`);
            throw error;
        }
    }

    static async getInformes() {
        try {
            return await sequelize.query('CALL GetInformes()', { type: QueryTypes.RAW });
        } catch (error) {
            console.error(`Unable to find all Informes_Pedidos: ${error}`);
            throw error;
        }
    }

    static async getInformeById(id) {
        try {
            const result = await sequelize.query('CALL GetInformeById(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
            return result[0];
        } catch (error) {
            console.error(`Unable to find Informe_Pedidos by id: ${error}`);
            throw error;
        }
    }

    static async updateInforme(id, updatedInforme) {
        try {
            const { fecha_generacion, tipo_informe, datos_analisis } = updatedInforme;
            return await sequelize.query('CALL UpdateInforme(:id, :fecha_generacion, :tipo_informe, :datos_analisis)', {
                replacements: { id, fecha_generacion, tipo_informe, datos_analisis },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to update Informe_Pedidos: ${error}`);
            throw error;
        }
    }
}

Informe_Pedidos.init({
    id_informe: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_generacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo_informe: {
        type: DataTypes.ENUM('Informe Diario', 'Informe Semanal', 'Informe Quincenal', 'Informe Mensual'),
        allowNull: false
    },
    datos_analisis: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Informe_Pedidos',
    timestamps: false,
    underscored: false,
});

export { Informe_Pedidos };