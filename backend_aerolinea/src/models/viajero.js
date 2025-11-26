import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Usuario from './usuario.js'
import Genero from './genero.js'

const Viajero = sequelize.define('viajero', {
  id_viajero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reserva_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dni_viajero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  primer_nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  segundo_nombre: {
    type: DataTypes.STRING
  },
  primer_apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  segundo_apellido: {
    type: DataTypes.STRING
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  id_genero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING
  },
  correo_electronico: {
    type: DataTypes.STRING
  },
  nombre_contacto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono_contacto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usuario_asociado: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
  // numero_asiento: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  // }
  // estado_reserva:{
  //   type: DataTypes.STRING,
  //   allowNull: false
  // },
  // trayecto: {
  //   type: DataTypes.ENUM('IDAVUELTA', 'SOLOIDA'),
  //   allowNull: false
  // }
  // hizo_checkin:{
  //   type: DataTypes.INTEGER,
  //   defaultValue: false,
  //   allowNull: false
  // } Se hace en el ticket
}, {
  tableName: 'viajero',
  timestamps: false
})

Viajero.belongsTo(Genero, { foreignKey: 'id_genero' })
Viajero.belongsTo(Usuario, { foreignKey: 'usuario_asociado' })

export default Viajero
