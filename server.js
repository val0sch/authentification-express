const express = require("express");
const cors = require("cors");
let DB = require("./db.config");
const jwtCheck = require("./middleware/jwtCheck");

/************************/
/*** API Initialization */
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders:
      "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/****************************/
/*** Import routers modules */
const auth_router = require("./routers/auth");
const user_router = require("./routers/user");

/****************************/
/*** Main router parameters */

app.get("/", (req, res) => res.send(`I'm online. All is OK !`));

app.use("/auth", auth_router);
app.use("/users", jwtCheck, user_router);

app.get("*", (req, res) => res.status(501).send("Cette page n'existe pas!"));

/********************************/
/*** Start serveur avec test DB */
DB.authenticate()
  .then(() => {
    console.log("database connection successfull");
  })
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log(
        `This server is running on port ${process.env.SERVER_PORT}. Have fun !`
      );
    });
  })
  .catch((err) => console.log("DB error", err));
