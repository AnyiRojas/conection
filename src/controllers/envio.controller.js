import { Envio } from '../models/Envio.model.js';

class EnvioController {
    static async getEnvios(req, res) {
        try {
            const envios = await Envio.getEnvios();
            res.json(envios);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los envíos', error });
        }
    }

    static async getEnvio(req, res) {
        const { id } = req.params;
        try {
            const envio = await Envio.getEnvioById(id);
            if (envio) {
                res.json(envio);
            } else {
                res.status(404).json({ message: 'Envío no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el envío', error });
        }
    }

    static async postEnvio(req, res) {
        try {
            const { fecha_envio, estado_envio, pedido_id } = req.body;

            const estadosEnvioPermitidos = ['Preparando', 'En camino', 'Entregado', 'Retrasado'];
            if (!estadosEnvioPermitidos.includes(estado_envio)) {
                return res.status(400).json({ message: 'Estado de envío no válido' });
            }

            await Envio.createEnvio({ fecha_envio, estado_envio, pedido_id });
            res.status(201).json({ message: 'Envío creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el envío: ' + error.message });
        }
    }

    static async putEnvio(req, res) {
        try {
            const id = req.params.id;
            const { fecha_envio, estado_envio, pedido_id } = req.body;

            const estadosEnvioPermitidos = ['Preparando', 'En camino', 'Entregado', 'Retrasado'];
            if (!estadosEnvioPermitidos.includes(estado_envio)) {
                return res.status(400).json({ message: 'Estado de envío no válido' });
            }

            const envio = await Envio.getEnvioById(id);
            if (!envio) {
                return res.status(404).json({ message: 'Envío no encontrado' });
            }

            await Envio.updateEnvio(id, fecha_envio, estado_envio, pedido_id);
            res.status(200).json({ message: 'Envío actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el envío: ' + error.message });
        }
    }

    static async deleteEnvio(req, res) {
        try {
            const id = req.params.id;
            const envio = await Envio.getEnvioById(id);
            if (!envio) {
                return res.status(404).json({ message: 'Envío no encontrado' });
            }

            await Envio.deleteEnvio(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el envío: ' + error.message });
        }
    }
}

export default EnvioController;