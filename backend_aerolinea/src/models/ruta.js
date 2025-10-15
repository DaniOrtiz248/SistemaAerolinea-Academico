import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize/sequelize.js'
import Ciudad from './ciudad.js'

const Ruta = sequelize.define('ruta', {
    id_ruta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    codigo_ruta: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true
    },
    es_nacional: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    precio_primer_clase: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    precio_segunda_clase: {
        type: DataTypes.BIGINT,
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
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'ruta',
    timestamps: false
})

// Establecer relaciones

Ruta.belongsTo(Ciudad, {
    foreignKey: 'ciudad_origen',
    as: 'origen'
})

Ruta.belongsTo(Ciudad, {
    foreignKey: 'ciudad_destino',
    as: 'destino'
})

export default Ruta
