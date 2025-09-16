module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Genero', {
    id_genero: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo_genero: { 
        type: DataTypes.STRING 
    }
  }, {
    tableName: 'genero',
    timestamps: false
  });
};