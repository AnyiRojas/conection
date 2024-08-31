import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Evento } from '../models/Eventos.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EventoController {
    static async getEventos(req, res) {
        try {
            const eventos = await Evento.getEventos();
            res.json(eventos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los eventos', error });
        }
    }

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

                const newEvento = await Evento.createEvento({
                    tipo_evento,
                    fecha_evento,
                    descripcion_evento,
                    foto_evento: `./uploads/img/evento/${uniqueFileName}`,
                    foto_eventoURL
                });

                res.status(201).json(newEvento);
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar el evento', error });
        }
    }

    static async updateEvento(req, res) {
        try {
            const id_evento = parseInt(req.params.id_evento, 10);
            if (isNaN(id_evento)) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            const { nuevo_tipo_evento, fecha_evento, descripcion_evento } = req.body;
            const eventoExistente = await Evento.findByPk(id_evento);
            if (!eventoExistente) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }
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
                    const updatedEvento = await Evento.updateEvento(id_evento, {
                        tipo_evento: nuevo_tipo_evento || eventoExistente.tipo_evento,
                        fecha_evento,
                        descripcion_evento,
                        foto_evento: `./uploads/img/evento/${uniqueFileName}`,
                        foto_eventoURL
                    });
    
                    res.status(200).json(updatedEvento);
                });
            } else {
                const updatedEvento = await Evento.updateEvento(id_evento, {
                    tipo_evento: nuevo_tipo_evento || eventoExistente.tipo_evento,
                    fecha_evento,
                    descripcion_evento,
                    foto_evento: eventoExistente.foto_evento,
                    foto_eventoURL: eventoExistente.foto_eventoURL
                });
    
                res.status(200).json(updatedEvento);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el evento', error });
        }
    }

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