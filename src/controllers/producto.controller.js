// src/controllers/producto.controller.js
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Producto } from '../models/producto.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductoController {
    static async getProductos(req, res) {
        try {
            const productos = await Producto.getProductos();
            res.json(productos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los productos', error });
        }
    }

    static async getProductoById(req, res) {
        const { id } = req.params;
        try {
            const producto = await Producto.getProductoById(id);
            if (producto) {
                res.json(producto);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el producto', error });
        }
    }

    static async postProducto(req, res) {
        try {
            if (!req.files || !req.files.foto_Producto) {
                return res.status(400).json({ message: 'No se subió ningún archivo' });
            }

            const uploadedFile = req.files.foto_Producto;
            const timestamp = Date.now();
            const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
            const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
            const fotoProductoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;

            uploadedFile.mv(uploadPath, async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al subir la imagen: ' + err });
                }

                const p = {
                    nombre_producto: req.body.nombre_producto,
                    descripcion_producto: req.body.descripcion_producto,
                    precio_producto: req.body.precio_producto,
                    estado_producto: req.body.estado_producto,
                    tipo_producto: req.body.tipo_producto,
                    foto_Producto: `./uploads/img/producto/${uniqueFileName}`,
                    foto_ProductoURL: fotoProductoURL
                };

                await Producto.createProducto(p);
                return res.status(200).json({ message: 'Producto creado correctamente' });
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error al crear el producto: ' + error });
        }
    }

    static async putProducto(req, res) {
        try {
            const id = req.params.id;
            const productoExistente = await Producto.getProductoById(id);
    
            if (!productoExistente) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
    
            let updatedProducto = {
                nombre_producto: req.body.nombre_producto,
                descripcion_producto: req.body.descripcion_producto,
                precio_producto: req.body.precio_producto,
                estado_producto: req.body.estado_producto || '1',
                tipo_producto: req.body.tipo_producto,
                foto_Producto: productoExistente.foto_Producto,
                foto_ProductoURL: productoExistente.foto_ProductoURL
            };
    
            if (req.files && req.files.foto_Producto) {
                const uploadedFile = req.files.foto_Producto;
                const timestamp = Date.now();
                const uniqueFileName = `${uploadedFile.name.split('.')[0]}_${timestamp}.${uploadedFile.name.split('.').pop()}`;
                const uploadPath = path.join(__dirname, '../uploads/img/producto/', uniqueFileName);
                const foto_ProductoURL = `http://localhost:4000/uploads/img/producto/${uniqueFileName}`;
    
                uploadedFile.mv(uploadPath, async (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error al mover el archivo: ' + err });
                    }
    
                    if (productoExistente.foto_Producto) {
                        const oldImagePath = path.join(__dirname, '..', productoExistente.foto_Producto);
                        if (fs.existsSync(oldImagePath)) {
                            try {
                                fs.unlinkSync(oldImagePath);
                                console.log('Imagen anterior eliminada:', oldImagePath);
                            } catch (unlinkError) {
                                console.error('Error al eliminar la imagen anterior:', unlinkError);
                            }
                        }
                    }
    
                    updatedProducto = { ...updatedProducto, foto_Producto: `./uploads/img/producto/${uniqueFileName}`, foto_ProductoURL };
    
                    await Producto.updateProducto(id, updatedProducto);
                    res.status(200).json({ message: 'Producto actualizado correctamente' });
                });
            } else {
                // Actualizar el producto sin cambiar la imagen
                await Producto.updateProducto(id, updatedProducto);
                res.status(200).json({ message: 'Producto actualizado correctamente' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el producto: ' + error });
        }
    }

    static async patchProducto(req, res) {
        try {
            const id = req.params.id;
            const producto = await Producto.toggleProductoState(id);
            res.status(200).json({ message: 'Estado del producto actualizado correctamente', producto });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el estado del producto: ' + error });
        }
    }
}

export default ProductoController;