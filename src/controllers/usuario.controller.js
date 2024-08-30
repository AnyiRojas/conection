// src/controllers/usuario.controller.js
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuario } from "../models/Usuario.model.js";

class UsuarioController {
    static async getUsuarios(req, res) {
        try {
          const usuarios = await sequelize.query('CALL GetUsuarios()', { type: QueryTypes.RAW });
          res.json(usuarios);
        } catch (error) {
          res.status(500).json({ message: 'Error al obtener usuarios', error });
        }
      }
    
      static async getUsuarioById(req, res) {
        const { id } = req.params;
        try {
          const usuario = await sequelize.query('CALL GetUsuarioById(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
          });
          res.json(usuario);
        } catch (error) {
          res.status(500).json({ message: 'Error al obtener usuario', error });
        }
      }
    
      static async postUsuario(req, res) {
        const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario } = req.body;
        try {
          await sequelize.query('CALL CreateUsuario(:nombre_usuario, :apellido_usuario, :celular_usuario, :correo_electronico_usuario, :usuario, :contrasena_usuario, :rol_usuario, :estado_usuario)', {
            replacements: { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario },
            type: QueryTypes.RAW
          });
          res.status(201).json({ message: 'Usuario creado' });
        } catch (error) {
          res.status(500).json({ message: 'Error al crear usuario', error });
        }
      }
    
      static async putUsuario(req, res) {
        const { id } = req.params;
        const { nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario } = req.body;
        try {
          await sequelize.query('CALL UpdateUsuario(:id, :nombre_usuario, :apellido_usuario, :celular_usuario, :correo_electronico_usuario, :usuario, :contrasena_usuario, :rol_usuario, :estado_usuario)', {
            replacements: { id, nombre_usuario, apellido_usuario, celular_usuario, correo_electronico_usuario, usuario, contrasena_usuario, rol_usuario, estado_usuario },
            type: QueryTypes.RAW
          });
          res.json({ message: 'Usuario actualizado' });
        } catch (error) {
          res.status(500).json({ message: 'Error al actualizar usuario', error });
        }
      }
    
      static async patchUsuarioEstado(req, res) {
        const { id } = req.params;
        try {
          await sequelize.query('CALL ToggleUsuarioEstado(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
          });
          res.json({ message: 'Estado de usuario actualizado' });
        } catch (error) {
          res.status(500).json({ message: 'Error al cambiar estado de usuario', error });
        }
      }
    
      
      static async deleteUsuario(req, res) {
        const { id } = req.params;
        try {
          await sequelize.query('CALL DeleteUsuario(:id)', {
            replacements: { id },
            type: QueryTypes.RAW
          });
          res.json({ message: 'Usuario eliminado' });
        } catch (error) {
          res.status(500).json({ message: 'Error al eliminar usuario', error });
        }
      }
    
    
}

export default UsuarioController;
