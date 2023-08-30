module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: { msg: "Le nom est déjà pris" },
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom ne peut pas être vide." },
        notNull: { msg: "Le nom est une propriété requise." },
        len: [1, 25],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le mot de passe ne peut pas être vide." },
        notNull: { msg: "Le mot de passe est une propriété requise." },
      },
    },
  });
};
