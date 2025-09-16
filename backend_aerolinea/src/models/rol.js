import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'

const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'rol',
  timestamps: false
})

export default Rol
