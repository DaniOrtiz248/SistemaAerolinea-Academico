import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Ruta from './ruta.js'

const Vuelo = sequelize.define('vuelo', {
    ccv: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_vuelo: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_salida_vuelo: {
        type: DataTypes.DATE, // TIMESTAMP
        allowNull: false
    },
    ruta_relacionada:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    porcentaje_promocion: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    asientos: {
        type: DataTypes.JSON,
        allowNull: true
    },
}, {
    tableName: 'vuelo',
    timestamps: false
})

// Establecer relaciones

Vuelo.belongsTo(Ruta, {
    foreignKey: 'ruta_relacionada',
    as: 'ruta'
})

export default Vuelo
