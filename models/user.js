const { DataTypes } = require("sequelize");
const sequelize = require("../db.config");
const bcrypt = require("bcrypt");

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
      type: DataTypes.STRING(64),
      is: /^[0-9a-f]{64}$/i,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
  },
  { paranoid: true } // soft delete (archive)
);

//hook sequelize
// avant la création le mot de passe est haché
User.beforeCreate(async (user, options) => {
  let hash = await bcrypt.hash(
    user.password,
    parseInt(process.env.BCRYPT_SALT_ROUND)
  );
  user.password = hash;
});

User.checkPassword = async (password, originelPassword) => {
  return await bcrypt.compare(password, originelPassword);
};

module.exports = User;
