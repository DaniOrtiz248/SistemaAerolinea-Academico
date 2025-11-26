import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Usuario from './usuario.js'
import Viajero from './viajero.js'
import Vuelo from './vuelo.js'

const Reserva = sequelize.define('reserva', {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo_reserva: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  clase_reserva: {
    type: DataTypes.ENUM('PRIMERACLASE', 'SEGUNDACLASE'),
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_reserva: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_expiracion: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado_reserva: {
    type: DataTypes.ENUM('ACTIVA', 'CANCELADA', 'PAGADA'),
    allowNull: false
  },
  cantidad_viajeros: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  vuelo_ida_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vuelo_vuelta_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  trayectoria: {
    type: DataTypes.ENUM('IDAVUELTA', 'SOLOIDA'),
    allowNull: false
  }
}, {
  tableName: 'reserva',
  timestamps: false
})

Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id' })
Reserva.hasMany(Viajero, { foreignKey: 'reserva_id' })
Reserva.belongsTo(Vuelo, { foreignKey: 'vuelo_ida_id', as: 'vuelo_ida' })
Reserva.belongsTo(Vuelo, { foreignKey: 'vuelo_vuelta_id', as: 'vuelo_vuelta' })

export default Reserva
