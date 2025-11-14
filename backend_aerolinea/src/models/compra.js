import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'

const Compra = sequelize.define('compra', {
  id_compra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_compra: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valor_total: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  es_pago: {
    type: DataTypes.INTEGER,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'compra',
  timestamps: false
})

export default Compra