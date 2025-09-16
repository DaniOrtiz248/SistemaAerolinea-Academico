import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'

const Genero = sequelize.define('genero', {
  id_genero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_genero: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'genero',
  timestamps: false
})

export default Genero
