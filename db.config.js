// import des modules nécessaires
const { Sequelize } = require("sequelize");

// connexion à la base ded données
let sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);
// synchronisation  des modèles
sequelize.sync(() => {
  console.log("sequelize connection successfull");
});

module.exports = sequelize;
