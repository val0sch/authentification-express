const { DataTypes } = require("sequelize");
const sequelize = require("../db.config");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // validation de données
      },
      unique: true,
    },
    password: {
      // type: DataTypes.STRING(64),
      type: DataTypes.STRING,
      allowNull: false,
      // is: /^[0-9a-f]{64}$/i, // contrainte en regex
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
  },
  { paranoid: true } // soft delete (archive)
);

module.exports = User;
