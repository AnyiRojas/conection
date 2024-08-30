import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Evento extends Model {
    // Método para crear un nuevo evento
    static async createEvento(evento) {
        try {
            return await this.create(evento);
        } catch (error) {
            console.error(`Unable to create evento: ${error}`);
            throw error;
        }
    }

    // Método para obtener todos los eventos
    static async getEventos() {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(`Unable to find all eventos: ${error}`);
            throw error;
        }
    }

    // Método para obtener un evento por tipo
    static async getEventoByTipo(tipo_evento) {
        try {
            return await this.findOne({ where: { tipo_evento } });
        } catch (error) {
            console.error(`Unable to find evento by tipo_evento: ${error}`);
            throw error;
        }
    }

    // Método para actualizar un evento
    static async updateEvento(id_evento, evento) {
        try {
            const eventoExistente = await this.findByPk(id_evento);

            if (!eventoExistente) {
                throw new Error('Evento no encontrado');
            }

            await eventoExistente.update(evento);
            return eventoExistente;
        } catch (error) {
            console.error(`Unable to update evento: ${error}`);
            throw error;
        }
    }

    // Método para eliminar un evento
    static async deleteEvento(id_evento) {
        try {
            const evento = await this.findByPk(id_evento);
            if (!evento) {
                throw new Error('Evento no encontrado');
            }
            await evento.destroy();
            return { message: 'Evento eliminado exitosamente' };
        } catch (error) {
            console.error(`Unable to delete the evento: ${error}`);
            throw error;
        }
    }
}

// Definición del modelo Evento en Sequelize
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