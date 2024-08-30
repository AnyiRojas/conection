import { Model, DataTypes } from 'sequelize'; 
import { sequelize } from '../config/db.js';
import { Usuario } from './Usuario.model.js';
import { Producto } from './Producto.model.js';

class Carrito extends Model {
    // Método para agregar un producto al carrito
    static async addProductoToCarrito(carrito) {
        try {
            const usuario = await Usuario.findByPk(carrito.usuario_id);
            const producto = await Producto.findByPk(carrito.producto_id);
    
            if (!usuario || !producto) {
                throw new Error('Usuario o Producto no encontrado');
            }
    
            return await this.create(carrito);
        } catch (error) {
            console.error(`Unable to add product to carrito: ${error}`);
            throw error;
        }
    }

    // Método para obtener todos los productos en el carrito de un usuario
    static async getCarritoByUsuarioId(usuario_id) {
        try {
            return await this.findAll({ where: { usuario_id } });
        } catch (error) {
            console.error(`Unable to find carrito by usuario id: ${error}`);
            throw error;
        }
    }

    // Método para eliminar un producto del carrito
    static async removeProductoFromCarrito(id) {
        try {
            const carrito = await this.findByPk(id);
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }
            return await carrito.destroy();
        } catch (error) {
            console.error(`Unable to remove product from carrito: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo Carrito en Sequelize
Carrito.init({
    id_carrito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
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
    tableName: 'Carrito',
    timestamps: false,
    underscored: false,
});

// Relaciones
Usuario.hasMany(Carrito, { foreignKey: 'usuario_id' });
Carrito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Producto.hasMany(Carrito, { foreignKey: 'producto_id' });
Carrito.belongsTo(Producto, { foreignKey: 'producto_id' });

export { Carrito };
