import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { QueryTypes } from 'sequelize';

class Evento extends Model {
    static async createEvento(evento) {
        try {
            const result = await sequelize.query(
                'CALL AddEvento(:tipo_evento, :fecha_evento, :descripcion_evento, :foto_evento, :foto_eventoURL)',
                {
                    replacements: {
                        tipo_evento: evento.tipo_evento,
                        fecha_evento: evento.fecha_evento,
                        descripcion_evento: evento.descripcion_evento,
                        foto_evento: evento.foto_evento,
                        foto_eventoURL: evento.foto_eventoURL
                    },
                    type: QueryTypes.RAW
                }
            );
            return result[0]; // Devuelve los datos de eventos
        } catch (error) {
            console.error(`Unable to create evento: ${error}`);
            throw error;
        }
    }

    static async getEventos() {
        try {
            const eventos = await sequelize.query('CALL GetAllEventos()', { type: QueryTypes.RAW });
            return eventos[0]; 
        } catch (error) {
            console.error(`Unable to find all eventos: ${error}`);
            throw error;
        }
    }

    static async getEventoById(id_evento) {
        try {
            const evento = await sequelize.query(
                'CALL GetEventoById(:id_evento)',
                {
                    replacements: { id_evento },
                    type: QueryTypes.RAW
                }
            );
            return evento[0][0];
        } catch (error) {
            console.error(`Unable to find evento by id_evento: ${error}`);
            throw error;
        }
    }

    static async updateEvento(id_evento, evento) {
        try {
            const result = await sequelize.query(
                'CALL UpdateEvento(:id_evento, :tipo_evento, :fecha_evento, :descripcion_evento, :foto_evento, :foto_eventoURL)',
                {
                    replacements: {
                        id_evento,
                        tipo_evento: evento.tipo_evento,
                        fecha_evento: evento.fecha_evento,
                        descripcion_evento: evento.descripcion_evento,
                        foto_evento: evento.foto_evento,
                        foto_eventoURL: evento.foto_eventoURL
                    },
                    type: QueryTypes.RAW
                }
            );
            return result[0];
        } catch (error) {
            console.error(`Unable to update evento: ${error}`);
            throw error;
        }
    }

    static async deleteEvento(id_evento) {
        try {
            const result = await sequelize.query(
                'CALL DeleteEvento(:id_evento)',
                {
                    replacements: { id_evento },
                    type: QueryTypes.RAW
                }
            );
            return result[0];
        } catch (error) {
            console.error(`Unable to delete evento: ${error}`);
            throw error;
        }
    }
}

Evento.init({
    id_evento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_evento: {
        type: DataTypes.ENUM('Matrimonio', 'Aniversario', 'Cumpleaños', 'Fiesta', 'Otro'),
        allowNull: false
    },
    descripcion_evento: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_evento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    foto_evento: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    foto_eventoURL: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'Evento',
    timestamps: false,
    underscored: false,
});

export { Evento };