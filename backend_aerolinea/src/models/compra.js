import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Reserva from './reserva.js'
import Tarjeta from './info_tarjeta.js'

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
  reserva_id: {
    type: DataTypes.INTEGER,
    defaultValue: false,
    allowNull: false
  },
  tarjeta_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'compra',
  timestamps: false
})

Compra.belongsTo(Reserva, { foreignKey: 'reserva_id' })
Compra.belongsTo(Tarjeta, { foreignKey: 'tarjeta_id' })

export default Compra
