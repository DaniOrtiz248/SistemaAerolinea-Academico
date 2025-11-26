import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Compra from './compra.js'
import Vuelo from './vuelo.js'
import Viajero from './viajero.js'

const Tiquete = sequelize.define('tiquete', {
  id_tiquete: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo_reserva: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo_trayecto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_vuelo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  costo_tiquete: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  clase_silla_tiquete: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maleta_extra: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numero_silla: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_compra: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_viajero_tiquete: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'tiquete',
  timestamps: false
})

Tiquete.belongsTo(Compra, { foreignKey: 'id_compra' })
Tiquete.belongsTo(Vuelo, { foreignKey: 'id_vuelo' })
Tiquete.belongsTo(Viajero, { foreignKey: 'id_viajero_tiquete' })

export default Tiquete
