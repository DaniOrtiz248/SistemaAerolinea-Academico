import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Viajero from './viajero.js'
import Vuelo from './vuelo.js'
import Asiento from './asiento.js'
import Reserva from './reserva.js'

const SegmentoViaje = sequelize.define('segmento_viaje', {
  id_segmento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  viajero_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vuelo_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trayecto: {
    type: DataTypes.ENUM('IDA', 'VUELTA'),
    allowNull: false
  },
  asiento_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reserva_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'segmento_viaje',
  timestamps: false
})

SegmentoViaje.belongsTo(Viajero, { foreignKey: 'viajero_id' })
SegmentoViaje.belongsTo(Vuelo, { foreignKey: 'vuelo_id' })
SegmentoViaje.belongsTo(Asiento, { foreignKey: 'asiento_id' })
SegmentoViaje.belongsTo(Reserva, { foreignKey: 'reserva_id' })

export default SegmentoViaje
