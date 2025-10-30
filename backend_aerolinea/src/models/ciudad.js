import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'

const Ciudad = sequelize.define('ciudad', {
  id_ciudad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre_ciudad: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  imagen_ciudad: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  es_nacional: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'ciudad',
  timestamps: false
})

export default Ciudad
