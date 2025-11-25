import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Vuelo from './vuelo.js'

const Asiento = sequelize.define('asiento', {
  id_asiento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  asiento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fila: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  columna: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('DISPONIBLE', 'RESERVADO', 'OCUPADO'),
    allowNull: false
  },
  vuelo_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  clase: {
    type: DataTypes.ENUM('PRIMERACLASE', 'SEGUNDACLASE'),
    allowNull: false
  }
}, {
  tableName: 'asiento',
  timestamps: false
})

Asiento.belongsTo(Vuelo, { foreignKey: 'vuelo_id' })

export default Asiento
