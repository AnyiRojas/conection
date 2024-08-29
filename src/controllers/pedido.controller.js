import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PedidoController {
    static async getPedidos(req, res) {
        try {
            const pedidos = await sequelize.query('CALL GetPedidos()', { type: QueryTypes.SELECT });
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los pedidos', error });
        }
    }

    static async getPedido(req, res) {
        const { id } = req.params;
        try {
            const result = await sequelize.query('CALL GetPedidoById(:id)', {
                replacements: { id },
                type: QueryTypes.SELECT
            });

            const pedido = result[0];
            if (pedido) {
                res.json(pedido);
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el pedido', error });
        }
    }

    static async postPedido(req, res) {
        try {
            console.log('Headers:', req.headers);
            console.log('Files:', req.files);
            console.log('Body:', req.body);

            const estadosPermitidos = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
            if (!estadosPermitidos.includes(req.body.estado_pedido)) {
                return res.status(400).json({ message: 'Estado de pedido no válido' });
            }

            const [usuario] = await sequelize.query('SELECT 1 FROM usuario WHERE id_usuario = :usuario_id', {
                replacements: { usuario_id: req.body.usuario_id },
                type: QueryTypes.SELECT
            });

            const [pago] = await sequelize.query('SELECT 1 FROM pago WHERE id_pago = :pago_id', {
                replacements: { pago_id: req.body.pago_id },
                type: QueryTypes.SELECT
            });
            console.log('Pago:', pago);

            if (!usuario) {
                return res.status(400).json({ message: 'Usuario no encontrado' });
            }
            if (!pago) {
                return res.status(400).json({ message: 'Pago no encontrado' });
            }

            if (!req.files || !req.files.foto_Pedido) {
                return res.status(400).json({ message: 'No se subió ningún archivo' });
            }

            const uploadedFile = req.files.foto_Pedido;
            const uniqueFileName = `${Date.now()}_${uploadedFile.name}`;
            const uploadPath = path.join(__dirname, '../uploads/img/pedido/', uniqueFileName);
            const foto_PedidoURL = `http://localhost:4000/uploads/img/pedido/${uniqueFileName}`;

            uploadedFile.mv(uploadPath, async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al subir la imagen: ' + err });
                }

                const pedidoData = {
                    fecha_pedido: req.body.fecha_pedido,
                    estado_pedido: req.body.estado_pedido,
                    total_pagado: req.body.total_pagado,
                    usuario_id: req.body.usuario_id,
                    pago_id: req.body.pago_id,
                    foto_Pedido: `uploads/img/pedido/${uniqueFileName}`,
                    foto_PedidoURL
                };

                await sequelize.query('CALL CreatePedido(:fecha_pedido, :estado_pedido, :total_pagado, :usuario_id, :pago_id, :foto_Pedido, :foto_PedidoURL)', {
                    replacements: pedidoData,
                    type: QueryTypes.RAW
                });

                res.status(201).json({ message: 'Pedido creado correctamente' });
            });
        } catch (error) {
            console.error('Error en postPedido:', error);
            res.status(500).json({ message: 'Error al crear el pedido: ' + error.message });
        }
    }

    static async putPedido(req, res) {
        try {
            const id = req.params.id;
            const { fecha_pedido, estado_pedido, total_pagado, usuario_id, pago_id } = req.body;
    
            // Validar estado del pedido
            const estadosPermitidos = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
            if (!estadosPermitidos.includes(estado_pedido)) {
                return res.status(400).json({ message: 'Estado de pedido no válido' });
            }
    
            // Obtener el pedido actual para verificar la existencia
            const result = await sequelize.query('CALL GetPedidoById(:pedido_id)', {
                replacements: { pedido_id: id },
                type: QueryTypes.SELECT
            });
    
            const pedido = result[0]; // Asegurarse de que la consulta devuelve una fila
    
            if (!pedido) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
    
            // Manejar la imagen si se sube una nueva
            let foto_Pedido = pedido.foto_Pedido;
            let foto_PedidoURL = pedido.foto_PedidoURL;
    
            if (req.files && req.files.foto_Pedido) {
                const uploadedFile = req.files.foto_Pedido;
                const timestamp = Date.now();
                const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
                const uploadPath = path.join(__dirname, '../uploads/img/pedido/', uniqueFileName);
                foto_PedidoURL = `${req.protocol}://${req.get('host')}/uploads/img/pedido/${uniqueFileName}`;
    
                await uploadedFile.mv(uploadPath);
    
                // Eliminar la foto anterior si existe
                if (foto_Pedido) {
                    try {
                        const oldPath = path.join(__dirname, '..', foto_Pedido);
                        if (fs.existsSync(oldPath)) {
                            fs.unlinkSync(oldPath);
                        }
                    } catch (error) {
                        console.error('Error al eliminar la foto anterior:', error);
                    }
                }
    
                foto_Pedido = `./uploads/img/pedido/${uniqueFileName}`;
            }
    
            // Actualizar el pedido
            await sequelize.query('CALL UpdatePedido(:pedido_id, :fecha_pedido, :estado_pedido, :total_pagado, :usuario_id, :pago_id, :foto_Pedido, :foto_PedidoURL)', {
                replacements: { 
                    pedido_id: id, 
                    fecha_pedido, 
                    estado_pedido, 
                    total_pagado, 
                    usuario_id, 
                    pago_id, 
                    foto_Pedido, 
                    foto_PedidoURL 
                },
                type: QueryTypes.RAW
            });
    
            res.status(200).json({ message: 'Pedido actualizado correctamente' });
        } catch (error) {
            console.error('Error en putPedido:', error);
            res.status(500).json({ message: 'Error al actualizar el pedido: ' + error.message });
        }
    }
}

export default PedidoController;
