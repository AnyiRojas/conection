import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Usuario } from './Usuario.model.js';
import { Pago } from './Pago.model.js';

class Pedido extends Model {
    static async createPedido(pedidoData) {
        const {
            fecha_pedido,
            estado_pedido,
            total_pagado,
            usuario_id,
            pago_id,
            foto_Pedido,
            foto_PedidoURL
        } = pedidoData;

        return await sequelize.query(
            'CALL CreatePedido(:fecha_pedido, :estado_pedido, :total_pagado, :usuario_id, :pago_id, :foto_Pedido, :foto_PedidoURL)',
            {
                replacements: { fecha_pedido, estado_pedido, total_pagado, usuario_id, pago_id, foto_Pedido, foto_PedidoURL },
                type: DataTypes.RAW,
            }
        );
    }

    static async getPedidos() {
        return await sequelize.query('CALL GetPedidos()', { type: DataTypes.SELECT });
    }

    static async getPedidoById(id_pedido) {
        const result = await sequelize.query(
            'CALL GetPedidoById(:id_pedido)',
            { replacements: { id_pedido }, type: DataTypes.SELECT }
        );
        return result[0];
    }

    static async updatePedido(id_pedido, updatedData) {
        const {
            fecha_pedido,
            estado_pedido,
            total_pagado,
            usuario_id,
            pago_id,
            foto_Pedido,
            foto_PedidoURL
        } = updatedData;

        return await sequelize.query(
            'CALL UpdatePedido(:id_pedido, :fecha_pedido, :estado_pedido, :total_pagado, :usuario_id, :pago_id, :foto_Pedido, :foto_PedidoURL)',
            {
                replacements: { id_pedido, fecha_pedido, estado_pedido, total_pagado, usuario_id, pago_id, foto_Pedido, foto_PedidoURL },
                type: DataTypes.RAW,
            }
        );
    }
}

Pedido.init({
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado_pedido: {
        type: DataTypes.ENUM('Pendiente', 'Enviado', 'Entregado', 'Cancelado'),
        allowNull: false
    },
    total_pagado: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    foto_Pedido: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    foto_PedidoURL: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    },
    pago_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pago,
            key: 'id_pago'
        }
    }
}, {
    sequelize,
    tableName: 'Pedido',
    timestamps: false,
    underscored: false,
});

Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Pago.hasMany(Pedido, { foreignKey: 'pago_id' });
Pedido.belongsTo(Pago, { foreignKey: 'pago_id' });

export { Pedido };
