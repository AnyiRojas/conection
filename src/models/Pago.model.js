import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Pago extends Model {
    static async createPago(pago) {
        try {
            return await sequelize.query('CALL CreatePago(:nombre_pago, :fecha_pago, :iva, :metodo_pago, :subtotal_pago, :total_pago)', {
                replacements: pago,
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to create Pago: ${error}`);
            throw error;
        }
    }

    static async getPagos() {
        try {
            return await sequelize.query('CALL GetPagos()', { type: QueryTypes.RAW });
        } catch (error) {
            console.error(`Unable to find all Pagos: ${error}`);
            throw error;
        }
    }

    static async getPagoById(id) {
        try {
            const result = await sequelize.query('CALL GetPagoById(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
            return result[0]; 
        } catch (error) {
            console.error(`Unable to find Pago by id: ${error}`);
            throw error;
        }
    }

    static async updatePago(id, updatedPago) {
        try {
            const { nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago } = updatedPago;
            return await sequelize.query('CALL UpdatePago(:id, :nombre_pago, :fecha_pago, :iva, :metodo_pago, :subtotal_pago, :total_pago)', {
                replacements: { id, nombre_pago, fecha_pago, iva, metodo_pago, subtotal_pago, total_pago },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to update Pago: ${error}`);
            throw error;
        }
    }

    static async deletePago(id) {
        try {
            return await sequelize.query('CALL DeletePago(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to delete Pago: ${error}`);
            throw error;
        }
    }
}

Pago.init({
    id_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_pago: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false
    },
    iva: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    metodo_pago: {
        type: DataTypes.ENUM('Nequi', 'DaviPlata', 'Efectivo', 'Tarjeta'),
        allowNull: false
    },
    subtotal_pago: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    },
    total_pago: {
        type: DataTypes.BIGINT(15),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Pago',
    timestamps: false,
    underscored: false,
});

export { Pago };