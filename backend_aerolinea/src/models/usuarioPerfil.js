import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Usuario from './usuario.js'
import Genero from './genero.js'

const UsuarioPerfil = sequelize.define('usuario_perfil', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dni_usuario: {
    type: DataTypes.STRING,
    unique: true
  },
  primer_nombre: {
    type: DataTypes.STRING
  },
  segundo_nombre: {
    type: DataTypes.STRING
  },
  primer_apellido: {
    type: DataTypes.STRING
  },
  segundo_apellido: {
    type: DataTypes.STRING
  },
  fecha_nacimiento: {
    type: DataTypes.DATE
  },
  pais_nacimiento: {
    type: DataTypes.STRING
  },
  estado_nacimiento: {
    type: DataTypes.STRING
  },
  ciudad_nacimiento: {
    type: DataTypes.STRING
  },
  direccion_facturacion: {
    type: DataTypes.STRING
  },
  id_genero_usuario: {
    type: DataTypes.INTEGER
  },
  imagen_usuario: {
    type: DataTypes.STRING
  },
  en_noticias:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'usuario_perfil',
  timestamps: false
})

UsuarioPerfil.belongsTo(Genero, { foreignKey: 'id_genero_usuario' })
UsuarioPerfil.belongsTo(Usuario, { foreignKey: 'id_usuario' })

export default UsuarioPerfil
