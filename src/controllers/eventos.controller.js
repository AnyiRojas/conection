import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { sequelize } from '../config/db.js';
import { QueryTypes } from 'sequelize';
import { Evento } from '../models/Eventos.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EventoController {
    // Obtener todos los eventos
    static async getEventos(req, res) {
        try {
            const eventos = await sequelize.query('CALL GetAllEventos()', { type: QueryTypes.RAW });
            res.json(eventos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los eventos', error });
        }
    }

    // Obtener un evento por tipo
    static async getEventoByTipo(req, res) {
        const { tipo_evento } = req.params;
        try {
            const evento = await Evento.getEventoByTipo(tipo_evento);
            if (!evento) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }
            res.json(evento);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el evento', error });
        }
    }

    // Agregar un nuevo evento
    static async addEvento(req, res) {
        try {
            if (!req.files || !req.files.foto_evento) {
                return res.status(400).json({ message: 'No se subió ningún archivo' });
            }

            const uploadedFile = req.files.foto_evento;
            const timestamp = Date.now();
            const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
            const uploadPath = path.join(__dirname, '../uploads/img/evento/', uniqueFileName);
            const foto_eventoURL = `http://localhost:4000/uploads/img/evento/${uniqueFileName}`;

            uploadedFile.mv(uploadPath, async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al subir la imagen: ' + err });
                }

                const { tipo_evento, fecha_evento, descripcion_evento } = req.body;

                await sequelize.query('CALL AddEvento(:tipo_evento, :fecha_evento, :descripcion_evento, :foto_evento, :foto_eventoURL)', {
                    replacements: {
                        tipo_evento,
                        fecha_evento,
                        descripcion_evento,
                        foto_evento: `./uploads/img/evento/${uniqueFileName}`,
                        foto_eventoURL
                    },
                    type: QueryTypes.RAW
                });

                res.status(201).json({ message: 'Evento agregado exitosamente' });
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar el evento', error });
        }
    }

    // Actualizar un evento específico por tipo
    static async updateEvento(req, res) {
        try {
            // Obtener el ID del evento desde los parámetros
            const id_evento = parseInt(req.params.id_evento, 10);
            // Verificar que el ID sea un número entero válido
            if (isNaN(id_evento)) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            // Obtener los datos del cuerpo de la solicitud
            const { nuevo_tipo_evento, fecha_evento, descripcion_evento } = req.body;
            // Obtener el evento existente por ID
            const eventoExistente = await Evento.findByPk(id_evento);
            if (!eventoExistente) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }
            // Manejo de archivo de imagen (si se proporciona)
            if (req.files && req.files.foto_evento) {
                const uploadedFile = req.files.foto_evento;
                const timestamp = Date.now();
                const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
                const uploadPath = path.join(__dirname, '../uploads/img/evento/', uniqueFileName);
                const foto_eventoURL = `http://localhost:4000/uploads/img/evento/${uniqueFileName}`;
    
                uploadedFile.mv(uploadPath, async (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error al mover el archivo: ' + err });
                    }
    
                    // Eliminar la imagen antigua si existe
                    if (eventoExistente.foto_evento) {
                        const oldImagePath = path.join(__dirname, '..', eventoExistente.foto_evento);
                        if (fs.existsSync(oldImagePath)) {
                            try {
                                fs.unlinkSync(oldImagePath);
                                console.log('Imagen anterior eliminada:', oldImagePath);
                            } catch (unlinkError) {
                                console.error('Error al eliminar la imagen anterior:', unlinkError);
                            }
                        }
                    }
                    // Actualizar el evento con los nuevos datos
                    await Evento.update(
                        {
                            tipo_evento: nuevo_tipo_evento || eventoExistente.tipo_evento,
                            fecha_evento,
                            descripcion_evento,
                            foto_evento: `./uploads/img/evento/${uniqueFileName}`,
                            foto_eventoURL
                        },
                        {
                            where: { id_evento }
                        }
                    );
    
                    res.status(200).json({ message: 'Evento actualizado exitosamente' });
                });
            } else {
                // Actualizar el evento sin nueva imagen
                await Evento.update(
                    {
                        tipo_evento: nuevo_tipo_evento || eventoExistente.tipo_evento,
                        fecha_evento,
                        descripcion_evento,
                        foto_evento: eventoExistente.foto_evento,
                        foto_eventoURL: eventoExistente.foto_eventoURL
                    },
                    {
                        where: { id_evento }
                    }
                );
    
                res.status(200).json({ message: 'Evento actualizado exitosamente' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el evento', error });
        }
    }

    // Eliminar un evento específico por ID
    static async deleteEvento(req, res) {
        try {
            const { id_evento } = req.params;
            const evento = await Evento.findByPk(id_evento);

            if (!evento) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }

            if (evento.foto_evento) {
                const oldImagePath = path.join(__dirname, '..', evento.foto_evento);
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                        console.log('Imagen eliminada:', oldImagePath);
                    } catch (unlinkError) {
                        console.error('Error al eliminar la imagen:', unlinkError);
                    }
                }
            }

            await Evento.deleteEvento(id_evento);
            res.status(200).json({ message: 'Evento eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el evento', error });
        }
    }
}

export default EventoController;