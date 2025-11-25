import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Usuario from './usuario.js'

const Tarjeta = sequelize.define('info_tarjeta', {
  id_info_tarjeta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo_tarjeta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tipo_entidad:{
    type: DataTypes.STRING
  },
  CVC:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  saldo:{
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  id_usuario_tarjeta:{
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'info_tarjeta',
  timestamps: false
})

Tarjeta.belongsTo(Usuario, { foreignKey: 'usuario_asociado' })

export default Tarjeta