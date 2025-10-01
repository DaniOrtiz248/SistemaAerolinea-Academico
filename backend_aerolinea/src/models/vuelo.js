import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'

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
    tipo_vuelo: {
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
    hora_llegada_vuelo: {
        type: DataTypes.DATE, // TIMESTAMP
        allowNull: false
    },
    ciudad_origen: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ciudad_destino: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    costo_unitario: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'vuelo',
    timestamps: false
})

export default Vuelo