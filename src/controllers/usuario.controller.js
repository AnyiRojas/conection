import { Usuario } from "../models/Usuario.model.js";

class UsuarioController {
  static async getUsuarios(req, res) {
    try {
      const usuarios = await Usuario.getUsuarios();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
  }

  static async getUsuarioById(req, res) {
    const { id } = req.params;
    try {
      const usuario = await Usuario.getUsuarioById(id);
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error });
    }
  }

  static async postUsuario(req, res) {
    const usuarioData = req.body;
    try {
      const message = await Usuario.createUsuario(usuarioData);
      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear usuario', error });
    }
  }

  static async putUsuario(req, res) {
    const { id } = req.params;
    const {
      nombre_usuario,
      apellido_usuario,
      celular_usuario,
      correo_electronico_usuario,
      usuario
    } = req.body;

    try {
      const usuarioExistente = await Usuario.getUsuarioById(id);
      if (!usuarioExistente) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const updatedData = {
        nombre_usuario,
        apellido_usuario,
        celular_usuario,
        correo_electronico_usuario,
        usuario,
      };

      const message = await Usuario.updateUsuario(id, updatedData);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
  }

  static async patchUsuarioEstado(req, res) {
    const { id } = req.params;
    try {
      const message = await Usuario.toggleUsuarioState(id);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar estado de usuario', error });
    }
  }
}

export default UsuarioController;