module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PerfilUsuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    primer_nombre: { 
        type: DataTypes.STRING 
    },
    segundo_nombre: { 
        type: DataTypes.STRING 
    },
    primer_apellido: { 
        type: DataTypes.STRING 
    },
    segundo_apellido: { 
        type: DataTypes.STRING 
    },
    fecha_nacimiento: { 
        type: DataTypes.DATE 
    },
    lugar_nacimiento: { 
        type: DataTypes.STRING 
    },
    direccion_facturacion: { 
        type: DataTypes.STRING 
    },
    id_genero_usuario: { 
        type: DataTypes.INTEGER
    },
    imagen_usuario: { 
        type: DataTypes.STRING 
    }
  }, {
    tableName: 'usuario_perfil',
    timestamps: false
  });
};

PerfilUsuario.belongsTo(Genero, { foreignKey: 'id_genero_usuario' });
PerfilUsuario.belongsTo(Usuario, { foreignKey: 'id_usuario' });