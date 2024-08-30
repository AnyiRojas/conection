// src/models/Usuario.model.js
import { DataTypes, Model, QueryTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from 'bcrypt';

class Usuario extends Model {
  static async createUsuario(usuario) {
    try {
      const claveEncriptada = await bcrypt.hash(usuario.contrasena_usuario, 10); 
      usuario.contrasena_usuario = claveEncriptada;
      return await this.create(usuario);
    } catch (error) {
      console.error(`Unable to create usuario: ${error}`);
      throw error;
    }
  }

  static async getUsuarios() {
    try {
      return await this.findAll();
    } catch (error) {
      console.error(`Unable to find all usuarios: ${error}`);
      throw error;
    }
  }

  static async getUsuarioById(id) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      console.error(`Unable to find usuario by id: ${error}`);
      throw error;
    }
  }

  static async updateUsuario(id, updated_usuario) {
    try {
      const usuario = await this.findByPk(id);
      return usuario.update(updated_usuario);
    } catch (error) {
      console.error(`Unable to update the usuario: ${error}`);
      throw error;
    }
  }

  static async toggleUsuarioState(id) {
    try {
      const usuario = await this.findByPk(id);
      const newState = usuario.estado_usuario === '1' ? '0' : '1';
      await usuario.update({ estado_usuario: newState });
      return usuario;
    } catch (error) {
      console.error(`Unable to toggle usuario state: ${error}`);
      throw error;
    }
  }

  async comparar(contrasena_usuario) {
    try {
      return await bcrypt.compare(contrasena_usuario, this.contrasena_usuario);
    } catch (error) {
      console.error("Error al comparar las contraseñas:", error);
      throw error;
    }
  }
  
}

Usuario.init({
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  celular_usuario: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  correo_electronico_usuario: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  usuario: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  contrasena_usuario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rol_usuario: {
    type: DataTypes.ENUM('Cliente', 'Administrador', 'Vendedor', 'Domiciliario'),
    allowNull: false
  },
  estado_usuario: {
    type: DataTypes.CHAR,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'Usuario',
  timestamps: false,
  underscored: false,
});

export { Usuario };
