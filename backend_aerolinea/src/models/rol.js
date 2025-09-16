module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Rol', {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion: { 
        type: DataTypes.STRING 
    }
  }, {
    tableName: 'rol',
    timestamps: false
  });
};