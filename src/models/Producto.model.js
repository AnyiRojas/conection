import { DataTypes, Model, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class Producto extends Model {
    static async createProducto(producto) {
        try {
            const { nombre_producto, descripcion_producto, precio_producto, estado_producto, tipo_producto, foto_Producto, foto_ProductoURL } = producto;
            return await sequelize.query(
                'CALL CreateProducto(:nombre_producto, :descripcion_producto, :precio_producto, :estado_producto, :tipo_producto, :foto_Producto, :foto_ProductoURL)',
                {
                    replacements: { nombre_producto, descripcion_producto, precio_producto, estado_producto, tipo_producto, foto_Producto, foto_ProductoURL },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {
            console.error(`Unable to create producto: ${error}`);
            throw error;
        }
    }

    static async getProductos() {
        try {
            return await sequelize.query('CALL GetProductos()', { type: QueryTypes.RAW });
        } catch (error) {
            console.error(`Unable to find all productos: ${error}`);
            throw error;
        }
    }

    static async getProductoById(id) {
        try {
            const result = await sequelize.query('CALL GetProductoById(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
            return result[0];
        } catch (error) {
            console.error(`Unable to find producto by id: ${error}`);
            throw error;
        }
    }

    static async updateProducto(id, updatedProducto) {
        try {
            const { nombre_producto, descripcion_producto, precio_producto, estado_producto, tipo_producto, foto_Producto, foto_ProductoURL } = updatedProducto;
            return await sequelize.query(
                'CALL UpdateProducto(:id, :nombre_producto, :descripcion_producto, :precio_producto, :estado_producto, :tipo_producto, :foto_Producto, :foto_ProductoURL)',
                {
                    replacements: { id, nombre_producto, descripcion_producto, precio_producto, estado_producto, tipo_producto, foto_Producto, foto_ProductoURL },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {
            console.error(`Unable to update producto: ${error}`);
            throw error;
        }
    }

    static async toggleProductoState(id) {
        try {
            return await sequelize.query('CALL ToggleProductoState(:id)', {
                replacements: { id },
                type: QueryTypes.RAW
            });
        } catch (error) {
            console.error(`Unable to toggle producto state: ${error}`);
            throw error;
        }
    }
}

Producto.init({
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_producto: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    foto_Producto: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    foto_ProductoURL: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    descripcion_producto: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    precio_producto: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    estado_producto: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    tipo_producto: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Producto',
    timestamps: false,
    underscored: false,
});

export { Producto };