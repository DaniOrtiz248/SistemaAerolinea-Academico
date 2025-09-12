module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING 
    },
    rol: { 
        type: DataTypes.STRING 
    }
  }, {
    tableName: 'usuario',
    timestamps: false
  });
};