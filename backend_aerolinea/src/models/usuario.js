module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion_usuario: { 
        type: DataTypes.STRING 
    },
    correo_electronico: { 
        type: DataTypes.STRING 
    },
    contrasena: { 
        type: DataTypes.STRING 
    },
    id_rol: { 
        type: DataTypes.INTEGER
    }
  }, {
    tableName: 'usuario',
    timestamps: false
  });
};

Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });