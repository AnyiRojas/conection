import { Informe_Pedidos } from '../models/Informe_Pedidos.model.js';

class InformePedidosController {
    static async getInformes(req, res) {
        try {
            const informes = await Informe_Pedidos.findAll();
            res.json(informes);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los informes', error });
        }
    }

    static async getInforme(req, res) {
        const { id } = req.params;
        try {
            const informe = await Informe_Pedidos.findByPk(id);
            if (informe) {
                res.json(informe);
            } else {
                res.status(404).json({ message: 'Informe no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el informe', error });
        }
    }

    static async postInforme(req, res) {
        try {
            const { fecha_generacion, tipo_informe, datos_analisis } = req.body;

            const tiposInformePermitidos = ['Informe Diario', 'Informe Semanal', 'Informe Quincenal', 'Informe Mensual'];
            if (!tiposInformePermitidos.includes(tipo_informe)) {
                return res.status(400).json({ message: 'Tipo de informe no válido' });
            }

            await Informe_Pedidos.create({ fecha_generacion, tipo_informe, datos_analisis });
            res.status(201).json({ message: 'Informe creado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el informe: ' + error.message });
        }
    }

    static async putInforme(req, res) {
        try {
            const id = req.params.id;
            const { fecha_generacion, tipo_informe, datos_analisis } = req.body;

            const tiposInformePermitidos = ['Informe Diario', 'Informe Semanal', 'Informe Quincenal', 'Informe Mensual'];
            if (!tiposInformePermitidos.includes(tipo_informe)) {
                return res.status(400).json({ message: 'Tipo de informe no válido' });
            }

            const informe = await Informe_Pedidos.findByPk(id);
            if (!informe) {
                return res.status(404).json({ message: 'Informe no encontrado' });
            }

            await informe.update({ fecha_generacion, tipo_informe, datos_analisis });
            res.status(200).json({ message: 'Informe actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el informe: ' + error.message });
        }
    }
}

export default InformePedidosController;